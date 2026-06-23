import { MessageCircle, Send, X, Headphones } from "lucide-react";
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ChatWidget() {
  const { chat, sendChat } = useApp();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

  const send = () => {
    const t = text.trim();
    if (!t) return;
    sendChat("customer", t);
    setText("");
    // mock auto-reply
    setTimeout(() => {
      sendChat("support", "شكراً لتواصلك! سيتم الرد عليك خلال دقائق من فريق الدعم.");
    }, 900);
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 left-5 z-40 w-14 h-14 rounded-full bg-gradient-hero text-white shadow-elegant grid place-items-center hover:scale-105 transition"
          aria-label="فتح الدردشة"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}
      {open && (
        <div className="fixed bottom-5 left-5 z-40 w-[340px] max-w-[calc(100vw-2rem)] h-[460px] bg-card border border-border rounded-2xl shadow-elegant flex flex-col overflow-hidden" dir="rtl">
          <div className="bg-gradient-hero text-white p-3 flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-white/20 grid place-items-center"><Headphones className="w-4 h-4" /></div>
            <div className="flex-1">
              <div className="font-black text-sm">دعم BROO</div>
              <div className="text-[10px] opacity-90">متصل الآن</div>
            </div>
            <button onClick={() => setOpen(false)} className="hover:bg-white/15 rounded-lg p-1"><X className="w-4 h-4" /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-muted/30">
            {chat.map((m) => (
              <div key={m.id} className={`flex ${m.from === "customer" ? "justify-start" : "justify-end"}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm shadow-soft ${
                  m.from === "customer"
                    ? "bg-primary text-primary-foreground rounded-bl-sm"
                    : "bg-card border border-border rounded-br-sm"
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-2 border-t bg-background flex gap-2">
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="اكتب رسالتك..."
              className="flex-1"
            />
            <Button onClick={send} size="icon" className="bg-gradient-hero text-white"><Send className="w-4 h-4" /></Button>
          </div>
        </div>
      )}
    </>
  );
}
