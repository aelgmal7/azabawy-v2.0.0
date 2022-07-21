import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NewSupplier } from 'src/app/pages/accounting/suppliers/add-supplier/add-supplier.component';

@Injectable({
  providedIn: 'root',
})
export class SuppliersService {
  private getURL = 'http://localhost:3000/supplier';
  private postURL = 'http://localhost:3000/supplier/add-supplier';

  private dataStore: {
    suppliers;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { suppliers: [] };
  }

  getAllSuppliers(): Observable<any> {
    return this.http.get(this.getURL);
  }

  addNewSupplier(newSupplier: NewSupplier): Observable<NewSupplier> {
    return this.http.post<NewSupplier>(this.postURL, newSupplier);
  }

  updateSupplier(supplier: NewSupplier, id: number): Observable<NewSupplier> {
    const postURL = `http://localhost:3000/supplier/${id}`;
    return this.http.put<NewSupplier>(postURL, supplier);
  }
}
