import WebSocket from 'ws';
import url from 'url';
import { verify } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { DataStoredInToken } from '@interfaces/auth.interface';
import UserSocket from '@socket/user.socket';
import { User } from '@/interfaces/users.interface';

export enum MS_EVENTS { // Message Events
  LOTOUT = 'logout',
  LOGIN = 'logged-in',
  UPDATED = 'updated',
  NOTIFY_UPDATED = 'notify-updated',
  REQUEST = 'request',
  RESPONSE = 'response'
}

export type MSEvent = {
  name: string;
  data?: any;
};

export type NOTIFY_NAME = 'create' | 'update' | 'delete' | 'refresh';

export type NOTIFY_INFO = {
  user?: User;
  name: NOTIFY_NAME;
  entity: string;
  data: any;
};

type MapTokenToUserSocket = Record<string, UserSocket>;
type MapRoomToSockets = Record<string, MapTokenToUserSocket>;

class WebSocketManager {
  private websocketServer;
  private mapTokenToSocket: MapTokenToUserSocket = {};
  private rooms: MapRoomToSockets = {};

  public init(expressServer) {
    this.websocketServer = new WebSocket.Server({
      noServer: true,
      path: '/websockets'
    });

    expressServer.on('upgrade', (request, socket, head) => {
      this.websocketServer.handleUpgrade(request, socket, head, (websocket) => {
        this.websocketServer.emit('connection', websocket, request);
      });
    });

    this.websocketServer.on('connection', async (websocketConnection, connectionRequest) => {
      const token = url.parse(connectionRequest.url, true).query.token;

      if (typeof token === 'string') {
        const secretKey: string = SECRET_KEY;

        try {
          const { id } = (await verify(token, secretKey)) as DataStoredInToken;
          let userSocket = this.mapTokenToSocket[token];

          if (!userSocket) {
            userSocket = new UserSocket(id);
            this.mapTokenToSocket[token] = userSocket;
          }

          const user: User = await userSocket.init(websocketConnection);
          this.joinToRoom(user.group, user.id.toString(), userSocket);
        } catch (err) {
          const msEvent: MSEvent = {
            name: MS_EVENTS.LOTOUT
          };

          if (err.message === 'jwt expired') {
            const socket: UserSocket = this.mapTokenToSocket[token];

            if (socket) {
              socket.send(msEvent);
              this.removeSocket(token);
            }
          }

          websocketConnection.send(JSON.stringify(msEvent));
          websocketConnection.close();
        }
      }
    });

    return this.websocketServer;
  }

  public joinToRoom(room: string, uuid: string, socket: UserSocket) {
    if (!this.rooms[room]) {
      this.rooms[room] = {};
    }

    this.rooms[room][uuid] = socket;
  }

  public leave(room: string, uuid: string) {
    // not present: do nothing
    if (!this.rooms[room][uuid]) return;

    // if the one exiting is the last one, destroy the room
    if (Object.keys(this.rooms[room]).length === 1) {
      delete this.rooms[room];
    } else {
      delete this.rooms[room][uuid];
    }
  }

  public removeSocket(token: string) {
    const userSocket = this.mapTokenToSocket[token];
    if (userSocket) {
      const user = userSocket.getUser();
      this.leave(user.group, user.id.toString());
      delete this.mapTokenToSocket[token];
      userSocket.close();
    }
  }

  public notify(info: NOTIFY_INFO) {
    const secretKey: string = SECRET_KEY;
    const keys = Object.keys(this.mapTokenToSocket);

    keys.forEach(async (token) => {
      const socket = this.mapTokenToSocket[token];

      try {
        await verify(token, secretKey);
      } catch (err) {
        if (err.message === 'jwt expired') {
          const userSocket = this.mapTokenToSocket[token];
          if (userSocket) {
            const msEvent: MSEvent = {
              name: MS_EVENTS.LOTOUT
            };

            socket.send(msEvent);
            this.removeSocket(token);
          }
        }
      }
    });

    const room = this.rooms[info.user.group];

    if (room) {
      const ids = Object.keys(room);

      const msEvent: MSEvent = {
        name: MS_EVENTS.NOTIFY_UPDATED,
        data: info
      };

      ids.forEach((userId) => {
        room[userId].send(msEvent);
      });
    }
  }
}

export default WebSocketManager;
