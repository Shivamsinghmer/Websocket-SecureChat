import { motion } from "framer-motion"
import { User } from "lucide-react"
import type { Message } from "../types/chat"
import { cn } from "../lib/utils"

interface MessageItemProps {
    msg: Message
}

export function MessageItem({ msg }: MessageItemProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={cn(
                "flex w-full group",
                msg.sender === "me" ? "justify-end" : "justify-start"
            )}
        >
            <div className={cn(
                "flex gap-3 max-w-[80%]",
                msg.sender === "me" ? "flex-row-reverse" : "flex-row"
            )}>
                <div className={cn(
                    "size-8 rounded-lg shrink-0 flex items-center justify-center border",
                    msg.sender === "me"
                        ? "bg-white/10 border-white/20 text-white"
                        : "bg-zinc-800/50 border-zinc-700 text-zinc-500"
                )}>
                    <User size={16} />
                </div>
                <div className="space-y-1">
                    <div className={cn(
                        "px-5 py-3 rounded-2xl text-sm md:text-base font-medium transition-all shadow-sm",
                        msg.sender === "me"
                            ? "bg-white text-black rounded-tr-none"
                            : "bg-zinc-800 text-zinc-200 rounded-tl-none border border-zinc-700/50"
                    )}>
                        {msg.text}
                    </div>
                    <p className={cn(
                        "text-[10px] font-bold text-zinc-500 uppercase tracking-tighter mx-1",
                        msg.sender === "me" ? "text-right" : "text-left"
                    )}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>
            </div>
        </motion.div>
    )
}
