import { useState, useRef } from "react"
import { AnimatePresence } from "framer-motion"
import type { Message } from "./types/chat"
import { JoinScreen } from "./components/JoinScreen"
import { ChatRoom } from "./components/ChatRoom"

function App() {
  const [roomId, setRoomId] = useState("")
  const [joined, setJoined] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [loading, setLoading] = useState(false)
  const [roomUserCount, setRoomUserCount] = useState(0)
  const myUserIdRef = useRef<string | null>(null)

  const connectToRoom = (forcedRoomId?: string) => {
    const targetRoomId = forcedRoomId || roomId
    if (!targetRoomId.trim()) return
    setLoading(true)

    const backendUrl = import.meta.env.VITE_BACKEND_URL || "wss://localhost:8080"
    const socketUrl = backendUrl.startsWith("http")
      ? backendUrl.replace(/^http/, "ws")
      : backendUrl

    const ws = new WebSocket(socketUrl)

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
    <div className="min-h-screen w-screen bg-black text-zinc-200 selection:bg-white/20 font-sans overflow-hidden relative">
      {/* Subtle Monochrome Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/3 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/2 blur-[120px] rounded-full" />
      </div>

      <main className="relative z-10 w-full min-h-screen flex items-center justify-center p-0 md:p-4 lg:p-8">
        <AnimatePresence mode="wait">
          {!joined ? (
            <JoinScreen
              roomId={roomId}
              setRoomId={setRoomId}
              loading={loading}
              connectToRoom={connectToRoom}
              createNewRoom={createNewRoom}
            />
          ) : (
            <ChatRoom
              roomId={roomId}
              messages={messages}
              roomUserCount={roomUserCount}
              message={message}
              setMessage={setMessage}
              sendMessage={sendMessage}
              leaveRoom={leaveRoom}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

export default App
