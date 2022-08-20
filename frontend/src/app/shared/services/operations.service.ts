import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OperationsService {
  private dataStore: {
    bills: [];
  };

  constructor(private http: HttpClient) {
    this.dataStore = { bills: [] };
  }

  getAllOperations(): Observable<any> {
    const getURL = `http://localhost:3000/accounting/`;
    return this.http.get<any>(getURL);
  }
  getIndividual(op): Observable<any> {
    console.log(op);
    const getURL = `http://localhost:3000/accounting/individual/`;
    return this.http.post<any>(getURL,op);
  }
}
