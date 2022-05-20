import { Component, OnInit } from '@angular/core';
import { navLink } from '../../types/nav-link.t';

@Component({
  selector: 'app-vertical-navbar',
  templateUrl: './vertical-navbar.component.html',
  styleUrls: ['./vertical-navbar.component.css'],
})
export class VerticalNavbarComponent implements OnInit {
  isNavItemOpen = { accounting: false, store: false };

  navLinks: navLink[] = [
    {
      text: 'الرئيسية',
      link: '.',
    },
    {
      text: 'فاتورة جديدة',
      link: '/new-bill',
    },
    {
      text: 'عملية على الخزنة',
      link: '/new-operation',
    },
    {
      text: 'إدارة الطلبيات',
      link: '/orders-management',
    },
    {
      text: 'الحسابات',
      isNavItemOpen: 'accounting',
      children: [
        {
          text: '|-- سجل المعاملات',
          link: '',
        },
        {
          text: '|-- العملاء',
          link: '',
        },
        {
          text: '|-- الخزنة',
          link: '',
        },
        {
          text: 'الكل',
          link: './accounting',
        },
      ],
    },
    {
      text: 'المخزن',
      isNavItemOpen: 'store',
      children: [
        {
          text: '|-- المواد الخام',
          link: '',
        },
        {
          text: '|-- المنتجات بالمخزن',
          link: '',
        },
        {
          text: '|-- سجل المخزن',
          link: '',
        },
        {
          text: 'الكل',
          link: './store',
        },
      ],
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
