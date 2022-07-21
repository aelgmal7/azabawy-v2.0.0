import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ClientsService } from 'src/app/shared/services/clients.service';
import { IClients } from '../../orders-management/add-order/add-order.component';
import { AddClientComponent } from './add-client/add-client.component';
import { UpdateClientComponent } from './update-client/update-client.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css'],
})
export class ClientsComponent implements OnInit {
  dataSource: MatTableDataSource<IClients>;
  swalWithBootstrapButtons;

  columnsToDisplay = ['id', 'clientName', 'paid', 'remain', 'actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    public dialog: MatDialog,
    private _clientsService: ClientsService
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit() {
    this._clientsService.getAllClients().subscribe((client) => {
      console.log(client);
      const x: any[] = Object.values(client.result);
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
    let dialogRef = this.dialog.open(AddClientComponent, {
      width: '800px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      this._clientsService.getAllClients().subscribe((client) => {
        console.log(client);
        const x: any[] = Object.values(client.result);
        this.dataSource.data = x[0];
      });
    });
  }
  editDialog(client) {
    let dialogRef = this.dialog.open(UpdateClientComponent, {
      width: '600px',
      data: client,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this._clientsService.getAllClients().subscribe((client) => {
        console.log(client);
        const x: any[] = Object.values(client.result);
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
        title: 'مسح هذا العميل؟',
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
          this._clientsService.deleteClient(i).subscribe((response) => {
            console.log(response);
            if (Object.values(response)[0] === true) {
              this.swalWithBootstrapButtons.fire(
                'تم المسح!',
                'تم مسح العميل بنجاح!',
                'success'
              );
              this._clientsService.getAllClients().subscribe((client) => {
                const x: any[] = Object.values(client.result);
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
