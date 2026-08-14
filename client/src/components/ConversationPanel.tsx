import React, { useEffect, useRef } from "react";
import type { ConversationMessage } from "../types";

interface Props {
  messages: ConversationMessage[];
}

export const ConversationPanel: React.FC<Props> = ({ messages }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollRef.current;

    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="w-full max-w-2xl mx-auto">

      <div
        ref={scrollRef}
        className="
          max-h-[190px]
          overflow-y-auto
          overscroll-contain
          px-1
          py-2

          [scrollbar-width:thin]
          [scrollbar-color:#cbd5e1_transparent]
        "
      >
        <div className="flex flex-col gap-3 px-3">

          {messages.length === 0 ? (
            <div className="flex justify-center py-6">
              <p className="text-sm text-slate-400">
                Conversation will appear here...
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isUser = msg.role === "user";

              return (
                <div
                  key={msg.id}
                  className={`flex w-full ${
                    isUser
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`
                      max-w-[85%]
                      rounded-2xl
                      px-4
                      py-2.5
                      text-sm
                      leading-6

                      ${
                        isUser
                          ? `
                            rounded-br-md
                            bg-slate-100
                            text-slate-700
                          `
                          : `
                            rounded-bl-md
                            bg-white
                            text-slate-600
                            shadow-sm
                            ring-1
                            ring-slate-200/70
                          `
                      }
                    `}
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })
          )}

        </div>
      </div>
    </div>
  );
};

export default ConversationPanel;