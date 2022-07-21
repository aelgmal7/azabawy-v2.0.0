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
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from 'src/app/shared/services/store.service';
import { Product, BillType } from './types/types.t';
import { PeriodicElement } from '../store/store.component';
import { threadId } from 'worker_threads';
import { BillsService } from 'src/app/shared/services/bills.service';

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
  myProducts: IOrderItems[];
  products: PeriodicElement[];
  selectedProduct: PeriodicElement;
  weights;
  selectedWeights;
  amount;
  price;
  orderedProducts: IOrderedProducts[] = [];
  totalPrice: number = 0;
  arr: number[] = [];

  operations = ['عميل', 'مورد', 'بيع مباشر'];
  bills = ['بيع', 'بيع مرتجع'];

  constructor(
    private _fb: FormBuilder,
    private _storeService: StoreService,
    private _ordersService: OrdersService,
    private _clientsService: ClientsService,
    private _billsService: BillsService,
    public router: Router
  ) {
    console.log(router.url);
  }

  get operation(): AbstractControl {
    return this.form?.get('operation') as AbstractControl;
  }
  get billType(): AbstractControl {
    return this.form?.get('billType') as AbstractControl;
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
    console.log(this.router.url);

    this._clientsService.getAllClients().subscribe((response) => {
      const c: any = Object.values(response.result);
      this.clients = c[0];
    });

    this.form = this._fb.group({
      // operation: ['', Validators.required],
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
    this.billType.valueChanges.subscribe((change) => {
      this.orderName.reset();
      this.productName.reset();
      this.productWeights.reset();
      this.totalPrice2.reset();
      this.orderedProducts = [];
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
        this.products = x[0];
        this.myProducts = this.orderName.value?.orderItems;

        for (let k in this.myProducts) {
          this.arr.push(this.myProducts[k].productId);
        }
        console.log(this.myProducts);
        console.log(this.arr);

        for (let k of this.arr) {
          this.products.sort((a, b) => {
            return a.id == k ? -1 : b.id == k ? 1 : 0;
          });
        }
        console.log(this.products);
      });
    });
    this.productName.valueChanges.subscribe((change) => {
      this._storeService.getAllProducts().subscribe((prod) => {
        const x: any[] = Object.values(prod.result);
        const y = x[0];
        const z = y?.filter((e) => e.id == this.productName.value?.id);
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
    x.id = productName.id;
    x.productName = productName.productName;
    x.kiloPrice = productPrice * productWeight.weight * productAmount;
    x.weight = productWeight.weight;
    x.amount = productAmount;
    x.totalWeight = productAmount * productWeight.weight;
    this.arr.includes(productName.id)
      ? (x.orderFlag = true)
      : (x.orderFlag = false);
    this.orderedProducts?.push(x);
    this.productName.reset();
    this.kiloPrice.reset();
    this.productWeights.reset();
    this.productAmount.reset();
    console.log(x);
    // console.log(productName, productPrice, productWeight, productAmount);

    this.totalPrice = this.orderedProducts.reduce((accumulator, object) => {
      return accumulator + object.kiloPrice;
    }, 0);
  }
  deleteProduct(i) {
    this.orderedProducts.splice(i, 1);
    this.totalPrice = this.orderedProducts.reduce((accumulator, object) => {
      return accumulator + object.kiloPrice;
    }, 0);
    console.log(this.totalPrice);
  }

  submit(form) {
    const bill = {
      options: {
        printable: false,
        type: null,
      },
      billData: {
        cost: this.totalPrice,
        paid: form.controls.paid.value,
        date: form.controls.date.value,
        orderId: form.controls.orderName.value.id,
      },
      productsDetails: this.orderedProducts,
    };
    this._billsService
      .addNewBill(bill, form.controls.clientName.value.id)
      .subscribe((response) => {
        console.log(response);
      });
    console.log(form);
    console.log(bill);
  }
}
export interface IOrderedProducts {
  id: number;
  productName: string;
  kiloPrice: number;
  weight: number;
  totalWeight: number;
  amount: number;
  orderFlag: boolean;
}
