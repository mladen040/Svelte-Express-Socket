import { writable } from 'svelte/store';

export type MSEvent = {
  name: string;
  data?: any;
};

export class WebSocketService {
  public socket: WebSocket;
  public event = writable(null);

  public async init(token: string, loggedIn: boolean = false) {
    if (loggedIn) {
      this.socket = null;
    }

    if (!this.socket) {
      this.socket = new WebSocket(`ws://localhost:3000/websockets?token=${token}`);
      this.socket.addEventListener('open', function (event) {
        console.log("It's open", event);
      });

      this.socket.addEventListener('message', (e) => {
        try {
          const event = JSON.parse(e.data) as MSEvent;
          this.event.set(event);
        } catch (err) {}
      });
    }
  }

  public close() {
    this.socket.close();
    this.socket = null;
    this.event.set('');
  }

  public send(message: MSEvent) {
    if (this.socket && this.socket.readyState <= 1) {
      console.log('sending ... ', message);
      this.socket.send(JSON.stringify(message));
    }
  }
}

function createWebSocketService() {
  const service: WebSocketService = new WebSocketService();

  const { subscribe, update, set } = writable(service);

  return {
    subscribe,
    update,
    set
  };
}

export const socketService = createWebSocketService();
