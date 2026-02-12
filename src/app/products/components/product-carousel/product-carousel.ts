import { AfterViewInit, Component, ElementRef, input, OnChanges, SimpleChanges, viewChild } from '@angular/core';
import { ProductImagePipe } from '@/products/pipes/product-image.pipe';
import Swiper from 'swiper';
import { Navigation, Pagination, Scrollbar } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

@Component({
  selector: 'product-carousel',
  imports: [ProductImagePipe],
  templateUrl: './product-carousel.html',
  styles: `
    .swiper{
      width: 100%;
      height: 500px;
    }
  `
})
export class ProductCarouselComponent implements AfterViewInit, OnChanges {

  images = input.required<string[]>();
  swiperDiv = viewChild.required<ElementRef>('swiperDiv');
  swiper:Swiper|undefined = undefined;

  // ngOnChanges is needed to reinitialize the swiper when the images input changes
  ngOnChanges(changes: SimpleChanges): void {

    if( changes['images'].firstChange ) return;
    if( !this.swiper )return;
    this.swiper.destroy(true, true);

    // Clear the pagination bullets
    const paginationEl: HTMLDivElement  = this.swiperDiv().nativeElement.querySelector('.swiper-pagination');
    paginationEl.innerHTML = '';

    setTimeout(() => {
      this.swiperInit();
    }, 100);

  }

  ngAfterViewInit(): void {
    this.swiperInit();
  }

  swiperInit() {
    this.swiper = new Swiper(this.swiperDiv().nativeElement, {
      modules: [Navigation, Pagination, Scrollbar],
      speed: 500,
      loop: true,
      direction: 'horizontal',
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      pagination: { el: '.swiper-pagination', clickable: true },
      scrollbar: { el: '.swiper-scrollbar', draggable: true },
    });
  }



}
