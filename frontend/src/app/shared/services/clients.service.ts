import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  private getURL = 'http://localhost:3000/client';

  private dataStore: {
    orders;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { orders: [] };
  }

  getAllClients(): Observable<any> {
    return this.http.get(this.getURL);
  }
}
