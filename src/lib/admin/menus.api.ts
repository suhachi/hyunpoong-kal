/**
 * 관리자 메뉴 관리 API
 * USE_FIREBASE=false: Mock 데이터 반환
 * USE_FIREBASE=true: Firestore 연동
 * v1.0 STEP 4: Firestore stores/{storeId}/menus 구조로 전환
 */

import { Menu, MenuFilters, MenuLog, MenuStatus } from '../../types/menu';
import menusData from '../../data/menus.json';
import { USE_FIREBASE, getEnv } from '../../config/env';
import { getOptionGroups, getOptionGroupById } from './optionGroups.api';
import {
  type MenuDoc,
  storeMenusCollection,
  storeMenuDocRef,
} from '../firebase/firestore-schema';
import {
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  type Timestamp,
} from 'firebase/firestore';
import type { FirebaseError } from 'firebase/app';
import { db } from '../firebase';

// Mock 데이터 (menus.json 기반)
// localStorage에서 저장된 데이터를 먼저 확인, 없으면 menus.json 사용
const STORAGE_KEY = 'hyunpoong_mock_menus';
const getStoredMenus = (): Menu[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Date 객체 복원
      return parsed.map((m: any) => ({
        ...m,
        // 필요시 Date 필드 복원
      }));
    }
  } catch (error) {
    console.error('Failed to load stored menus:', error);
  }
  return Array.isArray(menusData) ? menusData : [];
};

let mockMenus: Menu[] = getStoredMenus();

// Mock 데이터를 localStorage에 저장
const saveMenusToStorage = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockMenus));
  } catch (error) {
    console.error('Failed to save menus to storage:', error);
  }
};

// Mock 로그
let mockMenuLogs: MenuLog[] = [];

// ============================================================================
// Menu ↔ MenuDoc 매퍼 함수
// ============================================================================

/**
 * 도메인 Menu → Firestore MenuDoc 변환 (작성용)
 */
function buildMenuDocFromEntity(params: {
  storeId: string;
  menuId: string;
  menu: Menu;
}): Omit<MenuDoc, 'createdAt' | 'updatedAt'> {
  const { storeId, menuId, menu } = params;

  const menuDoc: Omit<MenuDoc, 'createdAt' | 'updatedAt'> = {
    menuId,
    storeId,
    category: menu.category,
    name: menu.name,
    price: menu.price,
    description: menu.description || '',
    imageUrl: menu.image || '', // Menu.image → MenuDoc.imageUrl
    imagePath: '', // Storage 경로는 업로드 시 설정
    badges: menu.badges || [],
    optionGroups: menu.optionGroups?.map(og => og.id) || [],
    allergens: menu.allergens || [],
    origin: menu.origin || '',
    isAvailable: menu.isAvailable ?? true,
    order: typeof menu.order === 'number' ? menu.order : 0,
  };

  // options는 undefined인 경우 필드에서 제외 (Firestore는 undefined 허용 안 함)
  if (menu.options !== undefined) {
    menuDoc.options = menu.options;
  }

  // availableHours는 undefined인 경우 필드에서 제외 (Firestore는 undefined 허용 안 함)
  if (menu.availableHours !== undefined) {
    menuDoc.availableHours = menu.availableHours;
  }

  return menuDoc;
}

/**
 * Firestore MenuDoc → 도메인 Menu 변환 (읽기용)
 */
async function buildMenuFromDoc(docData: MenuDoc): Promise<Menu> {
  // Timestamp → string 변환 헬퍼 (Order 매퍼와 동일한 패턴)
  const toDateOrString = (ts: Timestamp | undefined): string | undefined => {
    if (!ts) return undefined;
    if (typeof ts === 'string') return ts;
    if (typeof ts.toDate === 'function') {
      return ts.toDate().toISOString();
    }
    // Mock 모드 호환: { seconds, nanoseconds } 형태
    if ((ts as any).seconds && typeof (ts as any).seconds === 'number') {
      return new Date((ts as any).seconds * 1000).toISOString();
    }
    return undefined;
  };

  // optionGroups ID 배열을 실제 OptionGroup 객체로 변환
  let resolvedOptionGroups: Menu['optionGroups'] = [];
  if (docData.optionGroups && docData.optionGroups.length > 0) {
    try {
      // 모든 옵션 그룹을 가져와서 ID로 매칭
      const allOptionGroups = await getOptionGroups();
      resolvedOptionGroups = docData.optionGroups
        .map(id => allOptionGroups.find(og => og.id === id))
        .filter((og): og is NonNullable<typeof og> => og !== undefined);
    } catch (error) {
      console.warn('[buildMenuFromDoc] Failed to resolve option groups:', error);
      // 에러 발생 시 빈 배열 유지
      resolvedOptionGroups = [];
    }
  }

  return {
    menuId: docData.menuId,
    category: docData.category,
    name: docData.name,
    price: docData.price,
    description: docData.description,
    image: docData.imageUrl || '', // MenuDoc.imageUrl → Menu.image
    badges: docData.badges || [],
    options: docData.options,
    optionGroups: resolvedOptionGroups,
    allergens: docData.allergens || [],
    origin: docData.origin || '',
    isAvailable: docData.isAvailable,
    availableHours: docData.availableHours,
    order: docData.order,
    // createdAt, updatedAt는 Menu 타입에 없지만 필요시 추가 가능
  };
}

