import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product, ProductsResponse } from '../interfaces/products-response.interface';
import { Observable, of, tap, catchError, throwError, OperatorFunction } from 'rxjs';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

interface Options {
  limit?: number;
  offset?: number;  
  gender?: string;
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

  private handleError<T>(): OperatorFunction<T, T> {
    return catchError<T, Observable<never>>( () => throwError( new Error('Something is wrong, try again or later') ) );
  }

}
