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
    'date',
    'name',
    'reason',
    'weight',
    'oldAmount',
    'newAmount',
    'delta',
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
        date: 20,
        name: 'اسمنت',
        reason: 'اسمنتاسمنت',
        weight: 50,
        oldAmount: 40,
        newAmount: 30,
        delta: 20,
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
  name: string;
  date: number;
  reason: string;
  weight: number;
  oldAmount: number;
  newAmount: number;
  delta: number;
}
