import bcrypt from 'bcrypt';
import request from 'supertest';
import { createConnection, getConnection } from 'typeorm';
import App from '@/app';
import { dbConnection } from '@databases';
import { CreateUserDto } from '@dtos/users.dto';
import { UserEntity } from '@entities/users.entity';
import UserRoute from '@routes/users.route';
import WebSocketManager from '@/socket/index.socket';

beforeAll(async () => {
  await createConnection(dbConnection);
});

afterAll(async () => {
  await getConnection().close();
});

describe('Testing Users', () => {
  describe('[POST] /users', () => {
    it('response Create user', async () => {
      const userData: CreateUserDto = {
        firstName: 'a',
        lastName: 'user1',
        email: 'a@email.com',
        role: 'Normal',
        group: 'Blue',
        password: 'q1w2e3r4!'
      };

      const usersRoute = new UserRoute();

      UserEntity.findOne = jest.fn().mockReturnValue(null);
      UserEntity.save = jest.fn().mockReturnValue({
        id: 1,
        ...userData,
        password: await bcrypt.hash(userData.password, 10)
      });

      const wsSocket = new WebSocketManager();

      const app = new App(wsSocket, [usersRoute]);
      return request(app.getServer()).post(`${usersRoute.path}`).send(userData).expect(201);
    });
  });

  describe('[GET] /users', () => {
    it('response findAll users', async () => {
      const usersRoute = new UserRoute();

      UserEntity.find = jest.fn().mockReturnValue([
        {
          id: 1,
          email: 'a@email.com',
          password: await bcrypt.hash('q1w2e3r4!', 10)
        }
      ]);

      const wsSocket = new WebSocketManager();
      const app = new App(wsSocket, [usersRoute]);
      return request(app.getServer()).get(`${usersRoute.path}`).expect(200);
    });
  });

  describe('[GET] /users/:id', () => {
    it('response findOne user', async () => {
      const userId = 1;

      const usersRoute = new UserRoute();

      UserEntity.findOne = jest.fn().mockReturnValue({
        id: userId,
        email: 'a@email.com',
        password: await bcrypt.hash('q1w2e3r4!', 10)
      });

      const wsSocket = new WebSocketManager();
      const app = new App(wsSocket, [usersRoute]);
      return request(app.getServer()).get(`${usersRoute.path}/${userId}`).expect(200);
    });
  });

  describe('[PUT] /users/:id', () => {
    it('response Update user', async () => {
      const userId = 1;

      const userData: CreateUserDto = {
        firstName: 'test',
        lastName: 'user',
        email: 'test@email.com',
        role: 'Normal',
        group: 'Blue',
        password: 'q1w2e3r4!'
      };

      const usersRoute = new UserRoute();

      UserEntity.update = jest.fn().mockReturnValue({
        generatedMaps: [],
        raw: [],
        affected: 1
      });
      UserEntity.findOne = jest.fn().mockReturnValue({
        id: userId,
        email: userData.email,
        password: await bcrypt.hash(userData.password, 10)
      });

      const wsSocket = new WebSocketManager();
      const app = new App(wsSocket, [usersRoute]);
      return request(app.getServer()).put(`${usersRoute.path}/${userId}`).send(userData).expect(200);
    });
  });

  describe('[DELETE] /users/:id', () => {
    it('response Delete user', async () => {
      const userId = 1;

      const usersRoute = new UserRoute();

      UserEntity.findOne = jest.fn().mockReturnValue({
        id: userId,
        email: 'a@email.com',
        password: await bcrypt.hash('q1w2e3r4!', 10)
      });

      const wsSocket = new WebSocketManager();
      const app = new App(wsSocket, [usersRoute]);
      return request(app.getServer()).delete(`${usersRoute.path}/${userId}`).expect(200);
    });
  });
});
