import { io, Socket } from "socket.io-client";
import { APP_API_URI } from "../../config";

class SocketService {
    private socket: Socket | null = null;

    connect() {
        if (this.socket) return;

        this.socket = io(APP_API_URI, {
            transports: ["websocket"],
        });

        this.socket.on("connect", () => {
            console.log("Connected to Socket server:", this.socket?.id);
        });

        this.socket.on("connect_error", (error) => {
            console.error("Socket connection error:", error);
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    getSocket() {
        return this.socket;
    }

    joinRoom(room: string) {
        this.socket?.emit("join_room", room);
    }

    sendMessage(room: string, sender: string, content: string) {
        this.socket?.emit("send_message", { room, sender, content });
    }

    joinUserRoom(userId: string) {
        this.socket?.emit("join_user_room", userId);
    }

    on(event: string, callback: (data: any) => void) {
        this.socket?.on(event, callback);
    }

    off(event: string, callback?: (data: any) => void) {
        if (callback) {
            this.socket?.off(event, callback);
            return;
        }
        this.socket?.off(event);
    }
}

export default new SocketService();
