import { Component, inject, signal } from '@angular/core';
import { ProductTableComponent } from "../../../products/components/product-table/product-table.component";
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { ProductsService } from '@products/services/products.service';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-products-admin-page',
  imports: [ProductTableComponent, PaginationComponent, RouterLink],
  templateUrl: './products-admin-page.component.html',
})
export class ProductsAdminPageComponent {
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  productsService = inject(ProductsService);
  paginationService = inject(PaginationService);

  productsPerPage = signal<number>(10);

  productsResource = rxResource({
    request: () => ({
      page: this.paginationService.currentPage() - 1,
      limit: this.productsPerPage()
    }),
    loader: ({ request }) => {
      return this.productsService.getProducts({
        limit: this.productsPerPage(),
        offset: request.page * request.limit,
      });
    },
  });

  changePage(newPage: number) {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { page: newPage },
      queryParamsHandling: 'merge' // mantiene los demás parámetros
    });
  }
}
