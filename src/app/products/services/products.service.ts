import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '@auth/interfaces/auth-response.interface';
import {
  Gender,
  Product,
  ProductsResponse,
} from '@store-front/components/interfaces/product.interface';
import { forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

interface Options {
  limit?: number;
  offset?: number;
  gender?: string;
}

const emptyProduct: Product = {
  id: 'new',
  title: '',
  price: 0,
  description: '',
  slug: '',
  stock: 0,
  sizes: [],
  gender: Gender.Men,
  tags: [],
  images: [],
  user: {} as User,
};

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private http = inject(HttpClient);

  private productsCache = new Map<string, ProductsResponse>();
  private productCache = new Map<string, Product>();

  getProducts(options: Options): Observable<ProductsResponse> {
    const { limit = 9, offset = 0, gender = '' } = options;

    // console.log(this.productsCache.entries());

    const key = `${limit}-${offset}-${gender}`;

    if (this.productsCache.has(key)) {
      return of(this.productsCache.get(key)!);
    }

    return this.http
      .get<ProductsResponse>(`${baseUrl}/products`, {
        params: {
          limit,
          offset,
          gender,
        },
      })
      .pipe(tap((resp) => this.productsCache.set(key, resp)));
  }

  getProductByIdSlug(id: string): Observable<Product> {
    // console.log(this.productCache.entries());

    const key = `${id}`;

    if (this.productsCache.has(key)) {
      return of(this.productCache.get(key)!);
    }

    return this.http
      .get<Product>(`${baseUrl}/products/${id}`)
      .pipe(tap((resp) => this.productCache.set(key, resp)));
  }

  getProductById(id: string): Observable<Product> {
    if (id === 'new') {
      return of(emptyProduct);
    }

    if (this.productsCache.has(id)) {
      return of(this.productCache.get(id)!);
    }

    return this.http
      .get<Product>(`${baseUrl}/products/${id}`)
      .pipe(tap((resp) => this.productCache.set(id, resp)));
  }

  updateProduct(
    id: string,
    productLike: Partial<Product>,
    imageFileList?: FileList
  ): Observable<Product> {

    const currentImages = productLike.images ?? [];

    return this.uploadImages(imageFileList)
      .pipe(
        map((imageNames) => ({
          ...productLike,
          images: [...currentImages, ...imageNames]
        })),
        switchMap((updatedProduct) => {
          return this.http
            .patch<Product>(`${baseUrl}/products/${id}`, updatedProduct)
        }),
        tap((product) => this.updateProductCache(product))
      );
  }

  updateProductCache(product: Product) {
    const productId = product.id;

    this.productCache.set(productId, product);

    this.productsCache.forEach((productResponse) => {
      productResponse.products = productResponse.products.map(
        (currentProduct) => {
          return currentProduct.id === productId ? product : currentProduct;
        }
      );
    });
  }

  createProduct(product: Partial<Product>, imageFileList?: FileList): Observable<Product> {
    const currentImages = product.images ?? [];

    return this.uploadImages(imageFileList)
      .pipe(
        map((imageNames) => ({
          ...product,
          images: [...currentImages, ...imageNames]
        })),
        switchMap((updatedProduct) => {
          return this.http
            .post<Product>(`${baseUrl}/products`, updatedProduct)
        }),
        tap((product) => this.updateProductCache(product))
      );
  }

  uploadImages(images?: FileList): Observable<string[]> {
    if (!images) return of([]);

    const uploadObservables = Array.from(images).map((imageFile) => {
      return this.uploadImage(imageFile);
    });

    return forkJoin(uploadObservables).pipe(
      tap((imageNames) => console.log(imageNames))
    );
  }

  uploadImage(image?: File): Observable<string> {
    if (!image) return of();

    const formData = new FormData();

    formData.append('file', image);

    return this.http
      .post<{ fileName: string }>(`${baseUrl}/files/product`, formData)
      .pipe(map((resp) => resp.fileName));
  }
}
