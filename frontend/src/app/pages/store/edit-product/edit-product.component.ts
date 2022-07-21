import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StoreService } from 'src/app/shared/services/store.service';
import { PeriodicElement } from '../store.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css'],
})
export class EditProductComponent implements OnInit {
  form: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: PeriodicElement,
    private _fb: FormBuilder,
    private _storeService: StoreService,
    private _dialogRef: MatDialogRef<EditProductComponent>
  ) {}

  ngOnInit() {
    this.form = this._fb.group({
      name: [this.data.productName || '', Validators.required],
      price: [this.data.kiloPrice || '', Validators.required],
      limit: [this.data.alarm || '', Validators.required],
    });
  }

  submit(form, id) {
    const prod = {
      productName: form.controls.name.value,
      alarm: form.controls.limit.value,
      kiloPrice: form.controls.price.value,
    };

    console.log(prod, id);
    this._storeService.updateProduct(id, prod).subscribe((response) => {
      console.log(response);
      console.log(Object.values(response)[1].message);
      if (Object.values(response)[0] == true) {
        Swal.fire('تم تعديل المنتج بنجاح!', '', 'success');
        this._dialogRef.close();
      } else {
        Swal.fire(
          'لم يتم تعديل المنتج!',
          Object.values(response)[1].message,
          'error'
        );
      }
    });
  }
}
export interface IUpdateProduct {
  productName: string;
  alarm: number;
  kiloPrice: number;
}
