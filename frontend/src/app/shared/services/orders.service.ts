import {
  IOrderDetails,
  IOrderResponse,
  IOrders,
} from './../../pages/orders-management/orders-management.component';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class OrdersService {
  private getURL = 'http://localhost:3000/order/';

  private dataStore: {
    orders: IOrders[];
  };

  constructor(private http: HttpClient) {
    this.dataStore = { orders: [] };
  }

  getAllOrders(): Observable<IOrderResponse> {
    return this.http.get<IOrderResponse>(this.getURL);
  }

  addNewOrder(orderDetails: IOrderDetails): Observable<{}> {
    const PostURL = 'http://localhost:3000/order/add-order?clientId=2';
    return this.http.post<{}>(PostURL, orderDetails);
  }
}
