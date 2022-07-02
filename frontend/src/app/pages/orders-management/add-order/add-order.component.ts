import { IProducts, PeriodicElement } from './../../store/store.component';
import { OrdersService } from './../../../shared/services/orders.service';
import {
  IOrderResponse,
  IOrders,
  IOrderDetails,
} from './../orders-management.component';
import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, Observable } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { StoreService } from 'src/app/shared/services/store.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.component.html',
  styleUrls: ['./add-order.component.css'],
})
export class AddOrderComponent implements OnInit {
  form: FormGroup;
  visible: boolean = false;
  products: PeriodicElement[];
  prods;
  orderProducts: IOrderNewProduct[] = [];
  allProducts: string[] = [];
  filteredOptions: Observable<string[]>;
  constructor(
    private _fb: FormBuilder,
    private _storeService: StoreService,
    private _orderService: OrdersService,
    private _dialogRef: MatDialogRef<AddOrderComponent>
  ) {}

  get productName(): AbstractControl {
    return this.form?.get('productName') as AbstractControl;
  }
  get productNeededWeight(): AbstractControl {
    return this.form?.get('productNeededWeight') as AbstractControl;
  }

  ngOnInit() {
    this._storeService.getAllProducts().subscribe((prod) => {
      this.prods = Object.values(prod.result);
      this.products = this.prods[0];
      this.products.forEach((prod) => {
        this.allProducts.push(prod.productName);
      });
      console.log(this.allProducts);
    });

    this.form = this._fb.group({
      clientName: ['', Validators.required],
      orderName: ['', Validators.required],
      productName: [''],
      productNeededWeight: [''],
    });

    this.filteredOptions = this.productName.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
  }

  private _filter(name: string): string[] {
    const filterValue = name?.toLowerCase();

    return this.allProducts?.filter((product) =>
      product.toLowerCase().includes(filterValue)
    );
  }

  addProduct(id, weight) {
    console.log(id, weight);
    if (this.orderProducts?.filter((e) => e.id == id).length > 0) {
      this.visible = true;
    } else {
      const product = {} as IOrderNewProduct;
      product.id = id;
      product.productNeededWeight = weight;
      this.orderProducts?.push(product);
      this.productName.reset();
      this.productNeededWeight.reset();
      this.visible = false;
    }
    console.log(this.orderProducts);
  }

  deleteProduct(i) {
    this.orderProducts.splice(i, 1);
  }

  submit(form) {
    const order = {
      orderName: form.controls.orderName.value,
      productsDetails: [
        {
          productName: form.controls.productName.value,
          productNeededWeight: form.controls.productNeededWeight.value,
        },
      ],
    };
    console.log(order, form.controls.clientName.value);
    // this._orderService.addNewOrder(order).subscribe((response) => {
    //   console.log(response)
    // })
  }
}
export interface IOrderNewProduct {
  id: number;
  productNeededWeight: number;
}
