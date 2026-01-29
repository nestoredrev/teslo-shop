import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { ProductTableComponent } from "@/products/components/product-table/product-table.component";
import { ProductsService } from '@/products/services/products.service';
import { PaginationService } from '@/shared/components/pagination/pagination.service';
import { PaginationComponent } from "@/shared/components/pagination/pagination";
import { Loader } from "@/store-front/components/loader/loader";

@Component({
  selector: 'app-products-admin-page',
  imports: [ProductTableComponent, PaginationComponent, Loader, RouterLink],
  templateUrl: './products-admin-page.html',
})
export class ProductsAdminPage {
  private productsService = inject(ProductsService);
  private router = inject(Router);
  public paginationService = inject(PaginationService);
  public readonly productPerPage = signal<number>(10);

  setPerPage(value: number) {
    this.productPerPage.set(value);
    this.router.navigate([], { queryParams: { page: 1 }, queryParamsHandling: 'merge' });
  }

  public productsResource = rxResource({
    params: () => ({ 
      limit: this.productPerPage(), 
      offset: (this.paginationService.currentPage() - 1) * this.productPerPage(), 
      gender:'' 
    }),
    stream: (res) => this.productsService.getProducts({ ...res.params }),
    defaultValue: { count: 0, pages: 0, products: [] }
  })


}