/**
 * storeId 가져오기 헬퍼
 */
function getStoreId(): string {
  return getEnv('VITE_STORE_ID', 'hyunpoong_main');
}

// ============================================================================
// Mock 모드 함수 (기존 로직 보전)
// ============================================================================

/**
 * 메뉴 현재 상태 계산 (시간제 고려)
 */
export function getMenuStatus(menu: Menu): MenuStatus {
  if (!menu.isAvailable) {
    return 'soldout';
  }

  if (menu.availableHours) {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;

    const [startHour, startMinute] = menu.availableHours.start.split(':').map(Number);
    const [endHour, endMinute] = menu.availableHours.end.split(':').map(Number);
    const startTime = startHour * 60 + startMinute;
    const endTime = endHour * 60 + endMinute;

    if (currentTime < startTime || currentTime >= endTime) {
      return 'time-limited';
    }
  }

  return 'available';
}

/**
 * Mock 모드: 메뉴 목록 조회
 */
async function getMenusMock(filters: MenuFilters = {}): Promise<Menu[]> {
  await new Promise(resolve => setTimeout(resolve, 300));

  let filtered = [...mockMenus];

  // 카테고리 필터
  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter(m => m.category === filters.category);
  }

  // 검색 (이름/태그)
  if (filters.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(m => 
      m.name.toLowerCase().includes(search) ||
      m.description.toLowerCase().includes(search) ||
      m.badges.some(b => b.toLowerCase().includes(search))
    );
  }

  // 판매 가능만
  if (filters.availableOnly) {
    filtered = filtered.filter(m => getMenuStatus(m) === 'available');
  }

  // 정렬
  switch (filters.sortBy) {
    case 'name':
      filtered.sort((a, b) => a.name.localeCompare(b.name, 'ko'));
      break;
    case 'price-asc':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'order':
    default:
      filtered.sort((a, b) => a.order - b.order);
      break;
  }

  return filtered;
}

/**
 * 메뉴 목록 조회 (필터/정렬)
 */
export async function getMenus(filters: MenuFilters = {}): Promise<Menu[]> {
  if (!USE_FIREBASE) {
    return await getMenusMock(filters);
  }

  // Firebase 모드: Firestore stores/{storeId}/menus에서 조회
  try {
    const storeId = getStoreId();
    console.log('[getMenus] storeId:', storeId);
    const colRef = storeMenusCollection(storeId);
    console.log('[getMenus] collection path:', colRef.path);

    const constraints: any[] = [];

    // 카테고리 필터
    if (filters.category && filters.category !== 'all') {
      constraints.push(where('category', '==', filters.category));
    }

    // 정렬: 기본적으로 order 필드로 정렬
    if (filters.sortBy === 'order' || !filters.sortBy) {
      constraints.push(orderBy('order', 'asc'));
    } else if (filters.sortBy === 'name') {
      constraints.push(orderBy('name', 'asc'));
    } else if (filters.sortBy === 'price-asc') {
      constraints.push(orderBy('price', 'asc'));
    } else if (filters.sortBy === 'price-desc') {
      constraints.push(orderBy('price', 'desc'));
    }

    // createdAt로 보조 정렬
    constraints.push(orderBy('createdAt', 'asc'));

    console.log('[getMenus] query constraints:', constraints.length);
    const q = query(colRef, ...constraints);
    const snapshot = await getDocs(q);
    console.log('[getMenus] snapshot size:', snapshot.size);
    const menus: Menu[] = [];

    // 모든 문서를 병렬로 처리
    const menuPromises = snapshot.docs.map(async (docSnap) => {
      const data = docSnap.data() as MenuDoc;
      data.menuId = data.menuId || docSnap.id;
      return await buildMenuFromDoc(data);
    });
    const resolvedMenus = await Promise.all(menuPromises);
    menus.push(...resolvedMenus);

    // 클라이언트 측 필터링 (검색, availableOnly)
    let filtered = menus;

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(m => 
        m.name.toLowerCase().includes(search) ||
        m.description.toLowerCase().includes(search) ||
        m.badges.some(b => b.toLowerCase().includes(search))
      );
    }

    if (filters.availableOnly) {
      filtered = filtered.filter(m => getMenuStatus(m) === 'available');
    }

    console.log('[getMenus] filtered menus count:', filtered.length);
    return filtered;
  } catch (error) {
    console.error('[getMenus] Failed to fetch menus from Firestore:', error);
    if (error instanceof Error) {
      console.error('[getMenus] Error message:', error.message);
      console.error('[getMenus] Error stack:', error.stack);
    }
    return [];
  }
}

