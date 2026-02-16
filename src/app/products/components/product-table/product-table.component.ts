import { Component, computed, DestroyRef, inject, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '@/products/interfaces/products-response.interface';
import { ProductImagePipe } from "../../pipes/product-image.pipe";
import { CurrencyPipe } from '@angular/common';
import { ProductsService } from '@/products/services/products.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'product-table',
  imports: [ProductImagePipe, RouterLink, CurrencyPipe],
  templateUrl: './product-table.component.html',
})
export class ProductTableComponent {
  public readonly products = input.required<Product[]>();

  private readonly productsService = inject(ProductsService);
  private readonly destroyRef = inject(DestroyRef);

  // Emite el id del producto borrado
  public readonly deleted = output<string>();

  // Estado de ordenación
  public readonly sortField = signal<'title' | 'price' | 'stock'>('title');
  public readonly sortDirection = signal<'asc' | 'desc'>('asc');

  // Lista ordenada en función del estado anterior
  public readonly sortedProducts = computed(() => {
    const items = this.products() ?? [];
    const field = this.sortField();
    const direction = this.sortDirection();

    return [...items].sort((a, b) => {
      let aVal: string | number = '';
      let bVal: string | number = '';

      switch (field) {
        case 'price':
          aVal = a.price;
          bVal = b.price;
          break;
        case 'stock':
          aVal = a.stock;
          bVal = b.stock;
          break;
        case 'title':
        default:
          aVal = a.title.toLowerCase();
          bVal = b.title.toLowerCase();
          break;
      }

      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  });

  public toggleSort(field: 'title' | 'price' | 'stock') {
    if (this.sortField() === field) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortField.set(field);
      this.sortDirection.set('asc');
    }
  }

  public onDelete(product: Product) {
    const confirmed = window.confirm(`Are you sure you want to delete "${product.title}"?`);
    if (!confirmed) return;

    this.productsService.deleteProductById(product.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.deleted.emit(product.id);
        },
        error: (error) => {
          console.error('Error deleting product:', error);
        }
      });
  }
}
