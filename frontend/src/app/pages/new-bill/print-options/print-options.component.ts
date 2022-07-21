import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-print-options',
  templateUrl: './print-options.component.html',
  styleUrls: ['./print-options.component.css'],
})
export class PrintOptionsComponent implements OnInit {
  options = [
    {
      id: 1,
      option: 'مسعرة فقط',
    },
    {
      id: 2,
      option: 'رقم ضريبي فقط',
    },
    {
      id: 3,
      option: 'مسعرة مع رقم ضريبي',
    },
    {
      id: 4,
      option: 'غير مسعرة وبدون رقم ضريبي',
    },
  ];

  constructor(@Inject(MAT_DIALOG_DATA) public data: number) {}

  ngOnInit() {}
}
