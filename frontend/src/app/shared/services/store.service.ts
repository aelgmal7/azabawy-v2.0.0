import { Observable } from 'rxjs';
import { PeriodicElement } from './../../pages/store/store.component';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class StoreService {
  products: PeriodicElement[] = [];
  private Url = '';

  private dataStore: {
    products: PeriodicElement[];
  };

  addProduct(product: PeriodicElement) {
    this.dataStore.products.push(product);
  }

  get(): Observable<PeriodicElement[]> {
    // return this.products;
    return this.http.get<PeriodicElement[]>(this.Url);
  }

  constructor(private http: HttpClient) {
    this.dataStore = { products: [] };
  }
}
