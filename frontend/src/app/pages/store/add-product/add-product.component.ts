import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, Observable } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { PeriodicElement } from '../store.component';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
})
export class AddProductComponent implements OnInit {
  form: FormGroup;

  karateen: any = [];

  visible: boolean = false;

  kinds = ['حلاوة', 'شوكولاته'];
  filteredOptions: Observable<string[]>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: PeriodicElement,
    private _fb: FormBuilder
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
    this.form = this._fb.group({
      name: ['', Validators.required],
      kind: ['', Validators.required],
      limit: ['', Validators.required],
      price: ['', Validators.required],
      weight1: [''],
      amount1: [''],
    });
    // this.form.valueChanges.subscribe((change) => {
    //   this.form.controls['name'].status &&
    //   this.form.controls['kind'].status &&
    //   this.form.controls['limit'].status &&
    //   this.form.controls['price'].status === 'VALID'
    //     ? (this.valid = true)
    //     : (this.valid = false);
    // });

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
    if (this.karateen.filter((e) => e.weight == w).length > 0) {
      this.visible = true;
    } else {
      const order = {} as kartona;
      order.amount = Number(a);
      order.weight = Number(w);
      this.karateen.push(order);
      this.amount.reset();
      this.weight.reset();
      this.data.karateen = this.karateen;
      this.visible = false;
      document.getElementById('kartona')?.scrollIntoView();
    }
    console.log(this.karateen);
  }
  deleteWeight(i) {
    this.karateen.splice(i, 1);
  }
}
export interface kartona {
  amount: number;
  weight: number;
}
