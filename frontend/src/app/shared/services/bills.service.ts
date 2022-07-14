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
}
