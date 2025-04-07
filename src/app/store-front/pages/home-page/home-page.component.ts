import { Component, inject } from '@angular/core';
import { ProductsService } from '@products/services/products.service';
import { ProductCardComponent } from '@store-front/components/product-card/product-card.component';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { map } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { PaginationService } from '@shared/components/pagination/pagination.service';

@Component({
  selector: 'app-home-page',
  imports: [ProductCardComponent, PaginationComponent],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {
  productsService = inject(ProductsService);
  paginationService = inject(PaginationService);

  productsResource = rxResource({
    request: () => ({ page: this.paginationService.currentPage() - 1 }),
    loader: ({ request }) => {
      return this.productsService.getProducts({
        limit: 9,
        gender: 'men',
        offset: request.page * 9,
      });
    },
  });
 }

