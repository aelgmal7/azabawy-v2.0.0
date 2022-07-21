import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

import { MatDialogRef } from '@angular/material/dialog';
import { ClientsService } from 'src/app/shared/services/clients.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.css'],
})
export class AddClientComponent implements OnInit {
  form: FormGroup;
  remainValue;

  constructor(
    private _fb: FormBuilder,
    private _clientsService: ClientsService,
    private _dialogRef: MatDialogRef<AddClientComponent>
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
    this.form = this._fb.group({
      clientName: ['', Validators.required],
      totalBalance: ['', Validators.required],
      paid: ['', Validators.required],
      remain: ['', Validators.required],
    });
    this.paid.valueChanges.subscribe(() => {
      this.remainValue = this.totalBalance.value - this.paid.value;
    });
  }

  submit(form) {
    const client = {} as NewClient;
    client.clientName = form.controls.clientName.value;
    client.totalBalance = form.controls.totalBalance.value;
    client.paid = form.controls.paid.value;
    client.remain = form.controls.remain.value;

    console.log(client);
    this._clientsService.addNewClient(client).subscribe((response) => {
      console.log(response);
      if (typeof response === 'object') {
        Swal.fire('تم إضافة العميل بنجاح!', '', 'success');
        this._dialogRef.close();
      } else {
        Swal.fire('لم يتم حفظ العميل!', '', 'error');
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
