import { Observable } from 'rxjs';
import {
  IProducts,
  PeriodicElement,
} from './../../pages/store/store.component';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  INewProduct,
  INewWeight,
  kartona,
} from 'src/app/pages/store/add-product/add-product.component';
import { IUpdateProduct } from 'src/app/pages/store/edit-product/edit-product.component';

@Injectable()
export class StoreService {
  // products: PeriodicElement[] = [];
  private Url = 'http://localhost:3000/product';
  private PostURL = 'http://localhost:3000/product/add-product';

  private dataStore: {
    products: PeriodicElement[];
  };

  constructor(private http: HttpClient) {
    this.dataStore = { products: [] };
  }

  getAllProducts(): Observable<IProducts> {
    return this.http.get<IProducts>(this.Url);
  }

  addNewProduct(newProduct: INewProduct): Observable<INewProduct> {
    return this.http.post<INewProduct>(this.PostURL, newProduct);
  }

  deleteProduct(id: number): Observable<number> {
    const deleteURL = `http://localhost:3000/product/${id}`;
    return this.http.delete<number>(deleteURL);
  }

  updateProduct(
    id: number,
    product: IUpdateProduct
  ): Observable<IUpdateProduct> {
    const UpdateURL = `http://localhost:3000/product/update-product/${id}`;

    return this.http.put<IUpdateProduct>(UpdateURL, product);
  }

  addNewWeight(id: number, newWeight: INewWeight): Observable<INewWeight> {
    const deleteURL = `http://localhost:3000/product/add-weights-and-amounts/${id}`;
    return this.http.post<INewWeight>(deleteURL, newWeight);
  }

  deleteWeight(productId: number, weightId: number): Observable<number> {
    const deleteURL = `http://localhost:3000/product/deleteProductWeight/${productId}?productWeight=${weightId}`;
    return this.http.delete<number>(deleteURL);
  }
}
