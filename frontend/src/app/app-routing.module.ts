import { StoreComponent } from './pages/store/store.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountingComponent } from './pages/accounting/accounting.component';
import { HomeComponent } from './pages/home/home.component';
import { NewBillComponent } from './pages/new-bill/new-bill.component';
import { NewOperationComponent } from './pages/new-operation/new-operation.component';
import { OrdersManagementComponent } from './pages/orders-management/orders-management.component';
import { MaterialsComponent } from './pages/materials/materials.component';

// TODO some routes need children
const routes: Routes = [
  {
    path: '.',
    component: HomeComponent,
  },
  {
    path: 'new-bill',
    component: NewBillComponent,
  },
  {
    path: 'new-operation',
    component: NewOperationComponent,
  },
  {
    path: 'orders-management',
    component: OrdersManagementComponent,
  },
  {
    path: 'accounting',
    component: AccountingComponent,
  },
  {
    path: 'store',
    component: StoreComponent,
  },
  {
    path: 'materials',
    component: MaterialsComponent,
  },
  {
    path: '**',
    redirectTo: '.',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
