import { Component, OnInit, ViewChild } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ClientsService } from 'src/app/shared/services/clients.service';
import Swal from 'sweetalert2';
import { BillsService } from 'src/app/shared/services/bills.service';
import { operation } from './clients/clients.component';
import { OperationsService } from 'src/app/shared/services/operations.service';
import { response } from 'express';
import { Router } from '@angular/router';

@Component({
  selector: 'app-accounting',
  templateUrl: './accounting.component.html',
  styleUrls: ['./accounting.component.css'],
})
export class AccountingComponent implements OnInit {
  dataSource: MatTableDataSource<operation>;
  swalWithBootstrapButtons;
  operations: operation[] = [];
  loading: boolean;

  columnsToDisplay = [
    'id',
    'clientName',
    'date',
    'type',
    'total',
    'paid',
    'remain',
    'remainAfterOp',
    'actions',
    // 'delete',
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private _operationsService: OperationsService,
    public router: Router,
    ) {
    this.dataSource = new MatTableDataSource();
    
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this._operationsService.getAllOperations().subscribe((response) => {
      console.log(response);
      const x: any[] = Object.values(response.result);
      this.dataSource.data = x[0];
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
  deleteOperation(op:operation){
    const {type,id}= op
    this._operationsService.deleteOperation({type,id}).subscribe(response =>{
      if (Object.values(response)[0] === true) {
        Swal.fire('تم حذف العملية بنجاح!', '', 'success');
        this.router.navigate(['/accounting']);
      } else {
        Swal.fire('لم يتم حذف العملية!', '', 'error');
      }
      console.log(response);
    })


  }
  show(op) {
    const bill = {
      id: op.id,
      type: op.type,
    };
    this._operationsService.getIndividual(bill).subscribe((response) => {
      console.log(response);
    });
  }
}
