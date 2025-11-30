/**
 * 사용자 검색 다이얼로그
 * 쿠폰 발급 시 특정 사용자를 선택하기 위한 컴포넌트
 */

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Search, Loader2 } from "lucide-react";
import { collection, query, where, getDocs, limit, orderBy } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { toast } from "sonner";
import { USE_FIREBASE } from "../../config/env";

interface User {
  uid: string;
  email?: string;
  displayName?: string;
  phoneNumber?: string;
}

interface UserSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (user: User) => void;
}

export function UserSearchDialog({ open, onOpenChange, onSelect }: UserSearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // 검색 실행
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("검색어를 입력하세요");
      return;
    }

    setLoading(true);
    try {
      if (!USE_FIREBASE) {
        // Mock 모드: 샘플 데이터 반환
        setUsers([
          {
            uid: "user-001",
            email: "user1@example.com",
            displayName: "홍길동",
            phoneNumber: "010-1234-5678",
          },
          {
            uid: "user-002",
            email: "user2@example.com",
            displayName: "김철수",
            phoneNumber: "010-2345-6789",
          },
        ]);
        setLoading(false);
        return;
      }

      // Firebase 모드: users 컬렉션에서 검색
      const usersRef = collection(db, "users");
      const searchLower = searchQuery.toLowerCase().trim();

      // 이름, 이메일, 전화번호로 검색 (OR 조건)
      // Firestore는 OR 쿼리를 직접 지원하지 않으므로 여러 쿼리 실행 후 합치기
      const queries = [
        query(
          usersRef,
          where("displayName", ">=", searchQuery),
          where("displayName", "<=", searchQuery + "\uf8ff"),
          limit(10),
        ),
        query(
          usersRef,
          where("email", ">=", searchQuery),
          where("email", "<=", searchQuery + "\uf8ff"),
          limit(10),
        ),
        query(
          usersRef,
          where("phoneNumber", ">=", searchQuery),
          where("phoneNumber", "<=", searchQuery + "\uf8ff"),
          limit(10),
        ),
      ];

      const results = await Promise.all(queries.map(q => getDocs(q)));
      const userMap = new Map<string, User>();

      results.forEach(snapshot => {
        snapshot.docs.forEach(doc => {
          const data = doc.data();
          userMap.set(doc.id, {
            uid: doc.id,
            email: data.email,
            displayName: data.displayName || data.name,
            phoneNumber: data.phoneNumber || data.phone,
          });
        });
      });

      const userList = Array.from(userMap.values());
      setUsers(userList);

      if (userList.length === 0) {
        toast.info("검색 결과가 없습니다");
      }
    } catch (error) {
      console.error("Failed to search users:", error);
      toast.error("사용자 검색에 실패했습니다");
    } finally {
      setLoading(false);
    }
  };

  // 다이얼로그 닫을 때 초기화
  useEffect(() => {
    if (!open) {
      setSearchQuery("");
      setUsers([]);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>사용자 검색</DialogTitle>
          <DialogDescription>이름, 이메일, 전화번호로 검색하세요</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* 검색 입력 */}
          <div className="space-y-2">
            <Label>검색어</Label>
            <div className="flex gap-2">
              <Input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="이름, 이메일, 전화번호"
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
              />
              <Button onClick={handleSearch} disabled={loading}>
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* 검색 결과 */}
          {users.length > 0 && (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              <Label>검색 결과 ({users.length}명)</Label>
              <div className="space-y-2">
                {users.map(user => (
                  <div
                    key={user.uid}
                    className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      onSelect(user);
                      onOpenChange(false);
                    }}
                  >
                    <div className="font-medium text-sm">{user.displayName || "이름 없음"}</div>
                    {user.email && <div className="text-xs text-gray-500">{user.email}</div>}
                    {user.phoneNumber && (
                      <div className="text-xs text-gray-500">{user.phoneNumber}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            닫기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
