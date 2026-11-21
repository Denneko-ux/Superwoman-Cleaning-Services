import { useEffect, useRef, useState } from 'react';
import { MessageSquare, Send, X } from 'lucide-react';
import { CLEANING_PACKAGES } from '../data/catalog.ts';
import type { ChatMessage } from '../types/cleaning.ts';

interface LiveChatWidgetProps {
  isOpen: boolean;
  onToggle: (open: boolean) => void;
  onApplyPackage: (packageId: string) => void;
}

const STARTER_PROMPTS = [
  'What does Detailed Deep Cleaning cover?',
  'Do you handle Airbnb vacation turnarounds?',
  'Can I book weekly office & commercial care?',
];

export function LiveChatWidget({
  isOpen,
  onToggle,
  onApplyPackage,
}: LiveChatWidgetProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content:
        'Hello! I am the Superwoman Cleaning Services concierge. Ask about residential, Airbnb, office services, or reach us directly via Call/WhatsApp at (876) 474-0899 or missdiandrosuperwomancleaning@gmail.com.',
      timestamp: 'Now',
    },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const scrollEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    setErrorMsg(null);
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setInput('');
    setSending(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: nextHistory.slice(1, -1).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = (await res.json()) as {
        reply?: string;
        suggestedPackageId?: string;
        error?: string;
      };

      if (!res.ok || !data.reply) {
        throw new Error(data.error || 'Unable to reach live chat support.');
      }

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        suggestedPackageId: data.suggestedPackageId,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Unable to send message right now.'
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {isOpen ? (
        <aside
          aria-label="Live customer chat"
          className="w-[min(380px,calc(100vw-2.5rem))] h-[500px] max-h-[80vh] bg-white border border-[#D6D3C9] rounded-xl shadow-xl flex flex-col overflow-hidden"
        >
          <div className="px-4 py-3.5 bg-[#14211D] text-white flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src="/assets/aistudio/logo_transparent.png"
                alt="Superwoman Cleaning Services"
                className="h-12 w-auto rounded-lg object-contain bg-[#FAF9F6] px-2 py-1 shrink-0"
              />
              <div>
                <p className="text-sm font-semibold">Superwoman Live Support</p>
                <p className="text-[11px] text-[#C8D3CE] font-mono tabular-nums">
                  Call/WhatsApp: (876) 474-0899
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onToggle(false)}
              aria-label="Close live chat"
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAF9F6]">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              const pkg = msg.suggestedPackageId
                ? CLEANING_PACKAGES.find((p) => p.id === msg.suggestedPackageId)
                : null;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      isUser
                        ? 'bg-[#115E46] text-white'
                        : 'bg-white border border-[#E4E2DA] text-[#14211D]'
                    }`}
                  >
                    {msg.content}
                  </div>
                  {pkg && !isUser && (
                    <button
                      type="button"
                      onClick={() => {
                        onApplyPackage(pkg.id);
                        onToggle(false);
                      }}
                      className="mt-1.5 text-xs font-semibold text-[#115E46] hover:underline cursor-pointer"
                    >
                      Select {pkg.name} in Booking Calendar →
                    </button>
                  )}
                  <span className="mt-1 text-[10px] text-[#78847E]">{msg.timestamp}</span>
                </div>
              );
            })}

            {sending && (
              <div className="flex items-start">
                <div className="bg-white border border-[#E4E2DA] rounded-xl px-3.5 py-2 text-xs text-[#4E5D57]">
                  Concierge is typing...
                </div>
              </div>
            )}

            {errorMsg && (
              <div
                role="alert"
                className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800"
              >
                {errorMsg}
              </div>
            )}

            <div ref={scrollEndRef} />
          </div>

          {messages.length <= 2 && (
            <div className="px-4 py-2 bg-[#FAF9F6] border-t border-[#E4E2DA] flex flex-wrap gap-1.5">
              {STARTER_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendMessage(prompt)}
                  className="text-left text-[11px] font-medium text-[#14211D] bg-white border border-[#E4E2DA] hover:border-[#115E46] rounded-md px-2.5 py-1 transition-colors cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="p-3 bg-white border-t border-[#E4E2DA] flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about packages or timing..."
              aria-label="Chat message"
              className="flex-1 h-10 px-3 text-sm rounded-lg border border-[#D6D3C9] bg-[#FAF9F6] text-[#14211D] focus:outline-none focus:border-[#115E46]"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              aria-label="Send message"
              className="w-10 h-10 rounded-lg bg-[#115E46] hover:bg-[#0D4A37] disabled:opacity-50 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" aria-hidden="true" />
            </button>
          </form>
        </aside>
      ) : (
        <button
          type="button"
          onClick={() => onToggle(true)}
          className="h-11 px-4 rounded-full bg-[#14211D] hover:bg-[#115E46] text-white text-sm font-semibold shadow-lg transition-colors inline-flex items-center gap-2 cursor-pointer whitespace-nowrap"
        >
          <MessageSquare className="w-4 h-4" aria-hidden="true" />
          <span>Live Chat</span>
        </button>
      )}
    </div>
  );
}
