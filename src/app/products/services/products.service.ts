import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, of, tap, catchError, throwError, OperatorFunction, forkJoin, map, switchMap } from 'rxjs';
import { Gender, Product, ProductsResponse } from '../interfaces/products-response.interface';
import { User } from '@/auth/interfaces/user.interface';

const baseUrl = environment.baseUrl;

interface Options {
  limit?: number;
  offset?: number;  
  gender?: string;
}


const emptyProduct:Product = {
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
  user: {} as User
}


@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private http = inject(HttpClient);
  private productsCache = new Map<string, ProductsResponse>();
  private productCache = new Map<string, Product>();

  getProducts(options: Options): Observable<ProductsResponse> {

    const { limit = 9, offset = 0, gender = '' } = options;
    const key = `${limit}-${offset}-${gender}`;
    
    if(this.productsCache.has(key)){
      return of(this.productsCache.get(key)!);
    }

    return this.http.get<ProductsResponse>(`${baseUrl}/products`,{
      params: {
        limit: limit,
        offset: offset,
        gender: gender
      }
    }).pipe(
      tap(resp => console.log(resp)),
      tap( resp => this.productsCache.set(key, resp) ),
      this.handleError()
    );
  }

  getProductBySlugId(slugId: string): Observable<Product> {

    const key = slugId ?? '';
    if(this.productCache.has(key)){
      return of(this.productCache.get(key)!);
    }

    return this.http.get<Product>(`${baseUrl}/products/${slugId}`)
    .pipe(
      tap( product => console.log(product) ),
      tap( product => this.productCache.set(key, product) ),
      this.handleError()
    );
  }


  getProductById(id: string): Observable<Product> {

    if(id === 'new'){
      return of( emptyProduct );
    }

    const key = id ?? '';
    if(this.productCache.has(key)){
      return of(this.productCache.get(key)!);
    }

    return this.http.get<Product>(`${baseUrl}/products/${id}`)
    .pipe(
      tap( product => console.log(product) ),
      tap( product => this.productCache.set(key, product) ),
      this.handleError()
    );
  }

  createProduct(productLike: Partial<Product>, imageFileList?: FileList): Observable<Product> {
    return this.http.post<Product>(`${baseUrl}/products`, productLike)
    .pipe(
      switchMap(createdProduct => this.uploadImages(imageFileList)
      .pipe(
        map(imageNames => ({
          ...createdProduct,
          images: [...(createdProduct.images ?? []), ...imageNames]
        }))
      )),
      tap (product => this.updateProductCache(product) ),
      this.handleError()
    )
  }

  updateProduct(id: string, productLike: Partial<Product>, imageFileList?: FileList): Observable<Product> {
    
    const currentImages = productLike.images ?? [];
    return this.uploadImages(imageFileList)
    .pipe(
      map(imageNames => ({
        ...productLike,
        images: [...currentImages, ...imageNames]
      })),
      switchMap(updatedProduct => this.http.patch<Product>(`${baseUrl}/products/${id}`, updatedProduct)),
      tap (product => this.updateProductCache(product) ),
      this.handleError()
    );
    
    // return this.http.patch<Product>(`${baseUrl}/products/${id}`, productLike)
    // .pipe(
    //   tap (product => this.updateProductCache(product) ),
    //   this.handleError()
    // )
  }

  updateProductCache(product: Product) {
    const productId = product.id;

    this.productCache.set(productId, product);

    this.productsCache.forEach(productResponse => {
      productResponse.products = productResponse.products.map(
        currentProduct => {
          return currentProduct.id === productId ? product : currentProduct;
        }
      )
    })
  }


  private uploadImages( images?: FileList ): Observable<string[]> {
    
    if(!images){
      return of([]);
    }

    const uploadObservables: Observable<string>[] = Array.from(images)
    .map( image => {
      return this.uploadImage(image);
    })

    // Wait for all uploads to complete and gather the URLs into an array
    return forkJoin(uploadObservables); 
  }

  private uploadImage(imageFile: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', imageFile);

    return this.http.post<{ fileName: string }>(`${baseUrl}/files/product`, formData)
    .pipe(
      map(resp => resp.fileName),
      catchError(error => {
        console.error('Error uploading image:', error);
        throw error;
      })
    );
  }


  private handleError<T>(): OperatorFunction<T, T> {
    return catchError<T, Observable<never>>( () => throwError( new Error('Something is wrong, try again or later') ) );
  }

}
