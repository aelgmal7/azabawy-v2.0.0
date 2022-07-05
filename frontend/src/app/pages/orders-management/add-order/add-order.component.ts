import { ClientsService } from './../../../shared/services/clients.service';
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
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.component.html',
  styleUrls: ['./add-order.component.css'],
})
export class AddOrderComponent implements OnInit {
  form: FormGroup;
  visible: boolean = false;
  products: PeriodicElement[];
  clients: IClients[];
  orderProducts: productsDetails[] = [];
  // allProducts: string[] = [];
  // filteredOptions: Observable<string[]>;

  items: SelectItem[];
  selectedOrder: PeriodicElement;
  selectedClient: IClients;

  constructor(
    private _fb: FormBuilder,
    private _storeService: StoreService,
    private _orderService: OrdersService,
    private _clientsService: ClientsService,
    private _dialogRef: MatDialogRef<AddOrderComponent>
  ) {
    this.items = [];
    for (let i = 0; i < 10000; i++) {
      this.items.push({ label: 'Item ' + i, value: 'Item ' + i });
    }
  }

  get productName(): AbstractControl {
    return this.form?.get('productName') as AbstractControl;
  }
  get productNeededWeight(): AbstractControl {
    return this.form?.get('productNeededWeight') as AbstractControl;
  }

  ngOnInit() {
    this._storeService.getAllProducts().subscribe((prod) => {
      const prods: any = Object.values(prod.result);
      this.products = prods[0];
      console.log(this.products);
    });

    this._clientsService.getAllClients().subscribe((response) => {
      const c: any = Object.values(response.result);
      this.clients = c[0];
      console.log(this.clients);
    });

    this.form = this._fb.group({
      clientName: ['', Validators.required],
      orderName: ['', Validators.required],
      productName: [''],
      productNeededWeight: [''],
    });
  }

  addProduct(prod, weight) {
    // console.log(prod, weight);
    if (this.orderProducts?.filter((e) => e.id == prod.id).length > 0) {
      this.visible = true;
    } else {
      const product = {} as productsDetails;
      product.id = prod.id;
      product.productName = prod.productName;
      product.productNeededWeight = Number(weight);
      this.orderProducts?.push(product);
      this.productName.reset();
      this.productNeededWeight.reset();
      this.visible = false;
      document.getElementById('kartona')?.scrollIntoView();
    }
    // console.log(this.orderProducts);
  }

  deleteProduct(i) {
    this.orderProducts.splice(i, 1);
  }

  submit(form) {
    const ord = {};
    const id = form.controls.clientName.value.id;
    const orderDetails = {
      orderName: form.controls.orderName.value,
      clientName: form.controls.clientName.value.clientName,
    };
    const order = {} as IPostOrder;
    order.orderDetails = orderDetails;
    order.productsDetails = this.orderProducts;
    console.log(order);
    this._orderService.addNewOrder(order, id).subscribe((response) => {
      if (Object.values(response)[1] == true) {
        Swal.fire('تم إضافة الطلبية بنجاح!', '', 'success');
        this._dialogRef.close();
      } else {
        Swal.fire('لم يتم حفظ المنتج!', Object.values(response)[2], 'error');
      }
      console.log(response);
    });
  }
}

export interface IPostOrder {
  orderDetails: IOrderDetails;
  productsDetails: productsDetails[];
}
export interface productsDetails {
  id: number;
  productName: string;
  productNeededWeight: number;
}

export interface IClients {
  clientName: string;
  createdAt: Date;
  enabled: boolean;
  id: number;
  paid: number;
  phoneNumber: number;
  remain: number;
  totalBalance: number;
  type: number;
  typeString: string;
  updatedAt: Date;
}
