import { SlicePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../interfaces/product.interface';
import { ProductImagePipe } from "../../../products/pipes/product-image.pipe";

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, SlicePipe, ProductImagePipe],
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent {
  product = input.required<Product>();

  // productImage = rxResource({
  //   request: () => ({}),
  //   loader: ({ request }) => {
  //     return this.productsService.getImage(this.images()[0]);
  //   },
  // });
}
