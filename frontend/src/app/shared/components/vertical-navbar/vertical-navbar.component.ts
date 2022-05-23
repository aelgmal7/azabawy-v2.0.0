import { Component, OnInit } from '@angular/core';
import { navLink } from '../../types/nav-link.t';
import { NavigationEnd, Router, Event } from '@angular/router';
import { filter, map, Observable } from 'rxjs';

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
      link: '/.',
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
          link: '/1',
        },
        {
          text: '|-- العملاء',
          link: '/2',
        },
        {
          text: '|-- الخزنة',
          link: '/3',
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
          link: '/4',
        },
        {
          text: '|-- المنتجات بالمخزن',
          link: '/5',
        },
        {
          text: '|-- سجل المخزن',
          link: '/6',
        },
        {
          text: 'الكل',
          link: 'store',
        },
      ],
    },
  ];

  constructor(private router: Router) {
    // const x = this.router.events
    //   .pipe(filter((event) => event instanceof NavigationEnd))
    //   .subscribe((event) => {
    //     if (event instanceof NavigationEnd) this.checkExpandableNavItem(url);
    //   });
    // .filter((event) => event instanceof NavigationEnd)
    // x;
  }

  ngOnInit(): void {}

  // checkExpandableNavItem(url:string){
  //   const link = this.navLinks.reduce((acc,navLink)=>{
  //    const isHavingChildren = navLink.children
  //    if(!isHavingChildren) return acc
  //    navLink.children
  //   },null)
  // }

  toggleExpandableNavItem(link: navLink) {
    // this.checkRoute();
    // if link is in its children return
    if (!link.isNavItemOpen) return;
    // toggle its data
    this.isNavItemOpen[link.isNavItemOpen] =
      !this.isNavItemOpen[link.isNavItemOpen];
  }
}
