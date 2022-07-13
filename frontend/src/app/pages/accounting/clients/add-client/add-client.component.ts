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

  constructor(
    private _fb: FormBuilder,
    private _clientsService: ClientsService,
    private _dialogRef: MatDialogRef<AddClientComponent>
  ) {}

  ngOnInit() {
    this.form = this._fb.group({
      clientName: ['', Validators.required],
      totalBalance: ['', Validators.required],
      paid: ['', Validators.required],
      remain: ['', Validators.required],
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
