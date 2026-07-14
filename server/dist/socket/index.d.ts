import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
export declare function initSocket(httpServer: HttpServer): SocketIOServer<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>;
export declare function getIO(): SocketIOServer | null;
//# sourceMappingURL=index.d.ts.map