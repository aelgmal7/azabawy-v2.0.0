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
import { UpdateSupplierComponent } from './update-supplier/update-supplier.component';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.css'],
})
export class SuppliersComponent implements OnInit {
  dataSource: MatTableDataSource<ISupplier>;
  columnsToDisplay = ['id', 'supplierName', 'totalBalance', 'paid', 'actions'];

  swalWithBootstrapButtons;
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
  editDialog(supp) {
    let dialogRef = this.dialog.open(UpdateSupplierComponent, {
      width: '800px',
      data: supp,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this._suppliersService.getAllSuppliers().subscribe((response) => {
        console.log(response);
        const x: any[] = Object.values(response.result);
        this.dataSource.data = x[0];
      });
    });
  }

  deleteClient(i) {
    this.swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
    });

    this.swalWithBootstrapButtons
      .fire({
        title: 'مسح هذا المورد',
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
          this._suppliersService.deleteSupplier(i).subscribe((r) => {
            console.log(r);
            if (Object.values(r)[1] === true) {
              this.swalWithBootstrapButtons.fire(
                'تم المسح!',
                'تم مسح العميل بنجاح!',
                'success'
              );
              this._suppliersService.getAllSuppliers().subscribe((response) => {
                const x: any[] = Object.values(response.result);
                this.dataSource.data = x[0];
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
            'هذا العميل لم يتم مسحه :)',
            'error'
          );
        }
      });
  }
}
export interface ISupplier {
  supplierName: string;
  id: number;
  paid: number;
  totalBalance: number;
}
