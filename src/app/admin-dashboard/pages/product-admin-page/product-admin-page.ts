import { Component, effect, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '@/products/services/products.service';
import { Loader } from "@/store-front/components/loader/loader";
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { map, startWith } from 'rxjs';
import { JsonPipe } from '@angular/common';
import { ProductDetailsComponent } from "./product-details/product-details.component";

@Component({
  selector: 'app-product-admin-page',
  imports: [Loader, ProductDetailsComponent],
  templateUrl: './product-admin-page.html',
})
export class ProductAdminPage {
  public activatedRoute = inject(ActivatedRoute);
  public router = inject(Router);
  private productsService = inject(ProductsService);

  public productId = toSignal<string | null | undefined>(
    inject(ActivatedRoute).paramMap.pipe(
      map(params => params.get('id')),
      startWith(null)
    ),
    { initialValue: null }
  )

  public productResource = rxResource({
    params: () => ({ 
      id: this.productId(),
    }),
    stream: (res) => this.productsService.getProductById(res.params.id!),
  });


  redirectEffect = effect(() => {
    if (this.productResource.error()) {
      this.router.navigate(['/admin/products']);
    }
  });

}
