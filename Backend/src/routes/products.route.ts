import { Router } from 'express';
import ProductsController from '@controllers/products.controller';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@middlewares/auth.middleware';
import WebSocketManager from '@/socket/index.socket';

class ProductsRoute implements Routes {
  public path = '/products';
  public router = Router();
  public productsController;

  constructor(wsSocket: WebSocketManager) {
    this.productsController = new ProductsController(wsSocket);
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, authMiddleware, this.productsController.createProduct);
    this.router.put(`${this.path}/:id(\\d+)`, authMiddleware, this.productsController.updateProduct);
    this.router.delete(`${this.path}/:id(\\d+)`, authMiddleware, this.productsController.deleteProduct);
  }
}

export default ProductsRoute;
