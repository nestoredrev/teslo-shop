import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { TitleCasePipe } from '@angular/common';
import { map, startWith } from 'rxjs';

import { ProductsService } from '@/products/services/products.service';

import { ProductCard } from "@/store-front/components/product-card/product-card";
import { Loader } from "@/store-front/components/loader/loader";

import { PaginationComponent } from "@/shared/components/pagination/pagination";
import { PaginationService } from '@/shared/components/pagination/pagination.service';

@Component({
  selector: 'app-gender-page',
  imports: [ProductCard, TitleCasePipe, Loader, PaginationComponent],
  templateUrl: './gender-page.html',
})
export class GenderPage {

    public genderType = toSignal<string | null | undefined>(
    inject(ActivatedRoute).paramMap.pipe(
      map(params => params.get('gender')),
      startWith(null)
    ),
    { initialValue: null }
  )

  private productsService = inject(ProductsService);
  public paginationService = inject(PaginationService);
  public productsResource = rxResource({
    params: () => ({ limit: 9, offset: (this.paginationService.currentPage() - 1) * 9, gender: this.genderType() || '' }),
    stream: (res) => this.productsService.getProducts({ ...res.params }),
    defaultValue: { count: 0, pages: 0, products: [] }
  })

}
