import { StoreService } from './../../shared/services/store.service';
import { EditProductComponent } from './edit-product/edit-product.component';
import {
  AddProductComponent,
  kartona,
} from './add-product/add-product.component';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { response } from 'express';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class StoreComponent implements OnInit {
  dataSource: MatTableDataSource<PeriodicElement>;

  weight;
  amount;

  swalWithBootstrapButtons;
  visible: boolean = false;

  products;

  columnsToDisplay = [
    'م',
    'إسم المنتج',
    'النوع',
    'عدد الكراتين',
    'الوزن الكلي',
    'سعر الكيلو',
    'الحد الأدنى',
    'التعديل',
  ];

  expandedElement: PeriodicElement | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public dialog: MatDialog, private _storeService: StoreService) {
    this.dataSource = new MatTableDataSource();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ngOnInit(): void {
    this._storeService.getAllProducts().subscribe((prod) => {
      this.products = Object.values(prod.result);
      this.dataSource.data = this.products[0];
      console.log(this.dataSource.data);
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  deleteProduct(i) {
    this.swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
    });

    this.swalWithBootstrapButtons
      .fire({
        title: 'مسح هذا المنتج؟',
        text: 'سوف تكون غير قادر على إعادة هذه الخطوة',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'إحذف',
        cancelButtonText: 'إلغاء',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          // this.ELEMENT_DATA.splice(i, 1);
          this._storeService.deleteProduct(i).subscribe((response) => {
            console.log(response);
            if (Object.values(response)[0] === true) {
              this.swalWithBootstrapButtons.fire(
                'تم المسح!',
                'تم مسح المنتج بنجاح!',
                'success'
              );
              this._storeService.getAllProducts().subscribe((prod) => {
                this.products = Object.values(prod.result);
                this.dataSource.data = this.products[0];
              });
            } else {
              this.swalWithBootstrapButtons.fire('لم يتم المسح!', '', 'error');
            }
          });
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          this.swalWithBootstrapButtons.fire(
            'تم الإلغاء',
            'هذا المنتج لم يتم مسحه :)',
            'error'
          );
        }
      });
  }

  totalWeight(array) {
    let x = 0;
    array.forEach((element) => {
      x += element.weight * element.amount;
    });
    return x;
  }
  totalAmount(array) {
    let x = 0;
    array.forEach((element) => {
      x += element.amount;
    });
    return x;
  }

  addAmount(val1, index1, index2) {
    this.dataSource.data[index1].weightAndAmounts[index2].amount +=
      Number(val1);
    Swal.fire('تم تعديل الكمية بنجاح!', '', 'success');
  }
  minAmount(val1, index1, index2) {
    this.dataSource.data[index1].weightAndAmounts[index2].amount -=
      Number(val1);
    Swal.fire('تم تعديل الكمية بنجاح!', '', 'success');
  }

  updateAmountMin(amount, weight, id) {
    // const newAmount = {} as IUpdateAmount;
    // newAmount.weight = Number(weight);
    // newAmount.amount = Number(amount);
    amount = -amount;

    console.log('Weight:', weight, 'Amount:', amount, 'ID:', id);
    this._storeService
      .updateAmount(id, amount, weight)
      .subscribe((response) => {
        console.log(response);
      });
  }

  addDialog() {
    let dialogRef = this.dialog.open(AddProductComponent, {
      width: '800px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      this._storeService.getAllProducts().subscribe((prod) => {
        this.products = Object.values(prod.result);
        this.dataSource.data = this.products[0];
      });
    });
  }
  editDialog(prod, i) {
    let dialogRef = this.dialog.open(EditProductComponent, {
      width: '600px',
      data: prod,
    });
    dialogRef.afterClosed().subscribe((result) => {
      // if (typeof result === 'object') {
      //   this.ELEMENT_DATA.splice(i, 1, result);
      //   this.dataSource.data = this.ELEMENT_DATA;
      //   Swal.fire('تم تعديل المنتج بنجاح!', '', 'success');
      // } else {
      //   Swal.fire('تم الإلغاء!', '', 'error');
      // }
    });
  }

  addNewWeight(w, a, id, index) {
    const prod = {
      weight: Number(w),
      amount: Number(a),
    };

    this._storeService.addNewWeight(id, prod).subscribe((response) => {
      console.log(response);
      if (
        this.dataSource.data[index].weightAndAmounts.filter(
          (e) => e.weight == w
        ).length > 0
      ) {
        this.visible = true;
      } else {
        if (Object.values(response)[0] === true) {
          Swal.fire('تم إضافة الوزن الجديد بنجاح!', '', 'success');
          this._storeService.getAllProducts().subscribe((prod) => {
            this.products = Object.values(prod.result);
            this.dataSource.data = this.products[0];
          });
          this.visible = false;
          this.amount = null;
          this.weight = null;
        } else {
          this.swalWithBootstrapButtons.fire(
            'لم يتم إضافة الوزن!',
            '',
            'error'
          );
        }
      }
    });
  }
  deleteWeight(id, weight) {
    this.swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
    });

    this.swalWithBootstrapButtons
      .fire({
        title: 'مسح هذا الوزن؟',
        text: 'سوف تكون غير قادر على إعادة هذه الخطوة',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'إحذف',
        cancelButtonText: 'إلغاء',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this._storeService.deleteWeight(id, weight).subscribe((response) => {
            if (Object.keys(response).length === 8) {
              this.swalWithBootstrapButtons.fire(
                'تم المسح!',
                'تم مسح الوزن بنجاح!',
                'success'
              );
              this._storeService.getAllProducts().subscribe((prod) => {
                this.products = Object.values(prod.result);
                this.dataSource.data = this.products[0];
              });
            } else {
              this.swalWithBootstrapButtons.fire('لم يتم المسح!', '', 'error');
            }
          });
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          this.swalWithBootstrapButtons.fire(
            'تم الإلغاء',
            'هذا الوزن لم يتم مسحه :)',
            'error'
          );
        }
      });
  }
}
export interface PeriodicElement {
  alarm: number;
  createdAt: string;
  enabled: boolean;
  id: number;
  kiloPrice: number;
  productName: string;
  totalAmount: number;
  totalWeight: number;
  updatedAt: string;
  type: string;
  weightAndAmounts: [
    {
      amount: number;
      createdAt: string;
      enabled: boolean;
      id: number;
      productId: number;
      productName: string;
      updatedAt: string;
      weight: number;
    }
  ];
}
export interface IProducts {
  succeeded: boolean;
  result: {};
}
export interface IUpdateAmount {
  weight: number;
  amount: number;
}
