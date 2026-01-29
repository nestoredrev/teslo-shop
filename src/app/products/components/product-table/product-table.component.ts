import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '@/products/interfaces/products-response.interface';
import { ProductImagePipe } from "../../pipes/product-image.pipe";
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'product-table',
  imports: [ProductImagePipe, RouterLink, CurrencyPipe],
  templateUrl: './product-table.component.html',
})
export class ProductTableComponent {
  public readonly products = input.required<Product[]>();
}
