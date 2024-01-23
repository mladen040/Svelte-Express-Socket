import { NextFunction, Response } from 'express';
import ProductService from '@services/products.service';
import { CreateProductDto } from '@/dtos/products.dto';
import WebSocketManager from '@/socket/index.socket';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { Product } from '@/interfaces/products.interface';

class ProductsController {
  public productService;

  constructor(wsSocket: WebSocketManager) {
    this.productService = new ProductService(wsSocket);
  }

  public getProducts = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findAllProductsData: Product[] = await this.productService.findAllProduct();

      res.status(200).json({ data: findAllProductsData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const productId = Number(req.params.id);
      const findOneProductData: Product = await this.productService.findProductById(productId);

      res.status(200).json({ data: findOneProductData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createProduct = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const productData: CreateProductDto = req.body;
      const createProductData: Product = await this.productService.createProduct(productData, req.user);
      res.status(201).json({ data: createProductData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateProduct = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const productId = Number(req.params.id);
      const productData: CreateProductDto = req.body;
      const updateProductData: Product = await this.productService.updateProduct(productId, productData, req.user);
      res.status(200).json({ data: updateProductData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteProduct = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const productId = Number(req.params.id);
      const deleteProductData: Product = await this.productService.deleteProduct(productId, req.user);
      res.status(200).json({ data: deleteProductData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default ProductsController;
