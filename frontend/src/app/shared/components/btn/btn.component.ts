import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-btn',
  templateUrl: './btn.component.html',
  styleUrls: ['./btn.component.css'],
})
export class BtnComponent implements OnInit {
  @Input() btn!: {
    text: string;
    classes: string;
    iconClasses?: string;
    reverse?: boolean;
  };

  constructor() {}

  ngOnInit(): void {}
}
