import { Pipe, type PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

@Pipe({
  name: 'productImage',
})
export class ProductImagePipe implements PipeTransform {

  transform(imageName: string | string[]): string {

    
    if (!imageName) {
      return './assets/images/no-image.jpg';
    }

    if( Array.isArray(imageName) && imageName.length > 1 ) {
      imageName = imageName[0];
    }


    return `${baseUrl}/files/product/${imageName}`;
  }

}
