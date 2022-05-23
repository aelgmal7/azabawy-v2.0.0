import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-icon-btn',
  templateUrl: './icon-btn.component.html',
  styleUrls: ['./icon-btn.component.css'],
})
export class IconBtnComponent implements OnInit {
  @Input() btn!: { text: string; iconClasses: string; activeState: boolean };

  constructor() {}

  ngOnInit(): void {}
}
