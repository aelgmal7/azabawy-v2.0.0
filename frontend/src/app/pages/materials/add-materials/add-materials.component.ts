import { IMaterials } from './../materials.component';
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
import { kartona } from '../../store/add-product/add-product.component';
@Component({
  selector: 'app-add-materials',
  templateUrl: './add-materials.component.html',
  styleUrls: ['./add-materials.component.css'],
})
export class AddMaterialsComponent implements OnInit {
  form: FormGroup;

  karateen: any = [];

  visible: boolean = false;

  kinds = ['حلاوة', 'شوكولاته'];
  filteredOptions: Observable<string[]>;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IMaterials,
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

  ngOnInit() {
    this.form = this._fb.group({
      name: ['', Validators.required],
      supplier: ['', Validators.required],
      kind: ['', Validators.required],
      limit: ['', Validators.required],
      unit: ['', Validators.required],
      price: ['', Validators.required],
      weight1: [''],
      amount1: [''],
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
