import { motion } from "framer-motion"
import { Shield, Sparkles, Hash, Zap, LogIn, Plus, Users } from "lucide-react"

interface JoinScreenProps {
    roomId: string
    setRoomId: (id: string) => void
    loading: boolean
    connectToRoom: () => void
    createNewRoom: () => void
}

export function JoinScreen({
    roomId,
    setRoomId,
    loading,
    connectToRoom,
    createNewRoom,
}: JoinScreenProps) {
    return (
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
                        className="inline-flex p-4 rounded-3xl bg-white/10 border border-white/20 text-white mb-2"
                    >
                        <Shield size={40} strokeWidth={1.5} />
                    </motion.div>
                    <h1 className="text-5xl font-black tracking-tight text-white flex items-center justify-center gap-3">
                        Secure<span className="text-white/90">Chat</span>
                        <Sparkles className="text-white size-6" />
                    </h1>
                    <p className="text-zinc-400 text-lg font-medium max-w-xs mx-auto">
                        Ephemeral, encrypted, and incredibly fast conversations.
                    </p>
                </div>

                <div className="bg-zinc-900/40 backdrop-blur-2xl border border-zinc-800/50 p-8 rounded-[2.5rem] shadow-2xl space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 px-1 flex items-center gap-2 uppercase tracking-widest">
                            <Hash size={14} /> Room Identifier
                        </label>
                        <div className="relative group">
                            <input
                                type="text"
                                value={roomId}
                                onChange={(e) => setRoomId(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && connectToRoom()}
                                placeholder="e.g. secret-base-01"
                                className="w-full px-6 py-5 bg-zinc-950/50 border border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all text-white placeholder:text-zinc-600 text-lg font-medium"
                            />
                            <Zap size={20} className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-white transition-colors" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                            onClick={() => connectToRoom()}
                            disabled={loading || !roomId.trim()}
                            className="group relative overflow-hidden bg-white hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed text-black font-bold py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
                        >
                            <span className="relative z-10 flex items-center gap-2 group-active:scale-95 transition-transform">
                                {loading ? "Linking..." : "Join Existing"}
                                <LogIn size={18} className="group-hover:translate-x-0.5 transition-transform" />
                            </span>
                        </button>

                        <button
                            onClick={createNewRoom}
                            disabled={loading}
                            className="group relative overflow-hidden bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-zinc-900/20 transition-all flex items-center justify-center gap-2"
                        >
                            <span className="relative z-10 flex items-center gap-2 group-active:scale-95 transition-transform">
                                Create Random Room
                                <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                            </span>
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col items-center justify-center p-4 rounded-3xl bg-zinc-950/30 border border-zinc-800/50 gap-2">
                            <Users size={20} className="text-zinc-500" />
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">Multi-User</span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-4 rounded-3xl bg-zinc-950/30 border border-zinc-800/50 gap-2">
                            <Shield size={20} className="text-zinc-500" />
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">Secure Link</span>
                        </div>
                    </div>
                </div>

                <p className="mt-8 text-center text-zinc-500 text-sm">
                    By joining, you agree to our <span className="text-zinc-400 hover:underline cursor-pointer">End-to-End</span> policy.
                </p>
            </div>
        </motion.div>
    )
}
