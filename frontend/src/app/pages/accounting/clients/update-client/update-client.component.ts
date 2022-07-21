import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClientsService } from 'src/app/shared/services/clients.service';
import { StoreService } from 'src/app/shared/services/store.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-client',
  templateUrl: './update-client.component.html',
  styleUrls: ['./update-client.component.css'],
})
export class UpdateClientComponent implements OnInit {
  form: FormGroup;
  remainValue;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder,
    private _clientsService: ClientsService,
    private _dialogRef: MatDialogRef<UpdateClientComponent>
  ) {}

  get totalBalance(): AbstractControl {
    return this.form?.get('totalBalance') as AbstractControl;
  }
  get paid(): AbstractControl {
    return this.form?.get('paid') as AbstractControl;
  }
  get remain(): AbstractControl {
    return this.form?.get('remain') as AbstractControl;
  }

  ngOnInit() {
    this.remainValue = this.data.remain;
    this.form = this._fb.group({
      clientName: [this.data.clientName || '', Validators.required],
      totalBalance: [this.data.totalBalance || '', Validators.required],
      paid: [this.data.paid || '', Validators.required],
      remain: [this.data.remain || '', Validators.required],
    });
    this.paid.valueChanges.subscribe(() => {
      this.remainValue = this.totalBalance.value - this.paid.value;
    });
  }

  submit(form, id) {
    const prod = {
      clientName: form.controls.clientName.value,
      totalBalance: form.controls.totalBalance.value,
      paid: form.controls.paid.value,
      remain: form.controls.remain.value,
    };
    console.log(prod, id);
    this._clientsService.updateClient(prod, id).subscribe((response) => {
      console.log(response);
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
