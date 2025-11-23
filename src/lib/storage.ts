/**
 * Firebase Storage 이미지 업로드 유틸리티
 */

import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { STORE_ID } from '../config/env';

/**
 * 이미지 파일을 Firebase Storage에 업로드
 * @param file 업로드할 이미지 파일
 * @param path Storage 경로 (예: 'menus/menu-123/image.jpg')
 * @returns 업로드된 이미지의 다운로드 URL
 */
export async function uploadImageToStorage(
  file: File,
  path: string
): Promise<string> {
  try {
    console.log('[uploadImageToStorage] Starting upload, path:', path);
    const storageRef = ref(storage, path);
    console.log('[uploadImageToStorage] Uploading bytes...');
    await uploadBytes(storageRef, file);
    console.log('[uploadImageToStorage] Getting download URL...');
    const downloadURL = await getDownloadURL(storageRef);
    console.log('[uploadImageToStorage] Upload successful, URL:', downloadURL);
    return downloadURL;
  } catch (error: any) {
    console.error('[uploadImageToStorage] Upload failed:', error);
    console.error('[uploadImageToStorage] Error code:', error?.code);
    console.error('[uploadImageToStorage] Error message:', error?.message);
    throw new Error(error?.message || '이미지 업로드에 실패했습니다.');
  }
}

/**
 * 메뉴 이미지를 Firebase Storage에 업로드
 * @param file 업로드할 이미지 파일
 * @param menuId 메뉴 ID (없으면 임시 ID 생성)
 * @returns 업로드된 이미지의 다운로드 URL과 Storage 경로
 */
export async function uploadMenuImage(
  file: File,
  menuId?: string
): Promise<{ url: string; path: string }> {
  console.log('[uploadMenuImage] Starting upload, menuId:', menuId);
  const storeId = STORE_ID;
  if (!storeId) {
    console.error('[uploadMenuImage] STORE_ID is not set');
    throw new Error('STORE_ID가 설정되지 않았습니다.');
  }
  console.log('[uploadMenuImage] storeId:', storeId);

  // 파일 확장자 추출
  const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  console.log('[uploadMenuImage] fileExtension:', fileExtension);
  
  // 메뉴 ID가 없으면 임시 ID 생성
  const targetMenuId = menuId || `temp-${Date.now()}`;
  console.log('[uploadMenuImage] targetMenuId:', targetMenuId);
  
  // Storage 경로: stores/{storeId}/menus/{menuId}/image.{ext}
  const storagePath = `stores/${storeId}/menus/${targetMenuId}/image.${fileExtension}`;
  console.log('[uploadMenuImage] storagePath:', storagePath);

  try {
    const url = await uploadImageToStorage(file, storagePath);
    console.log('[uploadMenuImage] Upload successful, returning URL and path');
    return {
      url,
      path: storagePath,
    };
  } catch (error: any) {
    console.error('[uploadMenuImage] Failed:', error);
    console.error('[uploadMenuImage] Error code:', error?.code);
    console.error('[uploadMenuImage] Error message:', error?.message);
    throw error;
  }
}

/**
 * Storage에서 이미지를 한 경로에서 다른 경로로 이동 (복사 후 삭제)
 * @param oldPath 기존 Storage 경로
 * @param newPath 새로운 Storage 경로
 * @param file 이동할 파일 (복사용)
 */
export async function moveImageInStorage(
  oldPath: string,
  newPath: string,
  file: File
): Promise<{ url: string; path: string }> {
  try {
    // 새 경로에 업로드
    const url = await uploadImageToStorage(file, newPath);
    
    // 기존 파일 삭제 (에러 무시)
    try {
      await deleteImageFromStorage(oldPath);
    } catch (error) {
      console.warn('[moveImageInStorage] Failed to delete old image:', error);
    }
    
    return {
      url,
      path: newPath,
    };
  } catch (error) {
    console.error('[moveImageInStorage] Failed:', error);
    throw error;
  }
}

/**
 * Storage에서 이미지 삭제
 * @param path Storage 경로
 */
export async function deleteImageFromStorage(path: string): Promise<void> {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error: any) {
    // 파일이 없어도 에러를 던지지 않음
    if (error.code !== 'storage/object-not-found') {
      console.error('[deleteImageFromStorage] Delete failed:', error);
      throw new Error('이미지 삭제에 실패했습니다.');
    }
  }
}

/**
 * 이미지 파일 검증
 * @param file 검증할 파일
 * @returns 검증 결과
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // 파일 타입 검증
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: '이미지 파일만 업로드 가능합니다.' };
  }

  // 파일 크기 검증 (3MB 제한)
  const maxSize = 3 * 1024 * 1024; // 3MB
  if (file.size > maxSize) {
    return { valid: false, error: '이미지 크기는 3MB 이하여야 합니다.' };
  }

  return { valid: true };
}

