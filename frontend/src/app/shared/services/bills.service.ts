import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BillsService {
  private dataStore: {
    bills: [];
  };

  constructor(private http: HttpClient) {
    this.dataStore = { bills: [] };
  }

  addNewBill(bill, id): Observable<any> {
    const PostURL = `http://localhost:3000/bill/add-bill/${id}`;
    return this.http.post<any>(PostURL, bill);
  }
  addDirectPay(bill, id): Observable<any> {
    const PostURL = `http://localhost:3000/directPay/add-directPay/?clientId=${id}`;
    return this.http.post<any>(PostURL, bill);
  }
  addOrderPay(bill, id, clientId): Observable<any> {
    const PostURL = `http://localhost:3000/bill/pay/${id}?clientId=${clientId}`;
    return this.http.post<any>(PostURL, bill);
  }
  getClientBills(clientId): Observable<any> {
    const getURL = `http://localhost:3000/bill/client?clientId=${clientId}`;
    return this.http.get<any>(getURL);
  }
}