/**
 * Mock 모드: 메뉴 단건 조회
 */
async function getMenuByIdMock(menuId: string): Promise<Menu | null> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockMenus.find(m => m.menuId === menuId) || null;
}

/**
 * 메뉴 단건 조회
 */
export async function getMenuById(menuId: string): Promise<Menu | null> {
  if (!USE_FIREBASE) {
    return await getMenuByIdMock(menuId);
  }

  // Firebase 모드: Firestore stores/{storeId}/menus/{menuId}에서 조회
  try {
    const storeId = getStoreId();
    const ref = storeMenuDocRef(storeId, menuId);
    const snapshot = await getDoc(ref);
    
    if (!snapshot.exists()) {
      return null;
    }

    const data = snapshot.data() as MenuDoc;
    data.menuId = data.menuId || snapshot.id;
    return await buildMenuFromDoc(data);
  } catch (error) {
    console.error('Failed to fetch menu from Firestore:', error);
    return null;
  }
}

/**
 * Mock 모드: 메뉴 품절/판매 토글
 */
async function toggleMenuAvailabilityMock(
  menuId: string,
  by: string,
  byName: string
): Promise<Menu> {
  await new Promise(resolve => setTimeout(resolve, 400));

  const menu = mockMenus.find(m => m.menuId === menuId);
  if (!menu) {
    throw new Error('메뉴를 찾을 수 없습니다');
  }

  const oldValue = menu.isAvailable;
  const newValue = !oldValue;

  menu.isAvailable = newValue;

  // 로그 기록
  mockMenuLogs.push({
    id: `log-${Date.now()}`,
    menuId,
    field: 'isAvailable',
    oldValue,
    newValue,
    by,
    byName,
    at: new Date(),
    reason: newValue ? '판매 재개' : '품절 처리',
  });

  // 변경사항을 localStorage에 저장
  saveMenusToStorage();

  return menu;
}

/**
 * 메뉴 품절/판매 토글
 */
export async function toggleMenuAvailability(
  menuId: string,
  by: string,
  byName: string
): Promise<Menu> {
  if (!USE_FIREBASE) {
    return await toggleMenuAvailabilityMock(menuId, by, byName);
  }

  // Firebase 모드: Firestore stores/{storeId}/menus/{menuId} 업데이트
  try {
    const storeId = getStoreId();
    const ref = storeMenuDocRef(storeId, menuId);
    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) {
      throw new Error('메뉴를 찾을 수 없습니다.');
    }

    const prev = snapshot.data() as MenuDoc;
    const newValue = !prev.isAvailable;

    await updateDoc(ref, {
      isAvailable: newValue,
      updatedAt: serverTimestamp(),
    });

    // 업데이트된 문서 읽기
    const afterSnap = await getDoc(ref);
    const afterData = afterSnap.data() as MenuDoc;
    afterData.menuId = afterData.menuId || afterSnap.id;

    return await buildMenuFromDoc(afterData);
  } catch (error) {
    console.error('Failed to toggle menu availability in Firestore:', error);
    throw error;
  }
}

/**
 * Mock 모드: 메뉴 시간제 설정
 */
