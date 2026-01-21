import { Component, inject } from '@angular/core';
import { ProductsService } from '@/products/services/products.service';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, map, startWith } from 'rxjs';
import { ProductCarouselComponent } from "@/products/components/product-carousel/product-carousel";
import { Loader } from "@/store-front/components/loader/loader";

@Component({
  selector: 'app-product-page',
  imports: [ProductCarouselComponent, Loader],
  templateUrl: './product-page.html',
})
export class ProductPage {

  private productsService = inject(ProductsService);

  public productSlugId = toSignal<string | null | undefined>(
    inject(ActivatedRoute).paramMap.pipe(
      map(params => params.get('id')),
      startWith(null)
    ),
    { initialValue: null }
  )

  public productDetailResource = rxResource({
    params: () => ({ id: this.productSlugId() }),
    stream: ({ params }) => {
      if (!params.id) {
        return EMPTY;
      }
      return this.productsService.getProductBySlugId(params.id);
    }
  });


}
