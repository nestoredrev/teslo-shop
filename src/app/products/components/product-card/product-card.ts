import { AfterViewInit, Component, ElementRef, inject, input, OnChanges, SimpleChanges, viewChild } from '@angular/core';
import { SlicePipe } from '@angular/common';
import { Router, RouterLink } from "@angular/router";
import { Product } from '@/products/interfaces/products-response.interface';
import { ProductImagePipe } from '@/products/pipes/product-image.pipe';
import Swiper from 'swiper';
import { EffectCards, Pagination } from 'swiper/modules';
// import 'swiper/css';
// import 'swiper/css/pagination';

@Component({
  selector: 'product-card',
  imports: [RouterLink, SlicePipe, ProductImagePipe],
  templateUrl: './product-card.html',
})
export class ProductCard implements AfterViewInit, OnChanges {

  public product = input.required<Product>();
  private router = inject(Router);
  swiperFlipDiv = viewChild.required<ElementRef>('swiperFlipDiv');
  swiper: Swiper | undefined = undefined;


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['images'].firstChange) return;
    if (!this.swiper) return;
    this.swiper.destroy(true, true);

    // Clear the pagination bullets
    const paginationEl: HTMLDivElement = this.swiperFlipDiv().nativeElement.querySelector('.swiper-pagination');
    paginationEl.innerHTML = '';

    setTimeout(() => {
      this.swiperInit();
    }, 100);
  }

  ngAfterViewInit(): void {
    this.swiperInit();
  }

  swiperInit() {
    this.swiper = new Swiper(this.swiperFlipDiv().nativeElement, {
      modules: [EffectCards, Pagination],
      effect: 'cards',
      loop: true,
      initialSlide: 0,
      init:true,
      cardsEffect: {
        perSlideRotate: 8,
        rotate: true,
        slideShadows: true,
      },
      pagination: { 
        el: '.swiper-pagination', 
        clickable: true 
      },  
    });
  }

  productDetail(slugId: string) {
    this.router.navigate(['/product', slugId]);
  }
}