async function updateMenuAvailableHoursMock(
  menuId: string,
  availableHours: { start: string; end: string } | null,
  by: string,
  byName: string
): Promise<Menu> {
  await new Promise(resolve => setTimeout(resolve, 400));

  const menu = mockMenus.find(m => m.menuId === menuId);
  if (!menu) {
    throw new Error('메뉴를 찾을 수 없습니다');
  }

  const oldValue = menu.availableHours;
  menu.availableHours = availableHours || undefined;

  // 로그 기록
  mockMenuLogs.push({
    id: `log-${Date.now()}`,
    menuId,
    field: 'availableHours',
    oldValue,
    newValue: availableHours,
    by,
    byName,
    at: new Date(),
    reason: availableHours ? '시간제 판매 설정' : '시간제 판매 해제',
  });

  // 변경사항을 localStorage에 저장
  saveMenusToStorage();

  return menu;
}

/**
 * 메뉴 시간제 설정
 */
export async function updateMenuAvailableHours(
  menuId: string,
  availableHours: { start: string; end: string } | null,
  by: string,
  byName: string
): Promise<Menu> {
  if (!USE_FIREBASE) {
    return await updateMenuAvailableHoursMock(menuId, availableHours, by, byName);
  }

  // Firebase 모드: Firestore stores/{storeId}/menus/{menuId} 업데이트
  try {
    const storeId = getStoreId();
    const ref = storeMenuDocRef(storeId, menuId);
    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) {
      throw new Error('메뉴를 찾을 수 없습니다.');
    }

    await updateDoc(ref, {
      availableHours: availableHours || null,
      updatedAt: serverTimestamp(),
    });

    // 업데이트된 문서 읽기
    const afterSnap = await getDoc(ref);
    const afterData = afterSnap.data() as MenuDoc;
    afterData.menuId = afterData.menuId || afterSnap.id;

    return await buildMenuFromDoc(afterData);
  } catch (error) {
    console.error('Failed to update menu available hours in Firestore:', error);
    throw error;
  }
}

/**
 * Mock 모드: 메뉴 수정
 */
async function updateMenuMock(
  menuId: string,
  updates: Partial<Pick<Menu, 'name' | 'category' | 'price' | 'description' | 'image'>>,
  by: string,
  byName: string,
  reason?: string
): Promise<Menu> {
  await new Promise(resolve => setTimeout(resolve, 500));

  const menu = mockMenus.find(m => m.menuId === menuId);
  if (!menu) {
    throw new Error('메뉴를 찾을 수 없습니다');
  }

  // 변경 사항 적용 및 로그 기록
  Object.entries(updates).forEach(([field, newValue]) => {
    const oldValue = menu[field as keyof Menu];
    if (oldValue !== newValue) {
      (menu as any)[field] = newValue;

      mockMenuLogs.push({
        id: `log-${Date.now()}-${field}`,
        menuId,
        field,
        oldValue,
        newValue,
        by,
        byName,
        at: new Date(),
        reason,
      });
    }
  });

  // 변경사항을 localStorage에 저장
  saveMenusToStorage();

  return menu;
}

/**
 * 메뉴 수정 (메뉴명/카테고리/가격/설명/이미지)
 */
export async function updateMenu(
  menuId: string,
  updates: Partial<Pick<Menu, 'name' | 'category' | 'price' | 'description' | 'image'>>,
  by: string,
  byName: string,
  reason?: string
): Promise<Menu> {
  if (!USE_FIREBASE) {
    return await updateMenuMock(menuId, updates, by, byName, reason);
  }

  // Firebase 모드: Firestore stores/{storeId}/menus/{menuId} 업데이트
  try {
    const storeId = getStoreId();
    const ref = storeMenuDocRef(storeId, menuId);
    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) {
      throw new Error('메뉴를 찾을 수 없습니다.');
    }

    const prev = snapshot.data() as MenuDoc;

    // 업데이트할 필드만 골라서 업데이트
    const updateData: any = {
      updatedAt: serverTimestamp(),
    };

    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.category !== undefined) updateData.category = updates.category;
    if (updates.price !== undefined) updateData.price = updates.price;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.image !== undefined) updateData.imageUrl = updates.image; // Menu.image → MenuDoc.imageUrl

    await updateDoc(ref, updateData);

    // 업데이트된 문서 읽기
    const afterSnap = await getDoc(ref);
    const afterData = afterSnap.data() as MenuDoc;
    afterData.menuId = afterData.menuId || afterSnap.id;

    return await buildMenuFromDoc(afterData);
  } catch (error) {
    console.error('Failed to update menu in Firestore:', error);
    throw error;
  }
}

/**
 * 메뉴 로그 조회
 */
