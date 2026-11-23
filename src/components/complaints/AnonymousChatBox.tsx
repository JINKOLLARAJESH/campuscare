import React, { useState } from 'react';
import { Message, UserRole } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { formatRelativeTime } from '../../lib/utils';
import { Send, Shield, User, Paperclip, Lock } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface AnonymousChatBoxProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  currentUserRole: UserRole;
  isAnonymousComplaint: boolean;
  referenceId: string;
}

export const AnonymousChatBox: React.FC<AnonymousChatBoxProps> = ({
  messages,
  onSendMessage,
  currentUserRole,
  isAnonymousComplaint,
  referenceId,
}) => {
  const [inputText, setInputText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  return (
    <div className="flex flex-col h-[400px] bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      {/* Header banner */}
      <div className="px-4 py-2.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              Secure Anonymous Redressal Channel
              {isAnonymousComplaint && (
                <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 px-1.5 py-0.2 rounded font-semibold">
                  Identity Protected
                </span>
              )}
            </h5>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Case Ref: <span className="font-mono font-medium">{referenceId}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <Shield className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-xs font-medium">No messages in this case yet.</p>
            <p className="text-[11px] text-slate-400 max-w-xs mt-1">
              {currentUserRole === 'student'
                ? 'Send a secure inquiry or follow-up to the authorized officer.'
                : 'Send a confidential clarification request to the complainant.'}
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe =
              currentUserRole === 'student'
                ? msg.senderRole === 'student'
                : msg.senderRole !== 'student';

            return (
              <div
                key={msg.id}
                className={cn('flex flex-col max-w-[82%]', isMe ? 'ml-auto items-end' : 'mr-auto items-start')}
              >
                <div className="flex items-center gap-1.5 mb-1 px-1">
                  <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                    {msg.senderName}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    • {formatRelativeTime(msg.timestamp)}
                  </span>
                </div>

                <div
                  className={cn(
                    'rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-sm',
                    isMe
                      ? 'bg-navy-900 text-white dark:bg-royal-600 rounded-br-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 rounded-bl-xs'
                  )}
                >
                  {msg.content}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input bar */}
      <form
        onSubmit={handleSubmit}
        className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
      >
        <button
          type="button"
          title="Attach document/photo"
          className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          onClick={() => alert('Attachment upload simulated. Selected file attached to case record.')}
        >
          <Paperclip className="w-4 h-4" />
        </button>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={
            isAnonymousComplaint && currentUserRole === 'student'
              ? 'Reply anonymously without exposing identity...'
              : 'Write message to case file...'
          }
          className="flex-1 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-navy-900 dark:focus:ring-royal-500"
        />
        <Button type="submit" size="sm" variant="primary" disabled={!inputText.trim()}>
          <Send className="w-3.5 h-3.5 mr-1" />
          Send
        </Button>
      </form>
    </div>
  );
};
