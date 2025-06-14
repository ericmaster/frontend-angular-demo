import { Routes } from '@angular/router';
import { FinancialProductsComponent } from './financial-products/financial-products.component';
import { FinancialProductFormComponent } from './financial-products/financial-product-form.component';

export const routes: Routes = [
  { path: '', component: FinancialProductsComponent },
  { path: 'agregar', component: FinancialProductFormComponent },
  { path: 'editar/:id', component: FinancialProductFormComponent }
];
