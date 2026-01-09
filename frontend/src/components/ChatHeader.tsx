import { MessageSquare, Users, LogOut } from "lucide-react"

interface ChatHeaderProps {
    roomId: string
    roomUserCount: number
    leaveRoom: () => void
}

export function ChatHeader({ roomId, roomUserCount, leaveRoom }: ChatHeaderProps) {
    return (
        <header className="px-4 md:px-8 py-4 md:py-6 border-b border-zinc-800/50 flex items-center justify-between bg-zinc-950/20 shrink-0">
            <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                <div className="size-10 md:size-12 rounded-xl md:rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0">
                    <MessageSquare size={20} className="md:w-6 md:h-6" />
                </div>
                <div className="overflow-hidden">
                    <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2 truncate">
                        {roomId}
                        <span className="inline-block size-2 rounded-full bg-white animate-pulse shrink-0" />
                    </h2>
                    <div className="flex items-center gap-2">
                        <p className="text-zinc-500 text-[10px] md:text-xs font-medium uppercase tracking-widest hidden sm:block">Active Connection</p>
                        <span className="text-zinc-700 hidden sm:block">•</span>
                        <div className="flex items-center gap-1 text-zinc-400">
                            <Users size={12} />
                            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">{roomUserCount} {roomUserCount === 1 ? 'User' : 'Users'}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
                <button
                    onClick={leaveRoom}
                    className="p-2 md:p-3 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all flex items-center gap-2"
                    title="Leave Room"
                >
                    <LogOut size={18} className="md:w-5 md:h-5" />
                    <span className="text-xs md:text-sm font-bold hidden xs:block">Exit</span>
                </button>
            </div>
        </header>
    )
}
