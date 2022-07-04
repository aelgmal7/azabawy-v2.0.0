import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

import { MatDialogRef } from '@angular/material/dialog';
import { map, Observable } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { StoreService } from 'src/app/shared/services/store.service';
import { PeriodicElement } from '../store.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
})
export class AddProductComponent implements OnInit {
  form: FormGroup;

  karateen: kartona2[] = [];

  visible: boolean = false;

  kinds = ['حلاوة', 'شوكولاته'];
  filteredOptions: Observable<string[]>;

  constructor(
    private _fb: FormBuilder,
    private _storeService: StoreService,
    private _dialogRef: MatDialogRef<AddProductComponent>
  ) {}

  get kind(): AbstractControl {
    return this.form?.get('kind') as AbstractControl;
  }
  get weight(): AbstractControl {
    return this.form?.get('weight1') as AbstractControl;
  }
  get amount(): AbstractControl {
    return this.form?.get('amount1') as AbstractControl;
  }

  ngAfterViewInit() {}

  ngOnInit() {
    console.log(this.kinds);

    this.form = this._fb.group({
      name: ['', Validators.required],
      kind: ['', Validators.required],
      limit: ['', Validators.required],
      price: ['', Validators.required],
      weight1: [''],
      amount1: [''],
    });
    this.form.valueChanges.subscribe((change) => {
      // console.log(change);
    });

    this.filteredOptions = this.kind.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.kinds.filter((kind) =>
      kind.toLowerCase().includes(filterValue)
    );
  }

  addWeight(w, a) {
    if (this.karateen.filter((e) => e.w == w).length > 0) {
      this.visible = true;
    } else {
      const order = {} as kartona2;
      order.w = Number(w);
      order.a = Number(a);
      this.karateen.push(order);
      this.amount.reset();
      this.weight.reset();
      this.visible = false;
      document.getElementById('kartona')?.scrollIntoView();
    }
    console.log(this.karateen);
  }
  deleteWeight(i) {
    this.karateen.splice(i, 1);
  }

  submit(form) {
    const prod = {
      productName: form.controls.name.value,
      kiloPrice: form.controls.price.value,
      alarm: form.controls.limit.value,
      weightsAndAmounts: this.karateen,
    };

    console.log(prod);
    this._storeService.addNewProduct(prod).subscribe((response) => {
      console.log(response);
      if (Object.keys(response)[0] === '0') {
        Swal.fire('تم إضافة المنتج بنجاح!', '', 'success');
        this._dialogRef.close();
      } else {
        Swal.fire('لم يتم حفظ المنتج!', Object.values(response)[0], 'error');
      }
    });
  }
}
export interface kartona {
  amount: number;
  createdAt: string;
  enabled: boolean;
  id: number;
  productId: number;
  productName: string;
  updatedAt: string;
  weight: number;
}
export interface kartona2 {
  w: number;
  a: number;
  createdAt: string;
  enabled: boolean;
  id: number;
  productId: number;
  productName: string;
  updatedAt: string;
}

export interface INewProduct {
  productName: string;
  weightsAndAmounts: kartona2[];
  kiloPrice: Number;
  alarm: Number;
}
export interface INewWeight {
  amount: number;
  weight: number;
}
