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

  orders: any = [
    {
      clientName: 'Moataz',
      orderName: '7lwyat',
      products: [
        {
          name: 'Agwa',
          weight: 6,
          receivedWeight: 3,
        },
        {
          name: 'Agwa2',
          weight: 6,
          receivedWeight: 3,
        },
        {
          name: 'Agwa',
          weight: 6,
          receivedWeight: 3,
        },
        {
          name: 'Agwa',
          weight: 6,
          receivedWeight: 3,
        },
        {
          name: 'Agwa',
          weight: 6,
          receivedWeight: 3,
        },
        {
          name: 'Agwa',
          weight: 6,
          receivedWeight: 3,
        },
      ],
    },
    {
      clientName: 'Moataz',
      orderName: '7lwyat',
      products: [
        {
          name: 'Agwa',
          weight: 6,
          receivedWeight: 3,
        },
      ],
    },
    {
      clientName: 'Moataz',
      orderName: '7lwyat',
      products: [
        {
          name: 'Agwa11',
          weight: 6,
          receivedWeight: 3,
        },
      ],
    },
  ];
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
    this._orderService.getAllOrders().subscribe((o) => {
      console.log(o);
      // this.dataSource.data = o;
    });
    // this.dataSource.data = this.orders;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
export interface IOrders {
  id: number;
  orderName: string;
  completed: boolean;
  enabled: boolean;
  createdAt: number;
  clientId: number;
  totalWeight: number;
  clientName: string;
  products: [
    {
      name: string;
      weight: number;
      receivedWeight: number;
    }
  ];
}
export interface IOrderProduct {
  name: string;
  weight: number;
  receivedWeight: number;
}