export async function getMenuLogs(menuId: string): Promise<MenuLog[]> {
  if (USE_FIREBASE) {
    // TODO: Firestore 연동
    throw new Error('Firebase not configured');
  }

  await new Promise(resolve => setTimeout(resolve, 200));
  return mockMenuLogs
    .filter(log => log.menuId === menuId)
    .sort((a, b) => b.at.getTime() - a.at.getTime());
}

/**
 * 메뉴 통계
 */
export interface MenuStats {
  total: number;
  available: number;
  soldout: number;
  timeLimited: number;
  byCategory: Record<string, number>;
}

export async function getMenuStats(): Promise<MenuStats> {
  if (USE_FIREBASE) {
    // Firestore에서 실제 메뉴 데이터를 가져와서 통계 계산
    try {
      const menus = await getMenus({});
      const stats: MenuStats = {
        total: menus.length,
        available: 0,
        soldout: 0,
        timeLimited: 0,
        byCategory: {},
      };

      menus.forEach(menu => {
        const status = getMenuStatus(menu);
        if (status === 'available') stats.available++;
        else if (status === 'soldout') stats.soldout++;
        else if (status === 'time-limited') stats.timeLimited++;

        stats.byCategory[menu.category] = (stats.byCategory[menu.category] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('[getMenuStats] Failed to fetch menus for stats:', error);
      // 에러 발생 시 빈 통계 반환
      return {
        total: 0,
        available: 0,
        soldout: 0,
        timeLimited: 0,
        byCategory: {},
      };
    }
  }

  await new Promise(resolve => setTimeout(resolve, 200));

  const stats: MenuStats = {
    total: mockMenus.length,
    available: 0,
    soldout: 0,
    timeLimited: 0,
    byCategory: {},
  };

  mockMenus.forEach(menu => {
    const status = getMenuStatus(menu);
    if (status === 'available') stats.available++;
    else if (status === 'soldout') stats.soldout++;
    else if (status === 'time-limited') stats.timeLimited++;

    stats.byCategory[menu.category] = (stats.byCategory[menu.category] || 0) + 1;
  });

  return stats;
}

/**
 * Mock 모드: 메뉴 생성
 */
async function createMenuMock(
  menuData: Partial<Menu>,
  by: string,
  byName: string
): Promise<Menu> {
  await new Promise(resolve => setTimeout(resolve, 500));

  // 중복 확인 (같은 이름 + 카테고리)
  const duplicate = mockMenus.find(
    m => m.name === menuData.name && m.category === menuData.category
  );

  if (duplicate) {
    throw new Error('동일한 이름과 카테고리의 메뉴가 이미 존재합니다');
  }

  // ID 생성
  const maxId = mockMenus.reduce((max, m) => {
    const num = parseInt(m.menuId.replace('menu-', ''));
    return Math.max(max, isNaN(num) ? 0 : num);
  }, 0);
  const menuId = `menu-${String(maxId + 1).padStart(3, '0')}`;

  // 새 메뉴 생성
  const newMenu: Menu = {
    menuId,
    category: menuData.category || 'noodle',
    name: menuData.name || '',
    price: menuData.price || 0,
    description: menuData.description || '',
    image: menuData.image || '',
    badges: menuData.badges || [],
    options: menuData.options,
    allergens: menuData.allergens || [],
    origin: menuData.origin || '-',
    isAvailable: menuData.isAvailable !== false,
    order: menuData.order || mockMenus.length + 1,
  };

  // 목록 최상단에 추가
  mockMenus.unshift(newMenu);

  // 로그 기록
  mockMenuLogs.push({
    id: `log-${Date.now()}`,
    menuId,
    field: 'created',
    oldValue: null,
    newValue: newMenu,
    by,
    byName,
    at: new Date(),
    reason: '신규 메뉴 등록',
  });

  // 변경사항을 localStorage에 저장
  saveMenusToStorage();

  return newMenu;
}

/**
 * 메뉴 생성
 */
export async function createMenu(
  menuData: Partial<Menu>,
  by: string,
  byName: string
): Promise<Menu> {
  if (!USE_FIREBASE) {
    return await createMenuMock(menuData, by, byName);
  }

  // Firebase 모드: Firestore stores/{storeId}/menus에 문서 생성
  try {
    const storeId = getStoreId();
    if (!storeId || storeId.trim() === '') {
      throw new Error('STORE_ID가 설정되지 않았습니다. 환경 변수를 확인하세요.');
    }
    console.log('[createMenu] storeId:', storeId);
    console.log('[createMenu] menuData:', menuData);
    const colRef = storeMenusCollection(storeId);

    // 중복 확인 (같은 이름 + 카테고리)
    const existingMenus = await getMenus({ category: menuData.category as any });
    const duplicate = existingMenus.find(
      m => m.name === menuData.name && m.category === menuData.category
    );

    if (duplicate) {
      throw new Error('동일한 이름과 카테고리의 메뉴가 이미 존재합니다');
    }

    // Menu 엔티티 생성 (임시 menuId)
    const tempMenuId = `menu-${Date.now()}`;
    const menu: Menu = {
      menuId: tempMenuId,
      category: menuData.category || 'noodle',
      name: menuData.name || '',
      price: menuData.price || 0,
      description: menuData.description || '',
      image: menuData.image || '',
      badges: menuData.badges || [],
      options: menuData.options,
      allergens: menuData.allergens || [],
      origin: menuData.origin || '-',
      isAvailable: menuData.isAvailable !== false,
      order: menuData.order || existingMenus.length + 1,
    };

    // MenuDoc 생성
    const menuDocData = buildMenuDocFromEntity({
      storeId,
      menuId: '', // addDoc 시점에는 id 없음
      menu,
    });
    console.log('[createMenu] menuDocData:', menuDocData);
    console.log('[createMenu] collection path:', colRef.path);

    const docRef = await addDoc(colRef, {
      ...menuDocData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log('[createMenu] Document created with ID:', docRef.id);

    // 생성된 문서 읽기
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) {
      throw new Error('메뉴 생성 후 데이터를 읽을 수 없습니다.');
    }

    const data = snapshot.data() as MenuDoc;
    data.menuId = snapshot.id;

    return await buildMenuFromDoc(data);
  } catch (error) {
    // Firestore 권한 에러를 명확히 표시
    if (error && typeof error === 'object' && 'code' in error) {
      const firebaseError = error as FirebaseError;
      const errorCode = firebaseError.code;
      
      // 권한 관련 에러 코드 체크
      if (
        errorCode === 'permission-denied' ||
        errorCode === 'unauthenticated' ||
        errorCode === 'failed-precondition'
      ) {
        console.error('[createMenu] Firestore permission error:', {
          code: errorCode,
          message: firebaseError.message,
          storeId: getStoreId(),
          collectionPath: `stores/${getStoreId()}/menus`,
        });
        
        // 사용자 친화적인 에러 메시지
        const errorMessage = 
          errorCode === 'permission-denied'
            ? '메뉴 등록에 실패했습니다. Firestore Security Rules에서 stores/{storeId}/menus 쓰기 권한을 허용해야 합니다. 자세한 내용은 관리자에게 문의하세요.'
            : errorCode === 'unauthenticated'
            ? '메뉴 등록에 실패했습니다. 로그인이 필요합니다. 다시 로그인해주세요.'
            : '메뉴 등록에 실패했습니다. Firestore 설정을 확인해주세요.';
        
        throw new Error(errorMessage);
      }
    }
    
    // 기타 에러는 그대로 전달
    console.error('[createMenu] Failed to create menu in Firestore:', error);
    throw error;
  }
}

/**
 * Mock 모드: 메뉴 삭제
 */
async function deleteMenuMock(
  menuId: string,
  by: string,
  byName: string
): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 300));

  const menu = mockMenus.find(m => m.menuId === menuId);
  if (!menu) {
    throw new Error('메뉴를 찾을 수 없습니다');
  }

  mockMenus = mockMenus.filter(m => m.menuId !== menuId);

  // 로그 기록
  mockMenuLogs.push({
    id: `log-${Date.now()}`,
    menuId,
    field: 'deleted',
    oldValue: menu,
    newValue: null,
    by,
    byName,
    at: new Date(),
    reason: '메뉴 삭제',
  });

  // 변경사항을 localStorage에 저장
  saveMenusToStorage();
}

/**
 * 메뉴 삭제 (Undo용)
 */
export async function deleteMenu(
  menuId: string,
  by: string,
  byName: string
): Promise<void> {
  if (!USE_FIREBASE) {
    return await deleteMenuMock(menuId, by, byName);
  }

  // Firebase 모드: Firestore stores/{storeId}/menus/{menuId} 삭제
  try {
    const storeId = getStoreId();
    const ref = storeMenuDocRef(storeId, menuId);
    await deleteDoc(ref);
  } catch (error) {
    console.error('Failed to delete menu from Firestore:', error);
    throw error;
  }
}
