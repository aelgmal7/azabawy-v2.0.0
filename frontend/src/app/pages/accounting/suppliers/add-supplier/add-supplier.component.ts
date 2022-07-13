import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

import { MatDialogRef } from '@angular/material/dialog';
import { ClientsService } from 'src/app/shared/services/clients.service';
import { SuppliersService } from 'src/app/shared/services/suppliers.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-supplier',
  templateUrl: './add-supplier.component.html',
  styleUrls: ['./add-supplier.component.css'],
})
export class AddSupplierComponent implements OnInit {
  form: FormGroup;
  total;
  paid;

  constructor(
    private _fb: FormBuilder,
    private _suppliersService: SuppliersService,
    private _dialogRef: MatDialogRef<AddSupplierComponent>
  ) {}

  ngOnInit() {
    this.paid <= this.total;
    this.form = this._fb.group({
      supplierName: ['', Validators.required],
      totalBalance: ['', Validators.required],
      paid: ['', [Validators.required, Validators.max(this.total)]],
    });
  }

  submit(form) {
    const supplier = {} as NewSupplier;
    supplier.supplierName = form.controls.supplierName.value;
    supplier.totalBalance = form.controls.totalBalance.value;
    supplier.paid = form.controls.paid.value;

    console.log(supplier);
    this._suppliersService.addNewSupplier(supplier).subscribe((response) => {
      console.log(response);
      if (typeof response === 'object') {
        Swal.fire('تم إضافة المورد بنجاح!', '', 'success');
        this._dialogRef.close();
      } else {
        Swal.fire('لم يتم حفظ المورد!', '', 'error');
      }
    });
  }
}
export interface NewClient {
  clientName: string;
  totalBalance: number;
  paid: number;
  remain: number;
}
export interface NewSupplier {
  supplierName: string;
  totalBalance: number;
  paid: number;
}
