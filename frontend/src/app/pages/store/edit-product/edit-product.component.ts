import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PeriodicElement } from '../store.component';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css'],
})
export class EditProductComponent implements OnInit {
  form: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: PeriodicElement,
    private _fb: FormBuilder
  ) {}

  ngOnInit() {
    this.form = this._fb.group({
      name: [this.data.name || '', Validators.required],
      price: [this.data.price || '', Validators.required],
      limit: [this.data.limit || '', Validators.required],
    });
  }
}
