import { writable } from 'svelte/store';
import type { NOTIFY_INFO, Product, ProductDto, User } from '../models';
import { post, del, put } from '../../lib/shared';
import { varEnv } from '../../lib/env';

export class ProductService {
  private authUser: User;
  public products: Product[] = [];

  public init(authUser: User) {
    this.products = [];
    this.authUser = authUser;
  }

  public onNotify(info: NOTIFY_INFO) {
    if (info.name === 'update') {
      const product = info.data as Product;
      const idx = this.products.findIndex((item) => item.id === product.id);
      if (idx !== -1) {
        this.products[idx] = product;
      }
    } else if (info.name === 'create') {
      const product = info.data as Product;

      let check = true;
      // if (this.authUser.role !== 'Admin') {
      //   if (this.authUser.id !== product.userId) {
      //     check = false;
      //   }
      // }

      if (check) {
        const idx = this.products.findIndex((item) => item.id === product.id);
        if (idx === -1) {
          this.products.push(product);
        }
      }
      
    } else if (info.name === 'delete') {
      const product = info.data as Product;
      this.products = this.products.filter((item) => item.id !== product.id);
    }
  }

  public async deleteProduct(productId: number) {
    const response = await del(varEnv.api_url, `/products/${productId}`);

    if (response && response.data) {
      //console.log("response : ", response);
    }
    return response;
  }

  public async updateProduct(productId: number, body: ProductDto) {
    const response = await put(varEnv.api_url, `/products/${productId}`, body);
    if (response) {
      //console.log('put response : ', response);
    }
    return response;
  }

  public async createProduct(body: ProductDto) {
    const response = await post(varEnv.api_url, '/products', body);
    if (response) {
      //console.log('post response : ', response);
    }

    return response;
  }
}

function createProductService() {
  const service: ProductService = new ProductService();

  const { subscribe, update, set } = writable(service);

  return {
    subscribe,
    update,
    set
  };
}

export const productService = createProductService();
