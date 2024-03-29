import {
  IOrderItems,
  IOrders,
} from './../orders-management/orders-management.component';
import { OrdersService } from './../../shared/services/orders.service';
import { IClients } from './../orders-management/add-order/add-order.component';
import { ClientsService } from './../../shared/services/clients.service';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { StoreService } from 'src/app/shared/services/store.service';
import { PeriodicElement } from '../store/store.component';
import { BillsService } from 'src/app/shared/services/bills.service';
import { MatDialog } from '@angular/material/dialog';
import { PrintOptionsComponent } from './print-options/print-options.component';
import Swal from 'sweetalert2';

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
  products: any[];
  selectedProduct: PeriodicElement;
  weights;
  selectedWeights;
  billWeights;
  selectedBillWeights;
  amount;
  price;
  orderedProducts: IOrderedProducts[] = [];
  totalPrice: number = 0;
  arr;
  printOption: number;
  clientBills;
  billsList: bills[] = [];
  selectedBill: bills;
  billProducts: any[];
  selectedBillProducts: PeriodicElement;
  orderId;
  paidElement: HTMLElement;
  totalPriceElement: HTMLElement;
  placeholder = 'إسم العميل';

  operations = ['عميل', 'مورد', 'بيع مباشر'];
  bills = ['بيع', 'بيع مرتجع'];

  constructor(
    private _fb: FormBuilder,
    private _storeService: StoreService,
    private _ordersService: OrdersService,
    private _clientsService: ClientsService,
    private _billsService: BillsService,
    public router: Router,
    public dialog: MatDialog
  ) {
    // console.log(router.url);
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
  get amountPaid(): AbstractControl {
    return this.form?.get('amountPaid') as AbstractControl;
  }
  get billsCtrl(): AbstractControl {
    return this.form?.get('bills') as AbstractControl;
  }

  ngOnInit(): void {
    // console.log(this.router.url);

    this._clientsService.getAllClients().subscribe((response) => {
      const c: any = Object.values(response.result);
      this.clients = c[0];
    });

    this.form = this._fb.group({
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
      amountPaid: [''],
      notes: [''],
      bills: [''],
    });
    if (this.router.url == '/new-sanad-direct') {
      this.amountPaid.setValidators(Validators.required);
    }
    if (this.router.url == '/new-sanad-order') {
      this.amountPaid.setValidators(Validators.required);
      this.billsCtrl.setValidators(Validators.required);
    }
    if (this.router.url == '/new-bill-client') {
      this.clientName.setValidators(Validators.required);
      this.placeholder = 'إسم العميل*';
    }

    this.billType.valueChanges.subscribe((change) => {
      this.orderName.reset();
      this.productName.reset();
      this.productWeights.reset();
      this.totalPrice2.reset();
      this.orderedProducts = [];
      if (this.billType.value == 'بيع مرتجع') {
        const a = document.getElementById('paid');
        this.paidElement = a!;
        this.paidElement.style.display = 'none';
        const b = document.getElementById('totalPrice');
        this.totalPriceElement = b!;
        this.totalPriceElement.style.width = '100%';
      } else {
        const a = document.getElementById('paid');
        this.paidElement = a!;
        this.paidElement.style.display = 'unset';
        const b = document.getElementById('totalPrice');
        this.totalPriceElement = b!;
        this.totalPriceElement.style.width = '49%';
      }
    });
    this.clientName.valueChanges.subscribe((change) => {
      this._ordersService.getAllOrders().subscribe((orders) => {
        const x: any[] = Object.values(orders.result);
        const y = x[0];
        this.orders = y?.filter((e) => e.ClientId == this.clientName.value?.id);
      });
      this._billsService
        .getClientBills(this.clientName.value?.id)
        .subscribe((response) => {
          const c: any = Object.values(response.result);
          this.clientBills = c[0];
          this.clientBills.forEach((k) => {
            const x = {} as bills;
            x.id = k.billId;
            this.billsList?.push(x);
          });
          console.log(this.clientBills);
        });
    });
    this.billsCtrl.valueChanges.subscribe(() => {
      this.productName.reset();
      let x: billProducts[] = [];
      let q: billProducts[] = [];
      x = this.clientBills?.filter((k) => k.billId == this.billsCtrl.value?.id);
      x?.forEach((k) => (this.billProducts = k.products));
    });
    this.orderName.valueChanges.subscribe((change) => {
      this._storeService.getAllProducts().subscribe((prod) => {
        const x: any[] = Object.values(prod.result);
        this.products = x[0];
        this.myProducts = this.orderName.value?.orderItems;

        this.arr = [];
        for (let k in this.myProducts) {
          let o: any = {};
          o.id = this.myProducts[k].productId;
          o.orderItemId = this.myProducts[k].id;
          this.arr.push(o);
        }

        for (let k of this.arr) {
          this.products.map((item) => {
            if (item.id == k.id) {
              item.orderItemId = k.orderItemId;
            }
            return item;
          });
          this.products.sort((a, b) => {
            return a.id == k.id ? -1 : b.id == k.id ? 1 : 0;
          });
        }
      });
    });
    this.productName.valueChanges.subscribe((change) => {
      this.amount = null;
      this._storeService.getAllProducts().subscribe((prod) => {
        const x: any[] = Object.values(prod.result);
        const y = x[0];
        const z = y?.filter((e) => e.id == this.productName.value?.id);
        this.weights = z[0]?.weightAndAmounts;
        this.price = z[0]?.kiloPrice;
      });
      this.billWeights = this.productName.value?.weights;
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
    if (productName.orderItemId) {
      x.orderItemId = productName.orderItemId;
    }
    x.productName = productName.productName;
    x.kiloPrice = productPrice;
    x.totalPrice = productPrice * productWeight.weight * productAmount;
    x.weight = productWeight.weight;
    x.amount = productAmount;
    x.totalWeight = productAmount * productWeight.weight;
    this.arr.filter((item) => item.id == productName.id).length > 0
      ? (x.orderFlag = true)
      : (x.orderFlag = false);
    this.orderedProducts?.push(x);
    this.productName.reset();
    this.kiloPrice.reset();
    this.productWeights.reset();
    this.productAmount.reset();
    // console.log(x);
    // console.log(productName);

    this.totalPrice = this.orderedProducts.reduce((accumulator, object) => {
      return accumulator + object.totalPrice;
    }, 0);
  }
  deleteProduct(i) {
    this.orderedProducts.splice(i, 1);
    this.totalPrice = this.orderedProducts.reduce((accumulator, object) => {
      return accumulator + object.kiloPrice;
    }, 0);
    // console.log(this.totalPrice);
  }

  submit(form) {
    const id = form.controls.clientName.value.id;
    form.controls.orderName.value?.id
      ? (this.orderId = form.controls.orderName.value?.id)
      : (this.orderId = null);
    let type;
    this.billType.value == 'بيع'
      ? (type = 'فاتورة بيع')
      : (type = 'فاتورة مرتجع بيع');
    let paid;
    this.billType.value == 'بيع'
      ? (paid = form.controls.paid.value)
      : (paid = null);
    const bill = {
      options: {
        printable: false,
        type: null,
      },
      billData: {
        cost: this.totalPrice,
        paid: paid,
        date: form.controls.date.value,
        orderId: this.orderId,
        type: type,
      },
      productsDetails: this.orderedProducts,
    };
    this._billsService.addNewBill(bill, id).subscribe((response) => {
      console.log(Object.values(response)[0]);
      if (Object.values(response)[0] === true) {
        Swal.fire('تم إضافة الفاتورة بنجاح!', '', 'success');
        this.router.navigate(['/']);
      } else {
        Swal.fire('لم يتم إضافة الفاتورة!', '', 'error');
      }
    });
    console.log(bill);
  }
  print(form) {
    let dialogRef = this.dialog.open(PrintOptionsComponent, {
      width: '400px',
      data: this.printOption,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.printOption = result;
      console.log(this.printOption);
      const id = form.controls.clientName.value.id;
      let type;
      this.billType.value == 'بيع'
        ? (type = 'فاتورة بيع')
        : (type = 'فاتورة مرتجع بيع');
      let paid;
      this.billType.value == 'بيع'
        ? (paid = form.controls.paid.value)
        : (paid = null);
      let orderId;
      form.controls.orderName.value?.id
        ? (orderId = form.controls.orderName.value.id)
        : (orderId = null);
      const bill = {
        options: {
          printable: true,
          type: this.printOption,
        },
        billData: {
          cost: this.totalPrice,
          paid: paid,
          date: form.controls.date.value,
          orderId: orderId,
          type: type,
        },
        productsDetails: this.orderedProducts,
      };
      if (result) {
        this._billsService.addNewBill(bill, id).subscribe((response) => {
          console.log(response);
          if (Object.values(response)[0] === true) {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'جاري طباعة الفاتورة',
              showConfirmButton: false,
              timer: 3000,
            });
            this.router.navigate(['/']);
          } else {
            Swal.fire('لم يتم إضافة الفاتورة!', '', 'error');
          }
        });
      }
      console.log(form);
      console.log(bill);
    });
  }
  addDirectSanad(form) {
    let id;
    form.controls.clientName.value?.id
      ? (id = form.controls.clientName.value?.id)
      : (id = null);
    const sanad = {
      printable: false,
      date: form.controls.date.value,
      cash: form.controls.amountPaid.value,
      note: form.controls.notes.value,
    };
    this._billsService.addDirectPay(sanad, id).subscribe((r) => {
      console.log(r);
      if (Object.values(r)[1] === true) {
        Swal.fire('تم إضافة سند القبض بنجاح!', '', 'success');
        this.router.navigate(['/']);
      } else {
        Swal.fire('لم يتم إضافة سند القبض!', '', 'error');
      }
    });
  }

  printDirectSanad(form) {
    let id;
    form.controls.clientName.value?.id
      ? (id = form.controls.clientName.value?.id)
      : (id = null);
    const sanad = {
      printable: true,
      date: form.controls.date.value,
      cash: form.controls.amountPaid.value,
      note: form.controls.notes.value,
    };
    console.log('id :>> ', id);
    this._billsService.addDirectPay(sanad, id).subscribe((r) => {
      console.log(r);
      if (r['succeeded'] === true) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'جاري طباعة سند القبض',
          showConfirmButton: false,
          timer: 3000,
        });
        this.router.navigate(['/']);
      } else {
        Swal.fire('لم يتم إضافة سند القبض!', '', 'error');
      }
    });
  }

  addBillSanad(form) {
    const sanad = {
      printable: false,
      date: form.controls.date.value,
      cash: form.controls.amountPaid.value,
      note: form.controls.notes.value,
    };
    this._billsService
      .addOrderPay(
        sanad,
        form.controls.bills.value.id,
        form.controls.clientName.value.id
      )
      .subscribe((r) => {
        console.log(r);
        if (Object.values(r)[0] === true) {
          Swal.fire('تم إضافة سند القبض بنجاح!', '', 'success');
          this.router.navigate(['/']);
        } else {
          Swal.fire('لم يتم إضافة سند القبض!', '', 'error');
        }
      });
  }
  printBillSanad(form) {
    const sanad = {
      printable: true,
      date: form.controls.date.value,
      cash: form.controls.amountPaid.value,
      note: form.controls.notes.value,
    };
    this._billsService
      .addOrderPay(
        sanad,
        form.controls.bills.value.id,
        form.controls.clientName.value.id
      )
      .subscribe((r) => {
        console.log(r);
        if (Object.values(r)[0] === true) {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'جاري طباعة سند القبض',
            showConfirmButton: false,
            timer: 3000,
          });
          this.router.navigate(['/']);
        } else {
          Swal.fire('لم يتم إضافة سند القبض!', '', 'error');
        }
      });
  }
}
export interface IOrderedProducts {
  id: number;
  orderItemId: number;
  productName: string;
  kiloPrice: number;
  totalPrice: number;
  weight: number;
  totalWeight: number;
  amount: number;
  orderFlag: boolean;
}
export interface bills {
  id: number;
}
export interface billProducts {
  billId: number;
  products: [];
}
