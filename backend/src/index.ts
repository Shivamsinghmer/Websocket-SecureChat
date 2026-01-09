import { WebSocketServer, WebSocket } from "ws";

const PORT = Number(process.env.PORT) || 8080;
const wss = new WebSocketServer({ port: PORT });

interface UserSession {
    roomID: string;
    userId: string;
}

// Map to track active sessions per socket
const activeSessions = new Map<WebSocket, UserSession>();
let totalConnections = 0;

// Helper to broadcast room member count
const broadcastRoomCount = (roomID: string) => {
    let count = 0;
    activeSessions.forEach((session) => {
        if (session.roomID === roomID) count++;
    });

    const payload = JSON.stringify({
        type: "room_count",
        payload: { count }
    });

    activeSessions.forEach((session, socket) => {
        if (session.roomID === roomID && socket.readyState === WebSocket.OPEN) {
            socket.send(payload);
        }
    });
};

wss.on("connection", (socket: WebSocket) => {
    // Every connection gets a temporary unique ID
    const userId = `user-${Math.random().toString(36).substring(2, 9)}`;
    totalConnections++;

    console.log(`[CONN] New connection: ${userId} (${totalConnections} total)`);

    socket.on("message", (msg) => {
        try {
            const parsedMsg = JSON.parse(msg.toString());

            // Handle Room Joining
            if (parsedMsg.type === "join") {
                const targetRoomId = parsedMsg.payload.roomId;
                const previousSession = activeSessions.get(socket);
                const previousRoomId = previousSession?.roomID;

                // Update or Create session
                activeSessions.set(socket, {
                    roomID: targetRoomId,
                    userId: userId
                });

                // Confirm to client
                socket.send(JSON.stringify({
                    type: "joined",
                    payload: { userId, roomId: targetRoomId }
                }));

                console.log(`[JOIN] ${userId} -> ${targetRoomId}`);
                broadcastRoomCount(targetRoomId);

                // If they were in another room, update that room's count too
                if (previousRoomId && previousRoomId !== targetRoomId) {
                    broadcastRoomCount(previousRoomId);
                }
            }

            // Handle Messaging
            if (parsedMsg.type === "message") {
                const session = activeSessions.get(socket);

                if (session) {
                    const { roomID, userId: senderId } = session;

                    const broadcastPayload = JSON.stringify({
                        text: parsedMsg.payload.message,
                        senderId: senderId,
                        timestamp: new Date().toISOString()
                    });

                    // Broadcast to everyone in the same room
                    activeSessions.forEach((clientSession, clientSocket) => {
                        if (clientSession.roomID === roomID && clientSocket.readyState === WebSocket.OPEN) {
                            clientSocket.send(broadcastPayload);
                        }
                    });

                    console.log(`[MSG] ${senderId} in ${roomID}: "${parsedMsg.payload.message.substring(0, 20)}..."`);
                } else {
                    console.warn(`[WARN] ${userId} tried to send message without joining a room`);
                }
            }
        } catch (e) {
            console.error("[ERR] Failed to process message:", e);
        }
    });

    socket.on("close", () => {
        const session = activeSessions.get(socket);
        const sid = session?.userId || userId;

        const rid = session?.roomID;

        activeSessions.delete(socket);
        totalConnections--;

        if (rid) broadcastRoomCount(rid);

        console.log(`[DISC] ${sid} disconnected (${totalConnections} remaining)`);
    });

    socket.on("error", (err) => {
        console.error(`[ERR] Socket error for ${userId}:`, err);
    });
});

console.log(`WebSocket Server running on port ${PORT}`);
