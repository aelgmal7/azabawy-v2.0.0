import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css'],
})
export class LogsComponent implements OnInit {
  dataSource: MatTableDataSource<log>;
  swalWithBootstrapButtons;
  operations: log[] = [];
  loading: boolean;

  columnsToDisplay = [
    'id',
    'MaterialName',
    'date',
    'reason',
    'amountBefore',
    'amountAfter',
    'totalAmountBefore',
    'totalAmountAfter',
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor() {
    this.dataSource = new MatTableDataSource();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit() {
    this.dataSource.data = [
      {
        id: 5,
        MaterialName: 'اسمنت',
        date: 20,
        reason: 'اسمنتاسمنت',
        amountBefore: 50,
        amountAfter: 40,
        totalAmountBefore: 30,
        totalAmountAfter: 20,
      },
    ];
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
export interface log {
  id: number;
  MaterialName: string;
  date: number;
  reason: string;
  amountBefore: number;
  amountAfter: number;
  totalAmountBefore: number;
  totalAmountAfter: number;
}
