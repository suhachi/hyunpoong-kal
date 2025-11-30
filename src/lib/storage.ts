/**
 * Firebase Storage 이미지 업로드 유틸리티
 */

import { storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { STORE_ID } from "../config/env";

interface FirebaseStorageInternal {
  _location?: { bucket: string };
  _bucket?: { name: string };
}

interface StorageError {
  code?: string;
  message?: string;
}

/**
 * 이미지 파일을 Firebase Storage에 업로드
 * @param file 업로드할 이미지 파일
 * @param path Storage 경로 (예: 'menus/menu-123/image.jpg')
 * @returns 업로드된 이미지의 다운로드 URL
 */
export async function uploadImageToStorage(file: File, path: string): Promise<string> {
  try {
    console.log("[uploadImageToStorage] Starting upload, path:", path);

    // 🛡️ 재발 방지: 버킷 검증 (FATAL 차단)
    const storageInternal = storage as unknown as FirebaseStorageInternal;
    const activeBucket =
      storageInternal._location?.bucket || storageInternal._bucket?.name || "UNKNOWN";

    if (activeBucket.includes("appspot.com")) {
      console.error(
        "[FATAL] WRONG STORAGE BUCKET DETECTED → appspot.com fallback 발생",
        activeBucket,
      );
      throw new Error(
        "INVALID_STORAGE_BUCKET: appspot.com 버킷 사용 감지. 환경 변수 VITE_FIREBASE_STORAGE_BUCKET를 확인하세요.",
      );
    }

    console.log("[uploadImageToStorage] Using storage bucket:", activeBucket);
    console.log("[uploadImageToStorage] Full path:", path);

    const storageRef = ref(storage, path);
    console.log("[uploadImageToStorage] Uploading bytes...");
    await uploadBytes(storageRef, file);
    console.log("[uploadImageToStorage] Getting download URL...");
    const downloadURL = await getDownloadURL(storageRef);
    console.log("[uploadImageToStorage] Upload successful, URL:", downloadURL);

    // 🛡️ 재발 방지: 다운로드 URL에서 버킷 검증 (FATAL 차단)
    if (downloadURL.includes("firebasestorage.googleapis.com")) {
      const urlMatch = downloadURL.match(/\/b\/([^/]+)\//);
      if (urlMatch) {
        const urlBucket = urlMatch[1];
        console.log("[uploadImageToStorage] URL bucket:", urlBucket);

        // appspot.com이 URL에 포함되어 있으면 즉시 차단
        if (urlBucket.includes("appspot.com")) {
          console.error("[FATAL] WRONG STORAGE BUCKET IN URL → appspot.com 감지", urlBucket);
          throw new Error(
            "INVALID_STORAGE_BUCKET: 다운로드 URL에 appspot.com 버킷이 포함되어 있습니다.",
          );
        }

        if (urlBucket !== activeBucket && !urlBucket.includes("firebasestorage.app")) {
          console.warn("[uploadImageToStorage] ⚠️ URL 버킷이 예상과 다릅니다!");
          console.warn("[uploadImageToStorage] Expected:", activeBucket);
          console.warn("[uploadImageToStorage] Got:", urlBucket);
        }
      }
    }

    return downloadURL;
  } catch (error) {
    const storageError = error as StorageError;
    console.error("[uploadImageToStorage] Upload failed:", error);
    console.error("[uploadImageToStorage] Error code:", storageError?.code);
    console.error("[uploadImageToStorage] Error message:", storageError?.message);
    throw new Error(storageError?.message || "이미지 업로드에 실패했습니다.");
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
  menuId?: string,
): Promise<{ url: string; path: string }> {
  console.log("[uploadMenuImage] Starting upload, menuId:", menuId);

  // 🛡️ 재발 방지: 버킷 검증 (FATAL 차단)
  const storageInternal = storage as unknown as FirebaseStorageInternal;
  const activeBucket =
    storageInternal._location?.bucket || storageInternal._bucket?.name || "UNKNOWN";

  if (activeBucket.includes("appspot.com")) {
    console.error(
      "[FATAL] WRONG STORAGE BUCKET DETECTED → appspot.com fallback 발생",
      activeBucket,
    );
    throw new Error(
      "INVALID_STORAGE_BUCKET: appspot.com 버킷 사용 감지. 환경 변수 VITE_FIREBASE_STORAGE_BUCKET를 확인하세요.",
    );
  }

  console.log("[uploadMenuImage] Using storage bucket:", activeBucket);

  const storeId = STORE_ID;
  if (!storeId) {
    console.error("[uploadMenuImage] STORE_ID is not set");
    throw new Error("STORE_ID가 설정되지 않았습니다.");
  }
  console.log("[uploadMenuImage] storeId:", storeId);

  // 파일 확장자 추출
  const fileExtension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  console.log("[uploadMenuImage] fileExtension:", fileExtension);

  // 메뉴 ID가 없으면 임시 ID 생성
  const targetMenuId = menuId || `temp-${Date.now()}`;
  console.log("[uploadMenuImage] targetMenuId:", targetMenuId);

  // Storage 경로: stores/{storeId}/menus/{menuId}/image.{ext}
  const storagePath = `stores/${storeId}/menus/${targetMenuId}/image.${fileExtension}`;
  console.log("[uploadMenuImage] storagePath:", storagePath);

  try {
    const url = await uploadImageToStorage(file, storagePath);
    console.log("[uploadMenuImage] Upload successful, returning URL and path");
    return {
      url,
      path: storagePath,
    };
  } catch (error) {
    const storageError = error as StorageError;
    console.error("[uploadMenuImage] Failed:", error);
    console.error("[uploadMenuImage] Error code:", storageError?.code);
    console.error("[uploadMenuImage] Error message:", storageError?.message);
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
  file: File,
): Promise<{ url: string; path: string }> {
  try {
    // 새 경로에 업로드
    const url = await uploadImageToStorage(file, newPath);

    // 기존 파일 삭제 (에러 무시)
    try {
      await deleteImageFromStorage(oldPath);
    } catch (error) {
      console.warn("[moveImageInStorage] Failed to delete old image:", error);
    }

    return {
      url,
      path: newPath,
    };
  } catch (error) {
    console.error("[moveImageInStorage] Failed:", error);
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
  } catch (error) {
    const storageError = error as StorageError;
    // 파일이 없어도 에러를 던지지 않음
    if (storageError.code !== "storage/object-not-found") {
      console.error("[deleteImageFromStorage] Delete failed:", error);
      throw new Error("이미지 삭제에 실패했습니다.");
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
  if (!file.type.startsWith("image/")) {
    return { valid: false, error: "이미지 파일만 업로드 가능합니다." };
  }

  // 파일 크기 검증 (3MB 제한)
  const maxSize = 3 * 1024 * 1024; // 3MB
  if (file.size > maxSize) {
    return { valid: false, error: "이미지 크기는 3MB 이하여야 합니다." };
  }

  return { valid: true };
}
