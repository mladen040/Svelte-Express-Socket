import bcrypt from 'bcrypt';
import request from 'supertest';
import { createConnection, getConnection } from 'typeorm';
import App from '@/app';
import { dbConnection } from '@databases';
import { CreateUserDto } from '@dtos/users.dto';
import { UserEntity } from '@entities/users.entity';
import AuthRoute from '@routes/auth.route';
import WebSocketManager from '@/socket/index.socket';
import { DataStoredInToken } from '@/interfaces/auth.interface';
import { SECRET_KEY } from '@/config';
import { sign } from 'jsonwebtoken';

beforeAll(async () => {
  await createConnection(dbConnection);
});

afterAll(async () => {
  await getConnection().close();
});

describe('Testing Auth', () => {
  describe('[POST] /signup', () => {
    it('response should have the Create userData', async () => {
      const userData: CreateUserDto = {
        firstName: 'test',
        lastName: 'user',
        email: 'test@email.com',
        role: 'Normal',
        group: 'Blue',
        password: 'q1w2e3r4!'
      };

      const wsSocket = new WebSocketManager();
      const authRoute = new AuthRoute(wsSocket);

      UserEntity.findOne = jest.fn().mockReturnValue(null);
      UserEntity.save = jest.fn().mockReturnValue({
        id: 1,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        group: userData.group,
        email: userData.email,
        password: await bcrypt.hash(userData.password, 10)
      });

      const app = new App(wsSocket, [authRoute]);
      return request(app.getServer()).post(`${authRoute.path}signup`).send(userData).expect(201);
    });
  });

  describe('[POST] /login', () => {
    it('response should have the Set-Cookie header with the Authorization token', async () => {
      const userData: CreateUserDto = {
        firstName: 'test',
        lastName: 'user',
        email: 'test@email.com',
        role: 'Normal',
        group: 'Blue',
        password: 'q1w2e3r4!'
      };

      const wsSocket = new WebSocketManager();
      const authRoute = new AuthRoute(wsSocket);

      UserEntity.findOne = jest.fn().mockReturnValue({
        id: 1,
        ...userData,
        password: await bcrypt.hash(userData.password, 10)
      });

      const app = new App(wsSocket, [authRoute]);
      return request(app.getServer())
        .post(`${authRoute.path}login`)
        .send(userData)
        .expect('Set-Cookie', /^Authorization=.+/);
    });
  });

  describe('[POST] /logout', () => {
    it('logout Set-Cookie Authorization=; Max-age=0', async () => {
      const wsSocket = new WebSocketManager();
      const authRoute = new AuthRoute(wsSocket);
      const app = new App(wsSocket, [authRoute]);

      const userId = 1;

      const getToken = (userId) => {
        const dataStoredInToken: DataStoredInToken = { id: userId };
        const secretKey: string = SECRET_KEY;
        const expiresIn: number = 60 * 60;
        return sign(dataStoredInToken, secretKey, { expiresIn });
      };

      UserEntity.findOne = jest.fn().mockReturnValue({
        id: userId,
        email: 'a@email.com',
        password: await bcrypt.hash('q1w2e3r4!', 10)
      });

      const token = getToken(userId);

      return request(app.getServer()).post(`${authRoute.path}logout`).set('Authorization', `Bearer ${token}`).set('Accept', 'application/json').set('Content-Type', 'application/json').expect(200);
    });
  });
});
