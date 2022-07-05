import {
  IOrderItems,
  IOrders,
} from './../orders-management/orders-management.component';
import { OrdersService } from './../../shared/services/orders.service';
import { IClients } from './../orders-management/add-order/add-order.component';
import { ClientsService } from './../../shared/services/clients.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { StoreService } from 'src/app/shared/services/store.service';
import { Product, BillType } from './types/types.t';
import { PeriodicElement } from '../store/store.component';

@Component({
  selector: 'app-new-bill',
  templateUrl: './new-bill.component.html',
  styleUrls: ['./new-bill.component.css'],
})
export class NewBillComponent implements OnInit {
  form: FormGroup;
  myDate: Date = new Date();
  clients: IClients[];
  selectedClient: IClients;
  orders: IOrders[];
  selectedOrder: IOrders;
  products: IOrderItems;
  selectedProduct: PeriodicElement;
  weights;
  selectedWeights;
  amount;
  price;
  orderedProducts: IOrderedProducts[] = [];
  totalPrice: number = 0;

  operations = ['عميل', 'مورد', 'بيع مباشر'];
  bills = ['بيع', 'بيع مرتجع'];

  constructor(
    private _fb: FormBuilder,
    private _storeService: StoreService,
    private _ordersService: OrdersService,
    private _clientsService: ClientsService
  ) {}

  get operation(): AbstractControl {
    return this.form?.get('operation') as AbstractControl;
  }
  get clientName(): AbstractControl {
    return this.form?.get('clientName') as AbstractControl;
  }
  get orderName(): AbstractControl {
    return this.form?.get('orderName') as AbstractControl;
  }
  get productName(): AbstractControl {
    return this.form?.get('productName') as AbstractControl;
  }
  get kiloPrice(): AbstractControl {
    return this.form?.get('kiloPrice') as AbstractControl;
  }
  get productWeights(): AbstractControl {
    return this.form?.get('productWeights') as AbstractControl;
  }
  get productAmount(): AbstractControl {
    return this.form?.get('productAmount') as AbstractControl;
  }
  get totalPrice2(): AbstractControl {
    return this.form?.get('totalPrice') as AbstractControl;
  }

  ngOnInit(): void {
    console.log(this.orderedProducts);
    this._clientsService.getAllClients().subscribe((response) => {
      const c: any = Object.values(response.result);
      this.clients = c[0];
    });

    this.form = this._fb.group({
      operation: ['', Validators.required],
      date: [this.myDate, Validators.required],
      totalPrice: [''],
      clientName: [''],
      orderName: [''],
      billType: [''],
      productName: [''],
      kiloPrice: [''],
      productWeights: [''],
      productAmount: [''],
      paid: [0],
    });
    this.clientName.valueChanges.subscribe((change) => {
      this._ordersService.getAllOrders().subscribe((orders) => {
        const x: any[] = Object.values(orders.result);
        const y = x[0];
        this.orders = y?.filter((e) => e.ClientId == this.clientName.value?.id);
      });
    });
    this.orderName.valueChanges.subscribe((change) => {
      this._storeService.getAllProducts().subscribe((prod) => {
        const x: any[] = Object.values(prod.result);
        let y: PeriodicElement[] = x[0];

        const arr: any[] = this.orderName.value?.orderItems;
        arr?.forEach((e) => {
          y = y.filter((obj) => {
            return obj.id !== e.productId;
          });
          // console.log(y);
        });
        console.log(y, this.orderName.value?.orderItems);
      });
    });
    this.productName.valueChanges.subscribe((change) => {
      this._storeService.getAllProducts().subscribe((prod) => {
        const x: any[] = Object.values(prod.result);
        const y = x[0];
        const z = y?.filter((e) => e.id == this.productName.value?.productId);
        this.weights = z[0]?.weightAndAmounts;
        this.price = z[0]?.kiloPrice;
        console.log(z);
      });
    });
    this.productWeights.valueChanges.subscribe((change) => {
      this.amount = this.productWeights.value?.amount;
      this.productAmount.setValidators([
        Validators.max(this.amount),
        Validators.min(1),
      ]);
    });
  }

  orderProduct(productName, productPrice, productWeight, productAmount) {
    const x = {} as IOrderedProducts;
    x.productName = productName.productName;
    x.productPrice = productPrice * productWeight.weight * productAmount;
    x.productWeight = productWeight.weight;
    x.productAmount = productAmount;
    x.totalWeight = productAmount * productWeight.weight;
    this.orderedProducts?.push(x);
    this.productName.reset();
    this.kiloPrice.reset();
    this.productWeights.reset();
    this.productAmount.reset();

    this.totalPrice = this.orderedProducts.reduce((accumulator, object) => {
      return accumulator + object.productPrice;
    }, 0);
  }
  deleteProduct(i) {
    this.orderedProducts.splice(i, 1);
    this.totalPrice = this.orderedProducts.reduce((accumulator, object) => {
      return accumulator + object.productPrice;
    }, 0);
    console.log(this.totalPrice);
  }
}
export interface IOrderedProducts {
  productName: string;
  productPrice: number;
  productWeight: number;
  totalWeight: number;
  productAmount: number;
}
