import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

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
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
