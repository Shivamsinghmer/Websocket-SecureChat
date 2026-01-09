import { useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Shield } from "lucide-react"
import type { Message } from "../types/chat"
import { MessageItem } from "./MessageItem"
import { ChatHeader } from "./ChatHeader"
import { ChatFooter } from "./ChatFooter"

interface ChatRoomProps {
    roomId: string
    messages: Message[]
    roomUserCount: number
    message: string
    setMessage: (msg: string) => void
    sendMessage: () => void
    leaveRoom: () => void
}

export function ChatRoom({
    roomId,
    messages,
    roomUserCount,
    message,
    setMessage,
    sendMessage,
    leaveRoom
}: ChatRoomProps) {
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    return (
        <motion.div
            key="chat-screen"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-6xl h-dvh md:h-[max(600px,calc(100vh-100px))] flex overflow-hidden lg:rounded-[2.5rem]"
        >
            <div className="flex-1 flex flex-col bg-zinc-900/40 backdrop-blur-3xl md:border border-zinc-800/50 md:rounded-[2.5rem] lg:rounded-[2.5rem] shadow-2xl overflow-hidden relative">
                <ChatHeader
                    roomId={roomId}
                    roomUserCount={roomUserCount}
                    leaveRoom={leaveRoom}
                />

                {/* Messages Area */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4 md:space-y-6 scroll-smooth custom-scrollbar"
                >
                    <div className="flex flex-col items-center justify-center p-10 space-y-4 opacity-50">
                        <div className="size-16 rounded-full bg-zinc-800/50 flex items-center justify-center">
                            <Shield size={32} className="text-zinc-600" />
                        </div>
                        <p className="text-sm text-zinc-500 font-medium text-center">
                            You entered <b>#{roomId}</b><br />
                            This conversation is private.
                        </p>
                    </div>

                    <AnimatePresence initial={false}>
                        {messages.map((msg) => (
                            <MessageItem key={msg.id} msg={msg} />
                        ))}
                    </AnimatePresence>
                </div>

                <ChatFooter
                    message={message}
                    setMessage={setMessage}
                    sendMessage={sendMessage}
                />
            </div>
        </motion.div>
    )
}
