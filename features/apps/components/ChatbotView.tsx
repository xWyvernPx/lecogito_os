
import React, { useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { RetroButton } from '../../../components/ui/retro-ui';
import { Message } from '../hooks/use-chatbot';

interface ChatbotViewProps {
    messages: Message[];
    input: string;
    setInput: (val: string) => void;
    isLoading: boolean;
    onSend: () => void;
}

export const ChatbotView: React.FC<ChatbotViewProps> = ({ 
    messages, 
    input, 
    setInput, 
    isLoading, 
    onSend 
}) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSend();
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#fdfdfd] relative font-sans">
            {/* Header / Info Strip */}
            <div className="bg-[#e8e4d9] border-b-2 border-stone-800 px-4 py-2 flex items-center justify-between shadow-sm shrink-0">
                <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-[#ff7e33]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-700">Neural Link v3.0</span>
                </div>
                <div className="text-[10px] font-mono text-stone-500">Latency: Low</div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-stone-50">
                {messages.map((msg, idx) => (
                    <div 
                        key={idx} 
                        className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                        <div className={`
                            w-8 h-8 rounded-full border-2 border-stone-800 flex items-center justify-center shrink-0 shadow-sm
                            ${msg.role === 'model' ? 'bg-[#ff7e33] text-white' : 'bg-white text-stone-700'}
                        `}>
                            {msg.role === 'model' ? <Bot size={16} /> : <User size={16} />}
                        </div>
                        
                        <div className={`
                            max-w-[85%] p-3 border-2 border-stone-300 shadow-sm text-sm leading-relaxed
                            ${msg.role === 'user' 
                                ? 'bg-white rounded-l-lg rounded-br-lg' 
                                : 'bg-[#e8e4d9] rounded-r-lg rounded-bl-lg font-mono text-stone-800'}
                        `}>
                            {msg.role === 'model' ? (
                                <div className="prose prose-sm max-w-none prose-p:my-1 prose-pre:bg-stone-900 prose-pre:text-stone-100 prose-code:bg-stone-300 prose-code:px-1 prose-code:rounded prose-code:text-[#c2410c] prose-code:text-xs">
                                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                                </div>
                            ) : (
                                msg.text
                            )}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full border-2 border-stone-800 flex items-center justify-center shrink-0 bg-[#ff7e33] text-white">
                            <Bot size={16} />
                        </div>
                        <div className="bg-[#e8e4d9] p-3 border-2 border-stone-300 rounded-r-lg rounded-bl-lg flex items-center gap-2">
                            <Loader2 size={16} className="animate-spin text-stone-600" />
                            <span className="text-xs font-mono text-stone-500">Processing thought stream...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t-2 border-stone-200 shrink-0">
                <div className="flex gap-2 items-end">
                    <div className="flex-1 relative border-2 border-stone-300 focus-within:border-[#ff7e33] transition-colors bg-stone-50 rounded-sm">
                        <textarea 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your message..."
                            className="w-full max-h-32 min-h-[44px] p-2 bg-transparent outline-none text-sm resize-none block font-mono"
                            rows={1}
                        />
                    </div>
                    <RetroButton 
                        onClick={onSend} 
                        disabled={isLoading || !input.trim()}
                        className="h-[44px] w-[44px] !px-0 flex items-center justify-center"
                    >
                        <Send size={18} />
                    </RetroButton>
                </div>
                <div className="mt-2 text-[10px] text-stone-400 font-mono text-center">
                    Powered by gemini-3-pro-preview
                </div>
            </div>
        </div>
    );
};
