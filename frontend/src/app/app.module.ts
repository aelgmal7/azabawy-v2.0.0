import { AddOrderComponent } from './pages/orders-management/add-order/add-order.component';
import { OrdersService } from './shared/services/orders.service';
import { StoreService } from './shared/services/store.service';
import { EditMaterialsComponent } from './pages/materials/edit-materials/edit-materials.component';
import { AddMaterialsComponent } from './pages/materials/add-materials/add-materials.component';
import { MaterialsComponent } from './pages/materials/materials.component';
import { EditProductComponent } from './pages/store/edit-product/edit-product.component';
import { AddProductComponent } from './pages/store/add-product/add-product.component';
import { MaterialModule } from './shared/material.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BtnComponent } from './shared/components/btn/btn.component';
import { InputComponent } from './shared/components/input/input.component';
import { TextAreaComponent } from './shared/components/text-area/text-area.component';
import { AccountingComponent } from './pages/accounting/accounting.component';
import { HomeComponent } from './pages/home/home.component';
import { NewBillComponent } from './pages/new-bill/new-bill.component';
import { NewOperationComponent } from './pages/new-operation/new-operation.component';
import { StoreComponent } from './pages/store/store.component';
import { OrdersManagementComponent } from './pages/orders-management/orders-management.component';
import { VerticalNavbarComponent } from './shared/components/vertical-navbar/vertical-navbar.component';
import { IconBtnComponent } from './shared/components/icon-btn/icon-btn.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
  declarations: [
    AppComponent,
    BtnComponent,
    InputComponent,
    TextAreaComponent,
    AccountingComponent,
    HomeComponent,
    NewBillComponent,
    NewOperationComponent,
    StoreComponent,
    OrdersManagementComponent,
    VerticalNavbarComponent,
    IconBtnComponent,
    AddProductComponent,
    EditProductComponent,
    MaterialsComponent,
    AddMaterialsComponent,
    EditMaterialsComponent,
    AddOrderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    SweetAlert2Module,
    [SweetAlert2Module.forRoot()],
    DropdownModule,
  ],
  providers: [StoreService, OrdersService],

  bootstrap: [AppComponent],
})
export class AppModule {}
