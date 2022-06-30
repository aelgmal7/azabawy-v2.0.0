import { IMaterials } from './../materials.component';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-edit-materials',
  templateUrl: './edit-materials.component.html',
  styleUrls: ['./edit-materials.component.css'],
})
export class EditMaterialsComponent implements OnInit {
  form: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IMaterials,
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
