import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vertical-navbar',
  templateUrl: './vertical-navbar.component.html',
  styleUrls: ['./vertical-navbar.component.css'],
})
export class VerticalNavbarComponent implements OnInit {
  isNavItemOpen = { accounting: false, store: false };

  constructor() {}

  ngOnInit(): void {}
}
