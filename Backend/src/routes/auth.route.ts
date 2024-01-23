import { Router } from 'express';
import AuthController from '@controllers/auth.controller';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@middlewares/auth.middleware';
import WebSocketManager from '@/socket/index.socket';
import validationMiddleware from '@/middlewares/validation.middleware';
import { CreateUserDto } from '@dtos/users.dto';

class AuthRoute implements Routes {
  public path = '/';
  public router = Router();
  public authController;

  constructor(wsSocket: WebSocketManager) {
    this.authController = new AuthController(wsSocket);
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}signup`, validationMiddleware(CreateUserDto, 'body'), this.authController.signUp);
    this.router.post(`${this.path}login`, this.authController.logIn);
    this.router.post(`${this.path}logout`, authMiddleware, this.authController.logOut);
  }
}

export default AuthRoute;
