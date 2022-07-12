import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ClientsService } from 'src/app/shared/services/clients.service';
import { SuppliersService } from 'src/app/shared/services/suppliers.service';
import Swal from 'sweetalert2';
import { IClients } from '../../orders-management/add-order/add-order.component';
import { AddSupplierComponent } from '../suppliers/add-supplier/add-supplier.component';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.css'],
})
export class SuppliersComponent implements OnInit {
  dataSource: MatTableDataSource<ISupplier>;
  columnsToDisplay = ['id', 'supplierName', 'totalBalance', 'paid', 'actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    public dialog: MatDialog,
    private _suppliersService: SuppliersService
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit() {
    this._suppliersService.getAllSuppliers().subscribe((response) => {
      console.log(response);
      const x: any[] = Object.values(response.result);
      this.dataSource.data = x[0];
      console.log(this.dataSource);
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
    let dialogRef = this.dialog.open(AddSupplierComponent, {
      width: '800px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      this._suppliersService.getAllSuppliers().subscribe((response) => {
        console.log(response);
        const x: any[] = Object.values(response.result);
        this.dataSource.data = x[0];
      });
    });
  }
}
export interface ISupplier {
  supplierName: string;
  id: number;
  paid: number;
  totalBalance: number;
}
