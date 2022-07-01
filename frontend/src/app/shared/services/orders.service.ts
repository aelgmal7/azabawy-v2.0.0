import { IOrders } from './../../pages/orders-management/orders-management.component';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class OrdersService {
  private dataStore: {
    products: IOrders[];
  };
  private getURL = 'http://localhost:3000/order/';
  constructor(private http: HttpClient) {
    this.dataStore = { products: [] };
  }

  getAllOrders(): Observable<IOrders> {
    return this.http.get<IOrders>(this.getURL);
  }
}
