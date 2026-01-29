import { AfterViewInit, Component, ElementRef, inject, input, viewChild } from '@angular/core';
import { SlicePipe } from '@angular/common';
import { Router, RouterLink } from "@angular/router";
import { Product } from '@/products/interfaces/products-response.interface';
import { ProductImagePipe } from '@/products/pipes/product-image.pipe';
import Swiper from 'swiper';
import { EffectFlip, Navigation, Pagination, Scrollbar } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

@Component({
  selector: 'product-card',
  imports: [RouterLink, SlicePipe, ProductImagePipe],
  templateUrl: './product-card.html',
})
export class ProductCard implements AfterViewInit {


  public product = input.required<Product>();
  private router = inject(Router);
  swiperFlipDiv = viewChild.required<ElementRef>('swiperFlipDiv');

  ngAfterViewInit(): void {
    const swiper = new Swiper(this.swiperFlipDiv().nativeElement, {
      modules: [EffectFlip,Navigation, Pagination, Scrollbar],
      effect: 'flip',
      loop: true,
      pagination: {
        el: ".swiper-pagination",
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });
  }

  productDetail(slugId: string) {
    this.router.navigate(['/product', slugId]);
  }
}
