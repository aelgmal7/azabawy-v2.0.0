import {
  IOrderResponse,
  IOrders,
} from './../../pages/orders-management/orders-management.component';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IPostOrder } from 'src/app/pages/orders-management/add-order/add-order.component';

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

  addNewOrder(
    orderDetails: IPostOrder,
    clientId: number
  ): Observable<IPostOrder> {
    const PostURL = `http://localhost:3000/order/add-order?clientId=${clientId}`;
    return this.http.post<IPostOrder>(PostURL, orderDetails);
  }

  deleteOrder(id: number): Observable<number> {
    const deleteURL = `http://localhost:3000/order/delete/${id}`;
    return this.http.delete<number>(deleteURL);
  }
}
