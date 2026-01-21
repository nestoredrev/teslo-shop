import { AfterViewInit, Component, ElementRef, input, viewChild } from '@angular/core';
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
export class ProductCarouselComponent implements AfterViewInit {


  images = input.required<string[]>();
  swiperDiv = viewChild.required<ElementRef>('swiperDiv');

  ngAfterViewInit(): void {
    const swiper = new Swiper(this.swiperDiv().nativeElement, {
      modules: [Navigation, Pagination, Scrollbar],
      speed: 500,
      loop: true,
      direction: 'horizontal',
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      pagination:{ el: '.swiper-pagination', clickable: true },
      scrollbar: { el: '.swiper-scrollbar', draggable: true },

    });
  }



}
