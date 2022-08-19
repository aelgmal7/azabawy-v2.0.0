import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LogsService } from 'src/app/shared/services/logs.service';

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
  value;

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

  constructor(private logsService: LogsService) {
    this.dataSource = new MatTableDataSource();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit() {
    this.logsService.getAllLogs().subscribe((response) => {
      console.log(response.result);
      this.dataSource.data = response.result.result;
      this.value = this.dataSource.data.forEach((k) => Math.abs(k.delta));
      this.value;
    });
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
