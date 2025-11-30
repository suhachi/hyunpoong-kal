import { useEffect, useMemo, useRef } from "react";
import { collection, query, orderBy, doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { toast } from "sonner";
import { useOrderNotifications } from "../../hooks/useOrderNotifications";
import { useIsAdmin } from "../../hooks/useIsAdmin";
import { printOrderReceipt } from "../../utils/printReceipt";
import { Button } from "../ui/button";
import type { Order } from "../../types/order";

export function AdminOrderAlert() {
  const { isAdmin, loading } = useIsAdmin();
  const enabled = !loading && isAdmin;

  const loopRef = useRef<NodeJS.Timeout | null>(null);
  const toastIdRef = useRef<string | number | null>(null);
  const latestOrderIdRef = useRef<string | null>(null);

  // 오디오 언락 (브라우저 자동재생 정책 대응)
  useEffect(() => {
    const unlock = () => {
      // 빈 오디오 재생 시도
      const audio = new Audio("/alert3.mp3");
      audio.muted = true;
      audio
        .play()
        .then(() => {
          audio.pause();
          audio.currentTime = 0;
        })
        .catch(() => {
          // 파일이 없거나 재생 실패 시 무시
        });

      // Web Audio API Context resume (if needed)
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        const ctx = new AudioContext();
        if (ctx.state === "suspended") {
          ctx.resume();
        }
      }

      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };

    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  const q = useMemo(() => query(collection(db, "orders"), orderBy("createdAt", "desc")), []);

  const stopLoop = () => {
    if (loopRef.current) {
      clearInterval(loopRef.current);
      loopRef.current = null;
    }
    if (toastIdRef.current) {
      toast.dismiss(toastIdRef.current);
      toastIdRef.current = null;
    }
  };

  // 비프음 재생 (Web Audio API)
  const playBeep = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;

      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.frequency.value = 800;
      osc.type = "sine";

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      console.error("Beep play failed", e);
    }
  };

  useOrderNotifications(q, {
    role: "admin",
    enabled,
    notifyAdded: true,
    notifyModified: false,
    play: (type, { id }) => {
      if (type !== "new") return;

      latestOrderIdRef.current = id;

      const playSound = () => {
        const audio = new Audio("/alert3.mp3");
        audio.play().catch(() => {
          // 파일 재생 실패 시 비프음 사용
          playBeep();
        });
      };

      playSound();

      // 반복 재생 (알림 확인 전까지)
      if (!loopRef.current) {
        loopRef.current = setInterval(playSound, 3000);
      }
    },
    toast: (msg, type, { id }) => {
      if (type !== "new") return;

      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
      }

      toastIdRef.current = toast(
        <div className="flex flex-col gap-3 w-full">
          <div className="flex items-center gap-2 font-semibold text-lg">
            <span className="text-2xl animate-bounce">🔔</span>
            <span>{msg}</span>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="default"
              className="bg-[#D61C1C] hover:bg-[#B81515] text-white flex-1"
              onClick={async () => {
                stopLoop();
                try {
                  const orderId = latestOrderIdRef.current;
                  if (!orderId) return;

                  const docRef = doc(db, "orders", orderId);
                  const snap = await getDoc(docRef);
                  if (snap.exists()) {
                    printOrderReceipt(orderId, snap.data() as Order);
                  } else {
                    toast.error("주문 정보를 찾을 수 없습니다.");
                  }
                } catch (error) {
                  console.error(error);
                  toast.error("영수증 출력 중 오류가 발생했습니다.");
                }
              }}
            >
              확인 및 영수증 출력
            </Button>
            <Button size="sm" variant="outline" onClick={() => stopLoop()}>
              알림 끄기
            </Button>
          </div>
        </div>,
        {
          duration: Infinity, // 사용자가 닫을 때까지 유지
          position: "top-center",
          style: {
            background: "#fff",
            border: "2px solid #D61C1C",
            padding: "16px",
          },
        },
      );
    },
  });

  // 컴포넌트 언마운트 시 루프 정지
  useEffect(() => {
    return () => stopLoop();
  }, []);

  return null;
}
