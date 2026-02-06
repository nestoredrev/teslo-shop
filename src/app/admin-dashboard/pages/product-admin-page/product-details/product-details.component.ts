import { Component, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Product } from '@/products/interfaces/products-response.interface';
import { ProductCarouselComponent } from "@/products/components/product-carousel/product-carousel";
import { FormErrorLabelComponent } from "@/shared/components/form-error-label/form-error-label.component";
import { FormUtils } from '@/utils/form-utils';
import { ProductsService } from '@/products/services/products.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'product-details',
  imports: [ProductCarouselComponent, ReactiveFormsModule, FormErrorLabelComponent],
  templateUrl: './product-details.component.html',
})
export class ProductDetailsComponent implements OnInit {

  public readonly product = input.required<Product>();
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  private productsService = inject(ProductsService);
  public readonly wasUpdated = signal<boolean>(false);
  public readonly tempImages = signal<string[]>([]);
  public imageFileList = signal<FileList | undefined>(undefined);
  formUtils = FormUtils;

  public productForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    slug: ['', [Validators.required, Validators.pattern(this.formUtils.slugPattern)]],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    sizes: [[''], Validators.required],
    images: [['']],
    tags: ['', Validators.required],
    gender: ['men', [Validators.required, Validators.pattern(/men|women|kid|unisex/)]],
  })

  public sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];


  ngOnInit(): void {
    
    this.setFormValues( this.product() );
  }

  setFormValues( formLike: Partial<Product> ) {
    this.productForm.reset( this.product() as any );
    this.productForm.patchValue({ tags: formLike.tags?.join(',') });
    // this.productForm.patchValue( formLike as any );
  }

  onSizeClicked(size: string) {
    const currentSizes = this.productForm.value.sizes ?? [];
    const newSizes = currentSizes.includes(size)
      ? currentSizes.filter(s => s !== size)
      : [...currentSizes, size];
    this.productForm.patchValue({ sizes: newSizes });
  }

  onSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }
    
    const formValue = this.productForm.value;
    const productLike: Partial<Product> = {
      ...(formValue as any),
      tags: formValue.tags?.split(',').map(tag => tag.trim().toLowerCase() ?? []),
    };
    
    if(this.product().id === 'new'){

      this.productsService.createProduct(productLike, this.imageFileList() ?? undefined)
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (createdProduct) => {
          this.router.navigate(['/admin/products', createdProduct.id]);
          console.log('Product created successfully:', createdProduct);
        },
        error: (error) => {
          console.error('Error creating product:', error);
        }
      });

    }else{
      this.productsService.updateProduct(this.product().id, productLike, this.imageFileList() ?? undefined)
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (updatedProduct) => {
          console.log('Product updated successfully:', updatedProduct);
          this.wasUpdated.set(true);
          setTimeout(() => this.wasUpdated.set(false), 3000);
        },
        error: (error) => {
          this.wasUpdated.set(false);
          console.error('Error updating product:', error);
        }
      });
    }
  }

  onFilesSelected(event: Event) {
    const fileList = (event.target as HTMLInputElement).files;
    if (!fileList || fileList.length === 0) {
      return;
    }

    const files = Array.from(fileList);
    this.imageFileList.set(fileList);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    this.tempImages.set(imageUrls);
  }

  removeTempImage(index: number) {
    const currentImages = this.tempImages();
    const currentFiles = this.imageFileList();
    
    // Revoke the URL for the removed image
    URL.revokeObjectURL(currentImages[index]);
    
    // Remove image preview
    this.tempImages.set(currentImages.filter((_, i) => i !== index));
    
    // Remove corresponding file from FileList by recreating it via DataTransfer
    if (currentFiles) {
      const filesArray = Array.from(currentFiles).filter((_, i) => i !== index);
      const dt = new DataTransfer();
      filesArray.forEach(file => dt.items.add(file));
      this.imageFileList.set(dt.files);
    } else {
      this.imageFileList.set(undefined);
    }
  }   
}
