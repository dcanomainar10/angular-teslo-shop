import { CurrencyPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductImagePipe } from '@products/pipes/product-image.pipe';
import { Product } from '@store-front/components/interfaces/product.interface';

@Component({
  selector: 'app-product-table',
  imports: [ProductImagePipe, CurrencyPipe, RouterLink],
  templateUrl: './product-table.component.html',
})
export class ProductTableComponent {
  products = input.required<Product[]>();
}
