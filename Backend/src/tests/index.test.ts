import request from 'supertest';
import App from '@/app';
import IndexRoute from '@routes/index.route';
import WebSocketManager from '@/socket/index.socket';

afterAll(async () => {
  await new Promise<void>((resolve) => setTimeout(() => resolve(), 500));
});

describe('Testing Index', () => {
  describe('[GET] /', () => {
    it('response statusCode 200', () => {
      const wsSocket = new WebSocketManager();
      const indexRoute = new IndexRoute();
      const app = new App(wsSocket, [indexRoute]);

      return request(app.getServer()).get(`${indexRoute.path}`).expect(200);
    });
  });
});
