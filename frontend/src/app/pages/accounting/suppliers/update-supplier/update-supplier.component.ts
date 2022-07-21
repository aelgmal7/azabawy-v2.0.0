import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SuppliersService } from 'src/app/shared/services/suppliers.service';
import Swal from 'sweetalert2';
import { NewSupplier } from '../add-supplier/add-supplier.component';

@Component({
  selector: 'app-update-supplier',
  templateUrl: './update-supplier.component.html',
  styleUrls: ['./update-supplier.component.css'],
})
export class UpdateSupplierComponent implements OnInit {
  form: FormGroup;
  total;
  paid;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder,
    private _suppliersService: SuppliersService,
    private _dialogRef: MatDialogRef<UpdateSupplierComponent>
  ) {}

  ngOnInit() {
    this.paid <= this.total;
    this.form = this._fb.group({
      supplierName: ['', Validators.required],
      totalBalance: ['', Validators.required],
      paid: ['', [Validators.required, Validators.max(this.total)]],
    });
  }

  submit(form, id) {
    const supplier = {} as NewSupplier;
    supplier.supplierName = form.controls.supplierName.value;
    supplier.totalBalance = form.controls.totalBalance.value;
    supplier.paid = form.controls.paid.value;

    console.log(supplier, id);
    this._suppliersService
      .updateSupplier(supplier, id)
      .subscribe((response) => {
        console.log(response);
        if (Object.values(response)[0] == true) {
          Swal.fire('تم تعديل المورد بنجاح!', '', 'success');
          this._dialogRef.close();
        } else {
          Swal.fire(
            'لم يتم تعديل المورد!',
            Object.values(response)[1].message,
            'error'
          );
        }
      });
  }
}
