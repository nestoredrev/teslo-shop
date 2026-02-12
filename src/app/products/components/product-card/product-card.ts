import { Component, inject, input } from '@angular/core';
import { SlicePipe } from '@angular/common';
import { Router, RouterLink } from "@angular/router";
import { Product } from '@/products/interfaces/products-response.interface';
import { ProductImagePipe } from '@/products/pipes/product-image.pipe';

@Component({
  selector: 'product-card',
  imports: [RouterLink, SlicePipe, ProductImagePipe],
  templateUrl: './product-card.html',
})
export class ProductCard  {

  public product = input.required<Product>();
  private router = inject(Router);

  productDetail(slugId: string) {
    this.router.navigate(['/product', slugId]);
  }
}
