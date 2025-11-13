// Route: /admin/support
/**
 * 관리자 고객지원 채팅 관리 페이지
 * Phase 3-2: Support Chat
 * Firebase Firestore 실시간 채팅 시스템
 */

import { useEffect, useState, useRef } from 'react';
import { 
  Send, 
  MessageSquare, 
  Clock, 
  Check, 
  CheckCheck, 
  AlertCircle, 
  RefreshCw,
  UserCheck,
  X,
  CheckCircle,
  Timer,
  TrendingUp
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Separator } from '../../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { FEATURE_FLAGS, USE_FIREBASE } from '../../config/env';
import { formatDateTime } from '../../lib/utils';
import { getCurrentUser } from '../../lib/auth';
import type { ChatSession, ChatMessage } from '../../types/support';
import { toast } from 'sonner';

// Firebase API (실제 환경에서 사용)
import {
  getAllSessions,
  getSessionMessages,
  sendAdminMessage,
  updateSessionStatus,
  markMessagesAsReadByAdmin,
  subscribeToSessions,
  subscribeToMessages,
  getPendingSessionsCount,
  getAverageResponseTime,
  getTodayCompletedCount,
} from '../../lib/admin/support.api';

export function AdminSupport() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState<'all' | 'open' | 'closed'>('all');
  
  // 통계
  const [stats, setStats] = useState({
    pending: 0,
    avgResponseTime: 0,
    todayCompleted: 0,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const currentUser = getCurrentUser();

  // 지원 기능 비활성화 체크
  if (!FEATURE_FLAGS.support) {
    return (
      <div className="p-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            고객 지원 기능이 비활성화되어 있습니다. 환경 변수에서 VITE_SUPPORT_ENABLED=true로 설정하세요.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // 초기 로드 + 통계
  useEffect(() => {
    loadSessionsAndStats();
  }, []);

  // Firebase 실시간 구독
  useEffect(() => {
    if (!USE_FIREBASE) return;

    const unsubscribe = subscribeToSessions((updatedSessions) => {
      setSessions(updatedSessions);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 선택된 세션의 메시지 구독
  useEffect(() => {
    if (!selectedSession || !USE_FIREBASE) return;

    const unsubscribe = subscribeToMessages(selectedSession.id, (updatedMessages) => {
      setMessages(updatedMessages);
      
      // 읽음 처리
      markMessagesAsReadByAdmin(selectedSession.id).catch(console.error);
    });

    return () => unsubscribe();
  }, [selectedSession]);

  // 메시지 자동 스크롤
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  // 세션 및 통계 로드
  async function loadSessionsAndStats() {
    try {
      setLoading(true);

      if (USE_FIREBASE) {
        // Firebase에서 로드
        const [allSessions, pending, avgTime, completed] = await Promise.all([
          getAllSessions(),
          getPendingSessionsCount(),
          getAverageResponseTime(),
          getTodayCompletedCount(),
        ]);

        setSessions(allSessions);
        setStats({
          pending,
          avgResponseTime: avgTime,
          todayCompleted: completed,
        });
      } else {
        // Mock: localStorage
        await loadSessionsMock();
        setStats({
          pending: 0,
          avgResponseTime: 5,
          todayCompleted: 0,
        });
      }
    } catch (error) {
      console.error('Failed to load sessions:', error);
      toast.error('세션 목록을 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  }

  // Mock 데이터 로드
  async function loadSessionsMock() {
    const sessionsData = localStorage.getItem('chat_sessions') || '{}';
    let sessionsObj: Record<string, ChatSession> = JSON.parse(sessionsData);
    
    // 첫 실행 시 샘플 데이터 생성
    if (Object.keys(sessionsObj).length === 0) {
      sessionsObj = createSampleSessions();
      localStorage.setItem('chat_sessions', JSON.stringify(sessionsObj));
    }
    
    const sessionsList = Object.values(sessionsObj);
    
    sessionsList.sort((a, b) => {
      const aHasUnread = hasUnreadMessagesMock(a.id);
      const bHasUnread = hasUnreadMessagesMock(b.id);
      
      if (aHasUnread && !bHasUnread) return -1;
      if (!aHasUnread && bHasUnread) return 1;
      
      return b.lastAt - a.lastAt;
    });

    setSessions(sessionsList);
  }
  
  // 샘플 세션 생성 (첫 실행 시)
  function createSampleSessions(): Record<string, ChatSession> {
    const now = Date.now();
    const sessions: Record<string, ChatSession> = {};
    
    // 세션 1: 미응답 (긴급)
    const session1: ChatSession = {
      id: 'session_001',
      userId: 'user_kim',
      userName: '김민수',
      userPhone: '010-1234-5678',
      open: true,
      lastMessage: '배달이 너무 늦어요. 확인 부탁드립니다.',
      lastAt: now - 5 * 60 * 1000, // 5분 전
      createdAt: now - 10 * 60 * 1000,
      updatedAt: now - 5 * 60 * 1000,
    };
    sessions[session1.id] = session1;
    
    // 메시지 생성
    const messages1: ChatMessage[] = [
      {
        id: 'msg_001',
        sessionId: session1.id,
        from: 'user',
        type: 'text',
        text: '안녕하세요, 주문한 음식이 언제 도착하나요?',
        at: now - 10 * 60 * 1000,
        readByAdmin: false,
      },
      {
        id: 'msg_002',
        sessionId: session1.id,
        from: 'user',
        type: 'text',
        text: '배달이 너무 늦어요. 확인 부탁드립니다.',
        at: now - 5 * 60 * 1000,
        readByAdmin: false,
      },
    ];
    localStorage.setItem(`chat_messages_${session1.id}`, JSON.stringify(messages1));
    
    // 세션 2: 진행 중
    const session2: ChatSession = {
      id: 'session_002',
      userId: 'user_park',
      userName: '박지영',
      userPhone: '010-9876-5432',
      open: true,
      lastMessage: '네, 확인했습니다. 감사합니다!',
      lastAt: now - 30 * 60 * 1000, // 30분 전
      createdAt: now - 60 * 60 * 1000,
      updatedAt: now - 30 * 60 * 1000,
      assignedTo: 'admin_001',
    };
    sessions[session2.id] = session2;
    
    const messages2: ChatMessage[] = [
      {
        id: 'msg_003',
        sessionId: session2.id,
        from: 'user',
        type: 'text',
        text: '메뉴 변경이 가능한가요?',
        at: now - 60 * 60 * 1000,
        readByAdmin: true,
      },
      {
        id: 'msg_004',
        sessionId: session2.id,
        from: 'admin',
        type: 'text',
        text: '네, 가능합니다. 어떤 메뉴로 변경하시겠어요?',
        at: now - 55 * 60 * 1000,
        readByUser: true,
      },
      {
        id: 'msg_005',
        sessionId: session2.id,
        from: 'user',
        type: 'text',
        text: '칼국수를 특칼국수로 변경하고 싶습니다.',
        at: now - 50 * 60 * 1000,
        readByAdmin: true,
      },
      {
        id: 'msg_006',
        sessionId: session2.id,
        from: 'admin',
        type: 'text',
        text: '변경 완료했습니다. 곧 준비해드리겠습니다.',
        at: now - 45 * 60 * 1000,
        readByUser: true,
      },
      {
        id: 'msg_007',
        sessionId: session2.id,
        from: 'user',
        type: 'text',
        text: '네, 확인했습니다. 감사합니다!',
        at: now - 30 * 60 * 1000,
        readByAdmin: true,
      },
    ];
    localStorage.setItem(`chat_messages_${session2.id}`, JSON.stringify(messages2));
    
    // 세션 3: 완료
    const session3: ChatSession = {
      id: 'session_003',
      userId: 'user_lee',
      userName: '이철수',
      open: false,
      lastMessage: '문제 해결되었습니다. 감사합니다!',
      lastAt: now - 2 * 60 * 60 * 1000, // 2시간 전
      createdAt: now - 3 * 60 * 60 * 1000,
      updatedAt: now - 2 * 60 * 60 * 1000,
      assignedTo: 'admin_001',
    };
    sessions[session3.id] = session3;
    
    const messages3: ChatMessage[] = [
      {
        id: 'msg_008',
        sessionId: session3.id,
        from: 'user',
        type: 'text',
        text: '결제가 안되는데 도와주세요.',
        at: now - 3 * 60 * 60 * 1000,
        readByAdmin: true,
      },
      {
        id: 'msg_009',
        sessionId: session3.id,
        from: 'admin',
        type: 'text',
        text: '확인해보겠습니다. 잠시만 기다려주세요.',
        at: now - 2.5 * 60 * 60 * 1000,
        readByUser: true,
      },
      {
        id: 'msg_010',
        sessionId: session3.id,
        from: 'admin',
        type: 'text',
        text: '카드 정보를 다시 입력해보시겠어요?',
        at: now - 2.3 * 60 * 60 * 1000,
        readByUser: true,
      },
      {
        id: 'msg_011',
        sessionId: session3.id,
        from: 'user',
        type: 'text',
        text: '문제 해결되었습니다. 감사합니다!',
        at: now - 2 * 60 * 60 * 1000,
        readByAdmin: true,
      },
    ];
    localStorage.setItem(`chat_messages_${session3.id}`, JSON.stringify(messages3));
    
    return sessions;
  }

  // Mock: 미응답 체크
  function hasUnreadMessagesMock(sessionId: string): boolean {
    const messagesData = localStorage.getItem(`chat_messages_${sessionId}`) || '[]';
    const msgs: ChatMessage[] = JSON.parse(messagesData);
    return msgs.some((m) => m.from === 'user' && !m.readByAdmin);
  }

  // 세션 선택
  async function selectSession(session: ChatSession) {
    setSelectedSession(session);

    if (USE_FIREBASE) {
      try {
        const msgs = await getSessionMessages(session.id);
        setMessages(msgs);
        
        // 읽음 처리
        await markMessagesAsReadByAdmin(session.id);
      } catch (error) {
        console.error('Failed to load messages:', error);
        toast.error('메시지를 불러오는데 실패했습니다');
      }
    } else {
      // Mock
      const messagesData = localStorage.getItem(`chat_messages_${session.id}`) || '[]';
      const msgs: ChatMessage[] = JSON.parse(messagesData);
      
      const updatedMsgs = msgs.map((m) => {
        if (m.from === 'user' && !m.readByAdmin) {
          return { ...m, readByAdmin: true };
        }
        return m;
      });
      
      localStorage.setItem(`chat_messages_${session.id}`, JSON.stringify(updatedMsgs));
      setMessages(updatedMsgs);
    }
  }

  // 메시지 전송
  async function sendMessage() {
    if (!selectedSession || !inputText.trim() || sending || !currentUser) return;

    const text = inputText.trim();
    setInputText('');
    setSending(true);

    try {
      if (USE_FIREBASE) {
        await sendAdminMessage(selectedSession.id, text, currentUser.uid);
        toast.success('메시지가 전송되었습니다');
      } else {
        // Mock
        const newMessage: ChatMessage = {
          id: `msg_${Date.now()}`,
          sessionId: selectedSession.id,
          from: 'admin',
          type: 'text',
          text,
          at: Date.now(),
          readByUser: false,
        };

        const messagesData = localStorage.getItem(`chat_messages_${selectedSession.id}`) || '[]';
        const allMessages: ChatMessage[] = JSON.parse(messagesData);
        allMessages.push(newMessage);
        localStorage.setItem(`chat_messages_${selectedSession.id}`, JSON.stringify(allMessages));
        
        setMessages(allMessages);

        // 세션 업데이트
        const sessionsData = localStorage.getItem('chat_sessions') || '{}';
        const sessionsObj: Record<string, ChatSession> = JSON.parse(sessionsData);
        sessionsObj[selectedSession.id] = {
          ...selectedSession,
          lastMessage: text,
          lastAt: Date.now(),
          updatedAt: Date.now(),
          assignedTo: currentUser.uid,
        };
        localStorage.setItem('chat_sessions', JSON.stringify(sessionsObj));
        
        loadSessionsMock();
        toast.success('메시지가 전송되었습니다');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('메시지 전송에 실패했습니다');
      setInputText(text);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  }

  // 세션 종료/재개
  async function toggleSessionStatus(session: ChatSession) {
    if (!currentUser) return;

    try {
      const newStatus = !session.open;
      
      if (USE_FIREBASE) {
        await updateSessionStatus(session.id, newStatus, currentUser.uid);
        toast.success(newStatus ? '세션을 재개했습니다' : '세션을 종료했습니다');
      } else {
        // Mock
        const sessionsData = localStorage.getItem('chat_sessions') || '{}';
        const sessionsObj: Record<string, ChatSession> = JSON.parse(sessionsData);
        sessionsObj[session.id] = {
          ...session,
          open: newStatus,
          updatedAt: Date.now(),
        };
        localStorage.setItem('chat_sessions', JSON.stringify(sessionsObj));
        loadSessionsMock();
        
        if (selectedSession?.id === session.id) {
          setSelectedSession({ ...session, open: newStatus });
        }
        
        toast.success(newStatus ? '세션을 재개했습니다' : '세션을 종료했습니다');
      }
    } catch (error) {
      console.error('Failed to update session status:', error);
      toast.error('세션 상태 변경에 실패했습니다');
    }
  }

  // 필터링된 세션
  const filteredSessions = (sessions || []).filter((s) => {
    if (filterTab === 'open') return s.open;
    if (filterTab === 'closed') return !s.open;
    return true;
  });

  // 통계
  const openSessions = (sessions || []).filter((s) => s.open);
  const unreadCount = USE_FIREBASE 
    ? stats.pending 
    : (sessions || []).filter((s) => hasUnreadMessagesMock(s.id)).length;

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-[#2E1C10]">고객 지원 채팅</h1>
          <p className="text-sm text-[#2E1C10]/60">
            실시간 1:1 고객 문의 관리
          </p>
        </div>
        <Button
          variant="outline"
          onClick={loadSessionsAndStats}
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          새로고침
        </Button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>전체 세션</CardDescription>
            <CardTitle className="text-3xl">{sessions.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              <MessageSquare className="w-3 h-3 inline mr-1" />
              누적 문의
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>진행 중</CardDescription>
            <CardTitle className="text-3xl text-blue-600">{openSessions.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              <Clock className="w-3 h-3 inline mr-1" />
              열린 세션
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>미응답</CardDescription>
            <CardTitle className="text-3xl text-red-600">{unreadCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              <AlertCircle className="w-3 h-3 inline mr-1" />
              답변 필요
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>평균 응답시간</CardDescription>
            <CardTitle className="text-3xl text-green-600">{stats.avgResponseTime}분</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              <Timer className="w-3 h-3 inline mr-1" />
              첫 응답까지
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 미응답 알림 */}
      {unreadCount > 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {unreadCount}개의 세션에 답변이 필요합니다. 빠른 응대로 고객 만족도를 높여보세요!
          </AlertDescription>
        </Alert>
      )}

      {/* 채팅 UI */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* 세션 목록 (좌측) */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle>문의 목록</CardTitle>
            <Tabs value={filterTab} onValueChange={(v) => setFilterTab(v as any)} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">전체</TabsTrigger>
                <TabsTrigger value="open">진행중</TabsTrigger>
                <TabsTrigger value="closed">완료</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              {filteredSessions.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  {filterTab === 'all' ? '문의가 없습니다' : 
                   filterTab === 'open' ? '진행 중인 문의가 없습니다' :
                   '완료된 문의가 없습니다'}
                </div>
              ) : (
                <div className="space-y-1 p-2">
                  {filteredSessions.map((session) => {
                    const unread = USE_FIREBASE ? false : hasUnreadMessagesMock(session.id);
                    const isSelected = selectedSession?.id === session.id;

                    return (
                      <button
                        key={session.id}
                        onClick={() => selectSession(session)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          isSelected
                            ? 'bg-[#D61C1C] text-white'
                            : unread
                            ? 'bg-red-50 hover:bg-red-100'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm ${isSelected ? 'text-white' : 'text-[#2E1C10]'}`}>
                              {session.userName || session.userId.substring(0, 12)}
                            </span>
                            {!session.open && (
                              <Badge variant="secondary" className="h-5 text-xs">
                                종료
                              </Badge>
                            )}
                          </div>
                          {unread && !isSelected && (
                            <Badge variant="destructive" className="h-5">
                              NEW
                            </Badge>
                          )}
                        </div>
                        <p className={`text-xs truncate ${isSelected ? 'text-white/80' : 'text-[#2E1C10]/60'}`}>
                          {session.lastMessage || '메시지 없음'}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <p className={`text-xs ${isSelected ? 'text-white/60' : 'text-[#2E1C10]/40'}`}>
                            {formatDateTime(new Date(session.lastAt))}
                          </p>
                          {session.assignedTo && (
                            <UserCheck className={`w-3 h-3 ${isSelected ? 'text-white/60' : 'text-green-600'}`} />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* 채팅 영역 (우측) */}
        <Card className="lg:col-span-2">
          {selectedSession ? (
            <>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>
                      {selectedSession.userName || selectedSession.userId}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <span>세션 ID: {selectedSession.id}</span>
                      {selectedSession.userPhone && (
                        <>
                          <span>•</span>
                          <span>{selectedSession.userPhone}</span>
                        </>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={selectedSession.open ? 'default' : 'secondary'}>
                      {selectedSession.open ? '진행 중' : '종료'}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleSessionStatus(selectedSession)}
                    >
                      {selectedSession.open ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-1" />
                          종료
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-4 h-4 mr-1" />
                          재개
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <Separator />

              <CardContent className="p-4 h-[400px] flex flex-col">
                {/* 메시지 목록 */}
                <ScrollArea className="flex-1 pr-4">
                  <div className="space-y-4">
                    {messages.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-20" />
                        <p className="text-sm">메시지가 없습니다</p>
                      </div>
                    ) : (
                      messages.map((msg) => (
                        <AdminMessageBubble key={msg.id} message={msg} />
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* 입력 영역 */}
                <div className="mt-4">
                  {!selectedSession.open && (
                    <Alert className="mb-3">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        이 세션은 종료되었습니다. 재개 버튼을 눌러 다시 열 수 있습니다.
                      </AlertDescription>
                    </Alert>
                  )}
                  <div className="flex gap-2">
                    <Input
                      ref={inputRef}
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      placeholder={selectedSession.open ? "답변을 입력하세요..." : "세션이 종료되었습니다"}
                      disabled={sending || !selectedSession.open}
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={!inputText.trim() || sending || !selectedSession.open}
                      size="icon"
                      className="bg-[#D61C1C] hover:bg-[#D61C1C]/90"
                    >
                      {sending ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="h-full flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-40" />
                <p>세션을 선택하세요</p>
                <p className="text-sm mt-2">
                  왼쪽 목록에서 문의를 클릭하면 대화를 시작할 수 있습니다
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>

      {/* 개발사 정보 (KS컴퍼니) */}
      <Card className="border-[#C7A45A]/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm text-[#2E1C10]/60">
            <div className="flex items-center gap-4">
              <span>개발사: KS컴퍼니</span>
              <Separator orientation="vertical" className="h-4" />
              <span>사업자번호: 553-17-00098</span>
              <Separator orientation="vertical" className="h-4" />
              <span>대표: 석경선 / 공동대표: 배종수</span>
            </div>
            <div className="flex items-center gap-1 text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span>오늘 {stats.todayCompleted}건 완료</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * 관리자용 메시지 말풍선
 */
function AdminMessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.from === 'user';
  const isBot = message.from === 'bot';

  return (
    <div className={`flex ${isUser ? 'justify-start' : 'justify-end'}`}>
      <div className="max-w-[75%]">
        {/* 보낸 사람 */}
        <p className={`text-xs text-[#2E1C10]/60 mb-1 px-1 ${isUser ? 'text-left' : 'text-right'}`}>
          {isUser ? '👤 고객' : isBot ? '🤖 자동 응답' : '👨‍💼 관리자'}
        </p>

        {/* 메시지 */}
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? 'bg-gray-100 text-[#2E1C10]'
              : isBot
              ? 'bg-blue-50 text-[#2E1C10] border border-blue-200'
              : 'bg-[#D61C1C] text-white'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.text}
          </p>
        </div>

        {/* 시간 + 읽음 */}
        <div className={`flex items-center gap-1 mt-1 px-1 ${isUser ? 'justify-start' : 'justify-end'}`}>
          <p className="text-xs text-[#2E1C10]/40">
            {new Date(message.at).toLocaleTimeString('ko-KR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
          {!isUser && !isBot && (
            <>
              {message.readByUser ? (
                <CheckCheck className="w-3 h-3 text-green-600" />
              ) : (
                <Check className="w-3 h-3 text-[#2E1C10]/40" />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
