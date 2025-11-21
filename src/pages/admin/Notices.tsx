// Route: /admin/notices
/**
 * 관리자 공지사항 관리 페이지
 */

import { useState, useEffect } from 'react';
import { Notice, NoticeFilters } from '../../types/notice';
import {
  getNotices,
  createNotice,
  updateNotice,
  deleteNotice,
} from '../../lib/admin/notices.api';
import { getCurrentUser } from '../../lib/auth';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Switch } from '../../components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog';
import { Badge } from '../../components/ui/badge';
import { Plus, Search, Edit2, Trash2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { formatDate } from '../../lib/utils/date';

export function AdminNotices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [filters, setFilters] = useState<NoticeFilters>({
    type: 'all',
    isActive: undefined,
    search: '',
  });

  // 다이얼로그 상태
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deletingNoticeId, setDeletingNoticeId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // 폼 상태
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'notice' as 'notice' | 'event' | 'promotion',
    isActive: true,
    priority: 1,
  });

  const user = getCurrentUser();

  // 데이터 로드
  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getNotices(filters);
      setNotices(data);
    } catch (error) {
      console.error('Failed to load notices:', error);
      toast.error('공지사항 목록을 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters]);

  // 폼 초기화
  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      type: 'notice',
      isActive: true,
      priority: 1,
    });
  };

  // 생성 다이얼로그 열기
  const handleCreateOpen = () => {
    resetForm();
    setCreateDialogOpen(true);
  };

  // 편집 다이얼로그 열기
  const handleEditOpen = (notice: Notice) => {
    setFormData({
      title: notice.title,
      content: notice.content,
      type: notice.type,
      isActive: notice.isActive,
      priority: notice.priority,
    });
    setEditingNotice(notice);
    setEditDialogOpen(true);
  };

  // 생성
  const handleCreate = async () => {
    if (!user || !formData.title.trim() || !formData.content.trim()) {
      toast.error('제목과 내용을 입력하세요');
      return;
    }

    setActionLoading(true);
    try {
      await createNotice(
        {
          ...formData,
          createdBy: user.uid,
          createdByName: user.displayName || '관리자',
        },
        user.uid,
        user.displayName || '관리자'
      );

      toast.success('공지사항이 등록되었습니다');
      setCreateDialogOpen(false);
      resetForm();
      loadData();
    } catch (error: any) {
      console.error('Failed to create notice:', error);
      toast.error(error.message || '공지사항 등록에 실패했습니다');
    } finally {
      setActionLoading(false);
    }
  };

  // 수정
  const handleUpdate = async () => {
    if (!user || !editingNotice || !formData.title.trim() || !formData.content.trim()) {
      toast.error('제목과 내용을 입력하세요');
      return;
    }

    setActionLoading(true);
    try {
      await updateNotice(
        editingNotice.id,
        {
          title: formData.title,
          content: formData.content,
          type: formData.type,
          isActive: formData.isActive,
          priority: formData.priority,
        },
        user.uid,
        user.displayName || '관리자'
      );

      toast.success('공지사항이 수정되었습니다');
      setEditDialogOpen(false);
      setEditingNotice(null);
      resetForm();
      loadData();
    } catch (error: any) {
      console.error('Failed to update notice:', error);
      toast.error(error.message || '공지사항 수정에 실패했습니다');
    } finally {
      setActionLoading(false);
    }
  };

  // 삭제
  const handleDelete = (noticeId: string) => {
    setDeletingNoticeId(noticeId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!user || !deletingNoticeId) return;

    setActionLoading(true);
    try {
      await deleteNotice(deletingNoticeId, user.uid, user.displayName || '관리자');
      toast.success('공지사항이 삭제되었습니다');
      setDeleteDialogOpen(false);
      setDeletingNoticeId(null);
      loadData();
    } catch (error: any) {
      console.error('Failed to delete notice:', error);
      toast.error(error.message || '공지사항 삭제에 실패했습니다');
    } finally {
      setActionLoading(false);
    }
  };

  const typeLabels = {
    notice: '공지',
    event: '이벤트',
    promotion: '프로모션',
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-[#333] mb-2">게시판 관리</h1>
          <p className="text-[#8B7355]">
            공지사항을 등록하고 관리하세요
          </p>
        </div>
        <Button onClick={handleCreateOpen}>
          <Plus className="w-4 h-4 mr-2" />
          공지사항 등록
        </Button>
      </div>

      {/* 필터 */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="제목, 내용 검색..."
            value={filters.search || ''}
            onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="pl-10"
          />
        </div>
        <Select
          value={filters.type || 'all'}
          onValueChange={(value) =>
            setFilters(prev => ({ ...prev, type: value as any }))
          }
        >
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            <SelectItem value="notice">공지</SelectItem>
            <SelectItem value="event">이벤트</SelectItem>
            <SelectItem value="promotion">프로모션</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="icon"
          onClick={loadData}
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* 목록 */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : notices.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <p className="text-gray-500">공지사항이 없습니다</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notices.map(notice => (
            <div
              key={notice.id}
              className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      variant="outline"
                      className={
                        notice.type === 'notice'
                          ? 'border-[#F37021] text-[#F37021]'
                          : notice.type === 'event'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-purple-500 text-purple-600'
                      }
                    >
                      {typeLabels[notice.type]}
                    </Badge>
                    {!notice.isActive && (
                      <Badge variant="outline" className="border-gray-400 text-gray-600">
                        비활성
                      </Badge>
                    )}
                    <span className="text-xs text-gray-500">
                      {formatDate(notice.createdAt)}
                    </span>
                    {notice.priority > 0 && (
                      <Badge variant="outline" className="text-xs">
                        우선순위: {notice.priority}
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-base font-semibold text-[#333] mb-1">
                    {notice.title}
                  </h3>
                  <p className="text-sm text-[#8B7355] line-clamp-2">
                    {notice.content}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditOpen(notice)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(notice.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 생성 다이얼로그 */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle>공지사항 등록</DialogTitle>
            <DialogDescription>
              새로운 공지사항을 등록합니다
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">제목 *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="공지사항 제목"
                maxLength={100}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">내용 *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="공지사항 내용"
                rows={6}
                maxLength={500}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">유형</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: any) =>
                    setFormData(prev => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="notice">공지</SelectItem>
                    <SelectItem value="event">이벤트</SelectItem>
                    <SelectItem value="promotion">프로모션</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">우선순위</Label>
                <Input
                  id="priority"
                  type="number"
                  value={formData.priority}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) || 0 }))
                  }
                  min="0"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.isActive}
                onCheckedChange={checked =>
                  setFormData(prev => ({ ...prev, isActive: checked }))
                }
              />
              <Label>활성화</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleCreate} disabled={actionLoading}>
              {actionLoading ? '등록 중...' : '등록'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 편집 다이얼로그 */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle>공지사항 수정</DialogTitle>
            <DialogDescription>
              공지사항을 수정합니다
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">제목 *</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="공지사항 제목"
                maxLength={100}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-content">내용 *</Label>
              <Textarea
                id="edit-content"
                value={formData.content}
                onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="공지사항 내용"
                rows={6}
                maxLength={500}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-type">유형</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: any) =>
                    setFormData(prev => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="notice">공지</SelectItem>
                    <SelectItem value="event">이벤트</SelectItem>
                    <SelectItem value="promotion">프로모션</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-priority">우선순위</Label>
                <Input
                  id="edit-priority"
                  type="number"
                  value={formData.priority}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) || 0 }))
                  }
                  min="0"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.isActive}
                onCheckedChange={checked =>
                  setFormData(prev => ({ ...prev, isActive: checked }))
                }
              />
              <Label>활성화</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleUpdate} disabled={actionLoading}>
              {actionLoading ? '수정 중...' : '수정'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>공지사항 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 이 공지사항을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={actionLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {actionLoading ? '삭제 중...' : '삭제'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

