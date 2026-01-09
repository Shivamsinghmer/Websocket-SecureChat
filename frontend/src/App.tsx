import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Send,
  Hash,
  Users,
  Zap,
  MessageSquare,
  Shield,
  User,
  LogOut,
  Sparkles,
  Plus,
  LogIn
} from "lucide-react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Helper for Tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface Message {
  id: string
  text: string
  sender: "me" | "other"
  timestamp: Date
}

function App() {
  const [roomId, setRoomId] = useState("")
  const [joined, setJoined] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [loading, setLoading] = useState(false)
  const [roomUserCount, setRoomUserCount] = useState(0)
  const myUserIdRef = useRef<string | null>(null)

  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const connectToRoom = (forcedRoomId?: string) => {
    const targetRoomId = forcedRoomId || roomId
    if (!targetRoomId.trim()) return
    setLoading(true)

    const ws = new WebSocket("ws://localhost:8080")

    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: "join",
        payload: { roomId: targetRoomId }
      }))
      setJoined(true)
      setLoading(false)
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)

        if (data.type === "joined") {
          myUserIdRef.current = data.payload.userId
          return
        }

        if (data.type === "room_count") {
          setRoomUserCount(data.payload.count)
          return
        }

        const msg: Message = {
          id: Math.random().toString(36).substr(2, 9),
          text: data.text,
          sender: data.senderId === myUserIdRef.current ? "me" : "other",
          timestamp: new Date(data.timestamp)
        }
        setMessages(prev => [...prev, msg])
      } catch (e) {
        console.error("Error parsing message", e)
      }
    }

    ws.onclose = () => {
      setJoined(false)
      setSocket(null)
    }

    setSocket(ws)
  }

  const sendMessage = () => {
    if (!socket || !message.trim()) return

    socket.send(JSON.stringify({
      type: "message",
      payload: { message }
    }))

    setMessage("")
  }


  const createNewRoom = () => {
    const id = Math.random().toString(36).substring(2, 10)
    setRoomId(id)
    connectToRoom(id)
  }

  const leaveRoom = () => {
    socket?.close()
    setJoined(false)
    setMessages([])
  }

  return (
    <div className="min-h-screen w-screen bg-[#020617] text-slate-200 selection:bg-primary-500/30 font-sans overflow-hidden relative">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-900/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/10 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-blue-900/10 blur-[100px] rounded-full" />
      </div>

      <main className="relative z-10 w-full min-h-screen flex items-center justify-center p-4 md:p-8">
        <AnimatePresence mode="wait">
          {!joined ? (
            <motion.div
              key="join-screen"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full flex justify-center"
            >
              <div className="w-full max-w-lg">
                <div className="text-center mb-10 space-y-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 10, stiffness: 100, delay: 0.2 }}
                    className="inline-flex p-4 rounded-3xl bg-primary-500/10 border border-primary-500/20 text-primary-400 mb-2"
                  >
                    <Shield size={40} strokeWidth={1.5} />
                  </motion.div>
                  <h1 className="text-5xl font-black tracking-tight text-white flex items-center justify-center gap-3">
                    Secure<span className="text-primary-500">Chat</span>
                    <Sparkles className="text-yellow-500 size-6" />
                  </h1>
                  <p className="text-slate-400 text-lg font-medium max-w-xs mx-auto">
                    Ephemeral, encrypted, and incredibly fast conversations.
                  </p>
                </div>

                <div className="bg-slate-900/40 backdrop-blur-2xl border border-slate-800/50 p-8 rounded-[2.5rem] shadow-2xl space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 px-1 flex items-center gap-2 uppercase tracking-widest">
                      <Hash size={14} /> Room Identifier
                    </label>
                    <div className="relative group">
                      <input
                        type="text"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && connectToRoom()}
                        placeholder="e.g. secret-base-01"
                        className="w-full px-6 py-5 bg-slate-950/50 border border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-white placeholder:text-slate-600 text-lg font-medium"
                      />
                      <Zap size={20} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-primary-500 transition-colors" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      onClick={() => connectToRoom()}
                      disabled={loading || !roomId.trim()}
                      className="group relative overflow-hidden bg-primary-600 hover:bg-primary-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary-900/20 transition-all flex items-center justify-center gap-2"
                    >
                      <span className="relative z-10 flex items-center gap-2 group-active:scale-95 transition-transform">
                        {loading ? "Linking..." : "Join Existing"}
                        <LogIn size={18} className="group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </button>

                    <button
                      onClick={createNewRoom}
                      disabled={loading}
                      className="group relative overflow-hidden bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-slate-900/20 transition-all flex items-center justify-center gap-2"
                    >
                      <span className="relative z-10 flex items-center gap-2 group-active:scale-95 transition-transform">
                        Create New
                        <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                      </span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-center justify-center p-4 rounded-3xl bg-slate-950/30 border border-slate-800/50 gap-2">
                      <Users size={20} className="text-slate-500" />
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Multi-User</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4 rounded-3xl bg-slate-950/30 border border-slate-800/50 gap-2">
                      <Shield size={20} className="text-slate-500" />
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Secure Link</span>
                    </div>
                  </div>
                </div>

                <p className="mt-8 text-center text-slate-500 text-sm">
                  By joining, you agree to our <span className="text-slate-400 hover:underline cursor-pointer">End-to-End</span> policy.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="chat-screen"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-6xl h-full md:h-[max(600px,calc(100vh-100px))] flex overflow-hidden"
            >
              <div className="flex-1 flex flex-col bg-slate-900/40 backdrop-blur-3xl md:border border-slate-800/50 md:rounded-[2.5rem] shadow-2xl overflow-hidden relative">
                {/* Header */}
                <header className="px-8 py-6 border-b border-slate-800/50 flex items-center justify-between bg-slate-950/20">
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-2xl bg-primary-500/20 border border-primary-500/30 flex items-center justify-center text-primary-400">
                      <MessageSquare size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        {roomId}
                        <span className="inline-block size-2 rounded-full bg-emerald-500 animate-pulse" />
                      </h2>
                      <div className="flex items-center gap-2">
                        <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">Active Connection</p>
                        <span className="text-slate-700">•</span>
                        <div className="flex items-center gap-1 text-primary-400">
                          <Users size={12} />
                          <span className="text-xs font-bold uppercase tracking-widest">{roomUserCount} {roomUserCount === 1 ? 'User' : 'Users'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={leaveRoom}
                      className="p-3 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all flex items-center gap-2"
                      title="Leave Room"
                    >
                      <LogOut size={20} />
                      <span className="text-sm font-bold hidden sm:block">Exit</span>
                    </button>
                  </div>
                </header>

                {/* Messages Area */}
                <div
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto p-8 space-y-6 scroll-smooth custom-scrollbar"
                >
                  <div className="flex flex-col items-center justify-center p-10 space-y-4 opacity-50">
                    <div className="size-16 rounded-full bg-slate-800/50 flex items-center justify-center">
                      <Shield size={32} className="text-slate-600" />
                    </div>
                    <p className="text-sm text-slate-500 font-medium text-center">
                      You entered <b>#{roomId}</b><br />
                      This conversation is private.
                    </p>
                  </div>

                  <AnimatePresence initial={false}>
                    {messages.map((msg, idx) => (
                      <motion.div
                        key={msg.id}
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
                              ? "bg-primary-500/10 border-primary-500/20 text-primary-400"
                              : "bg-slate-800/50 border-slate-700 text-slate-500"
                          )}>
                            <User size={16} />
                          </div>
                          <div className="space-y-1">
                            <div className={cn(
                              "px-5 py-3 rounded-2xl text-sm md:text-base font-medium transition-all shadow-sm",
                              msg.sender === "me"
                                ? "bg-primary-600 text-white rounded-tr-none"
                                : "bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700/50"
                            )}>
                              {msg.text}
                            </div>
                            <p className={cn(
                              "text-[10px] font-bold text-slate-500 uppercase tracking-tighter mx-1",
                              msg.sender === "me" ? "text-right" : "text-left"
                            )}>
                              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Footer Input */}
                <footer className="p-6 md:p-8 bg-slate-950/20 border-t border-slate-800/50">
                  <div className="relative flex items-center gap-3">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                      placeholder="Type your message..."
                      className="flex-1 bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-white placeholder:text-slate-600 font-medium"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!message.trim()}
                      className="size-[58px] flex items-center justify-center bg-primary-600 hover:bg-primary-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-2xl shadow-lg shadow-primary-900/20 transition-all active:scale-95 group"
                    >
                      <Send size={24} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                  </div>
                </footer>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

export default App
