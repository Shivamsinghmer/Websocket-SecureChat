import { Send } from "lucide-react"

interface ChatFooterProps {
    message: string
    setMessage: (msg: string) => void
    sendMessage: () => void
}

export function ChatFooter({ message, setMessage, sendMessage }: ChatFooterProps) {
    return (
        <footer className="p-4 md:p-8 bg-zinc-950/20 border-t border-zinc-800/50 shrink-0">
            <div className="relative flex items-center gap-2 md:gap-3">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 bg-zinc-950/50 border border-zinc-800 rounded-xl md:rounded-2xl px-4 md:px-6 py-3 md:py-4 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all text-white placeholder:text-zinc-600 font-medium text-sm md:text-base"
                />
                <button
                    onClick={sendMessage}
                    disabled={!message.trim()}
                    className="size-10 md:size-14 flex items-center justify-center bg-white hover:bg-zinc-200 disabled:bg-zinc-900 disabled:text-zinc-700 text-black rounded-xl md:rounded-2xl shadow-lg transition-all active:scale-95 group shrink-0"
                >
                    <Send size={20} className="md:w-6 md:h-6 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
            </div>
        </footer>
    )
}
