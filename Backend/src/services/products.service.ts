import { EntityRepository, Repository } from 'typeorm';
import { CreateProductDto } from '@dtos/products.dto';
import { ProductEntity } from '@entities/product.entity';
import { HttpException } from '@exceptions/HttpException';
import { Product } from '@interfaces/products.interface';
import { isEmpty } from '@utils/util';
import WebSocketManager, { NOTIFY_INFO } from '@/socket/index.socket';
import { User } from '@/interfaces/users.interface';

@EntityRepository()
class ProductService extends Repository<ProductEntity> {
  private wsSocket: WebSocketManager;

  constructor(wsSocket: WebSocketManager) {
    super();
    this.wsSocket = wsSocket;
  }

  public async findWithQuery(query: string): Promise<Product[]> {
    const products: Product[] = await ProductEntity.query(query);
    return products;
  }

  public async findAllProduct(): Promise<Product[]> {
    const products: Product[] = await ProductEntity.find();
    return products;
  }

  public async findProductById(productId: number): Promise<Product> {
    if (isEmpty(productId)) throw new HttpException(400, 'ProductId is empty');

    const findProduct: Product = await ProductEntity.findOne({ where: { id: productId } });
    if (!findProduct) throw new HttpException(409, "Product doesn't exist");
    return findProduct;
  }

  public async createProduct(productData: CreateProductDto, user: User): Promise<Product> {
    if (isEmpty(productData)) throw new HttpException(400, 'productData is empty');
    const createProductData: Product = await ProductEntity.create({ ...productData }).save();

    const info: NOTIFY_INFO = {
      user: user,
      name: 'create',
      data: createProductData,
      entity: ProductEntity.name
    };

    this.wsSocket.notify(info);
    return createProductData;
  }

  public async updateProduct(productId: number, productData: CreateProductDto, user: User): Promise<Product> {
    if (isEmpty(productData)) throw new HttpException(400, 'productData is empty');

    const findProduct: Product = await ProductEntity.findOne({ where: { id: productId } });
    if (!findProduct) throw new HttpException(409, "Product doesn't exist");

    await ProductEntity.update(productId, { ...productData });

    const info: NOTIFY_INFO = {
      user: user,
      name: findProduct.userId === productData.userId ? 'update' : 'refresh',
      data: { id: productId, ...productData },
      entity: ProductEntity.name
    };

    this.wsSocket.notify(info);

    const updateProduct: Product = await ProductEntity.findOne({ where: { id: productId } });
    return updateProduct;
  }

  public async deleteProduct(productId: number, user: User): Promise<Product> {
    if (isEmpty(productId)) throw new HttpException(400, 'ProductId is empty');

    const findProduct: Product = await ProductEntity.findOne({ where: { id: productId } });
    if (!findProduct) throw new HttpException(409, "Product doesn't exist");

    await ProductEntity.delete({ id: productId });

    const info: NOTIFY_INFO = {
      user: user,
      name: 'delete',
      data: { id: productId },
      entity: ProductEntity.name
    };

    this.wsSocket.notify(info);
    return findProduct;
  }
}

export default ProductService;
