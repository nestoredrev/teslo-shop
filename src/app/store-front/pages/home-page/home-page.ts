import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';

import { ProductCard } from '@/store-front/components/product-card/product-card';
import { Loader } from "@/store-front/components/loader/loader";

import { ProductsService } from '@/products/services/products.service';

import { PaginationComponent } from "@/shared/components/pagination/pagination";
import { PaginationService } from '@/shared/components/pagination/pagination.service';

@Component({
  selector: 'app-home-page',
  imports: [ProductCard, Loader, PaginationComponent],
  templateUrl: './home-page.html',
})
export class HomePage {

  private productsService = inject(ProductsService);
  public paginationService = inject(PaginationService);
  // private activatedRoute = inject(ActivatedRoute);

  // currentPage = toSignal(
  //   this.activatedRoute.queryParamMap.pipe(
  //     map( (params) => (params.get('page') ? +params.get('page')! : 1) ),
  //     map( (page) => isNaN(page) || page < 1 ? 1 : page )
  //   ),
  //   { initialValue: 1 }
  // )



  public productsResource = rxResource({
    params: () => ({ limit: 9, offset: (this.paginationService.currentPage() - 1) * 9, gender:'' }),
    stream: (res) => this.productsService.getProducts({ ...res.params }),
    defaultValue: { count: 0, pages: 0, products: [] }
  })

}
