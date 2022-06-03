import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Product, BillType } from './types/types.t';

@Component({
  selector: 'app-new-bill',
  templateUrl: './new-bill.component.html',
  styleUrls: ['./new-bill.component.css'],
})
export class NewBillComponent implements OnInit {
  billType!: BillType;
  screenInView: 1 | 2 = 1;
  @ViewChild('billForm') billForm!: ElementRef;
  firstScreen = true;
  lastScreen = false;

  products = [
    { id: 'h-550', name: 'حمصية' },
    { id: 'a-220', name: 'سودانية' },
    { id: 'm-40', name: 'مشمشية' },
    { id: 'a-100', name: 'عسلية' },
  ];

  billRows: Product[] = [];

  tinOrKilo: 'tin' | 'kilo' = 'kilo';

  totalPrice = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  addProduct(
    productId: string,
    packagesNumber: number | string,
    packageWeight: number | string,
    kiloPrice: number | string
  ) {
    const filledProduct: Product = {
      productId,
      productName: this.products.filter((prod) => prod.id === productId)[0]
        .name,
      packagesNumber: parseFloat(packagesNumber as unknown as string),
      packageWeight: parseFloat(packageWeight as unknown as string),
      kiloPrice: parseFloat(kiloPrice as unknown as string),
      tinOrKilo: this.tinOrKilo === 'tin' ? 1000 : 1,
    };

    this.billRows.push(filledProduct);

    this.totalPrice +=
      filledProduct.kiloPrice *
      filledProduct.packagesNumber *
      filledProduct.packageWeight *
      filledProduct.tinOrKilo;

    console.log(this.billRows);
  }

  updateBillType(type: BillType) {
    this.billType = type;
  }

  showForm(direction: 'back' | 'next') {
    const billFormWidth = this.billForm.nativeElement.offsetWidth;
    const lastRight = parseInt(this.billForm.nativeElement.style.right) || 0;

    const numberOfFormScreens = 3;

    const margins = { min: 0, max: billFormWidth * numberOfFormScreens };

    if (direction === 'next') {
      this.firstScreen = false;
      if (this.lastScreen) {
        this.saveForm();
        return;
      }
      this.billForm.nativeElement.style.right = `${
        lastRight - billFormWidth
      }px`;
      if (
        -1 * (lastRight - billFormWidth) >=
        billFormWidth * (numberOfFormScreens - 1)
      )
        this.lastScreen = true;
    } else {
      this.lastScreen = false;

      if (this.firstScreen) return;
      this.billForm.nativeElement.style.right = `${
        lastRight + billFormWidth * (numberOfFormScreens - 2)
      }px`;
      if (-1 * lastRight <= 0 + billFormWidth) this.firstScreen = true;
    }

    console.log(this.firstScreen, this.lastScreen);
  }

  saveForm() {
    this.router.navigate(['.']);
  }
}
