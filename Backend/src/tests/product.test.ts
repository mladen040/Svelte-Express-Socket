import bcrypt from 'bcrypt';
import request from 'supertest';
import { createConnection, getConnection } from 'typeorm';
import App from '@/app';
import { dbConnection } from '@databases';
import ProductRoute from '@routes/products.route';
import WebSocketManager from '@/socket/index.socket';
import { CreateProductDto } from '@/dtos/products.dto';
import { ProductEntity } from '@/entities/product.entity';
import { DataStoredInToken } from '@/interfaces/auth.interface';
import { SECRET_KEY } from '@/config';
import { sign } from 'jsonwebtoken';
import { UserEntity } from '@/entities/users.entity';

const getToken = (userId) => {
  const dataStoredInToken: DataStoredInToken = { id: userId };
  const secretKey: string = SECRET_KEY;
  const expiresIn: number = 60 * 60;
  return sign(dataStoredInToken, secretKey, { expiresIn });
};

beforeAll(async () => {
  await createConnection(dbConnection);
});

afterAll(async () => {
  await getConnection().close();
});

describe('Testing Products', () => {
  describe('[POST] /Products', () => {
    it('response Create product', async () => {
      const userId = 1;
      const productData: CreateProductDto = {
        name: 'product 1',
        description: 'product 1 description',
        price: 10,
        userId: userId,
        userGroup: 'Blue'
      };

      const wsSocket = new WebSocketManager();
      const productsRoute = new ProductRoute(wsSocket);

      UserEntity.findOne = jest.fn().mockReturnValue({
        id: userId,
        firstName: 'test',
        lastName: 'user',
        email: 'test@email.com',
        role: 'Normal',
        group: 'Blue',
        password: await bcrypt.hash('q1w2e3r4!', 10)
      });

      const app = new App(wsSocket, [productsRoute]);
      const token = getToken(userId);

      return request(app.getServer()).post(`${productsRoute.path}`).set('Authorization', `Bearer ${token}`).set('Accept', 'application/json').set('Content-Type', 'application/json').send(productData).expect(201);
    });
  });

  describe('[PUT] /products', () => {
    it('response Update products', async () => {
      const userId = 1;
      const productId = 1;

      const wsSocket = new WebSocketManager();
      const productsRoute = new ProductRoute(wsSocket);

      const productData: CreateProductDto = {
        name: 'product 1',
        description: 'product 1 description',
        price: 10,
        userId: userId,
        userGroup: 'Blue'
      };

      UserEntity.findOne = jest.fn().mockReturnValue({
        id: userId,
        firstName: 'test',
        lastName: 'user',
        email: 'test@email.com',
        role: 'Normal',
        group: 'Blue',
        password: await bcrypt.hash('q1w2e3r4!', 10)
      });

      ProductEntity.update = jest.fn().mockReturnValue({
        generatedMaps: [],
        raw: [],
        affected: 1
      });

      ProductEntity.findOne = jest.fn().mockReturnValue({
        id: productId,
        name: 'product 1',
        description: 'product 1 description',
        price: 10,
        userId: userId,
        userGroup: 'Blue'
      });

      const app = new App(wsSocket, [productsRoute]);
      const token = getToken(userId);
      return request(app.getServer()).put(`${productsRoute.path}/${productId}`).set('Authorization', `Bearer ${token}`).set('Accept', 'application/json').set('Content-Type', 'application/json').send(productData).expect(200);
    });
  });

  describe('[DELETE] /products/:id', () => {
    it('response Delete product', async () => {
      const userId = 1;
      const productId = 1;
      const wsSocket = new WebSocketManager();
      const productsRoute = new ProductRoute(wsSocket);

      UserEntity.findOne = jest.fn().mockReturnValue({
        id: userId,
        firstName: 'test',
        lastName: 'user',
        email: 'test@email.com',
        role: 'Normal',
        group: 'Blue',
        password: await bcrypt.hash('q1w2e3r4!', 10)
      });

      ProductEntity.findOne = jest.fn().mockReturnValue({
        id: productId,
        name: 'product 1',
        description: 'product 1 description',
        price: 10,
        userId: userId,
        userGroup: 'Blue'
      });

      const app = new App(wsSocket, [productsRoute]);
      const token = getToken(userId);

      return request(app.getServer()).delete(`${productsRoute.path}/${productId}`).set('Authorization', `Bearer ${token}`).set('Accept', 'application/json').set('Content-Type', 'application/json').expect(200);
    });
  });
});
