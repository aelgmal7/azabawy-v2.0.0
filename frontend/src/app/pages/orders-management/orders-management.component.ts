import {
  AddOrderComponent,
  IOrderNewProduct,
} from './add-order/add-order.component';
import { OrdersService } from './../../shared/services/orders.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { StoreService } from 'src/app/shared/services/store.service';

@Component({
  selector: 'app-orders-management',
  templateUrl: './orders-management.component.html',
  styleUrls: ['./orders-management.component.css'],
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
export class OrdersManagementComponent implements OnInit {
  dataSource: MatTableDataSource<[]>;

  products;

  orders;
  expandedElement: IOrders | null;
  columnsToDisplay = ['id', 'clientName', 'orderName', 'status', 'delete'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public dialog: MatDialog, private _orderService: OrdersService) {
    this.dataSource = new MatTableDataSource();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this._orderService.getAllOrders().subscribe((orders) => {
      this.orders = Object.values(orders.result);
      this.dataSource.data = this.orders[0];

      this.dataSource.data.forEach((order) => {
        console.log(order['orderItems']);
        order['orderItems'].sort((a, b) => {
          return Number(a.completed) - Number(b.completed);
        });
      });
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addDialog() {
    let dialogRef = this.dialog.open(AddOrderComponent, {
      width: '800px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      this._orderService.getAllOrders().subscribe((orders) => {
        this.orders = Object.values(orders.result);
        this.dataSource.data = this.orders[0];

        this.dataSource.data.forEach((order) => {
          console.log(order['orderItems']);
          order['orderItems'].sort((a, b) => {
            return Number(a.completed) - Number(b.completed);
          });
        });
      });
    });
  }
}
export interface IOrders {
  clientId: number;
  completed: boolean;
  createdAt: number;
  enabled: boolean;
  id: number;
  orderItems: [
    {
      completed: boolean;
      createdAt: number;
      delivered: number;
      enabled: boolean;
      id: number;
      kiloPrice: number;
      orderId: number;
      productId: number;
      productNeededWeight: number;
      updatedAt: number;
    }
  ];
  orderName: string;
  updatedAt: number;
}
export interface IOrderResponse {
  succeeded: boolean;
  result: {};
  status: string;
}
export interface IOrderDetails {
  orderName: string;
  productsDetails: IOrderNewProduct[];
}
