import { IMaterials } from './../materials.component';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialsService } from 'src/app/shared/services/materials.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-materials',
  templateUrl: './edit-materials.component.html',
  styleUrls: ['./edit-materials.component.css'],
})
export class EditMaterialsComponent implements OnInit {
  form: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IMaterials,
    private _fb: FormBuilder,
    private materialsService: MaterialsService,
    private _dialogRef: MatDialogRef<EditMaterialsComponent>
  ) {}

  ngOnInit() {
    this.form = this._fb.group({
      name: [this.data.materialName || '', Validators.required],
      price: [this.data.kiloPrice || '', Validators.required],
      limit: [this.data.alarm || '', Validators.required],
    });
  }

  submit(form, id) {
    const prod = {
      materialName: form.controls.name.value,
      alarm: form.controls.limit.value,
      kiloPrice: form.controls.price.value,
    };

    console.log(prod, id);
    this.materialsService.updateMaterial(id, prod).subscribe((response) => {
      console.log(response);
      if (Object.values(response)[0] == true) {
        Swal.fire('تم تعديل المنتج بنجاح!', '', 'success');
        this._dialogRef.close();
      } else {
        Swal.fire(
          'لم يتم تعديل المنتج!',
          response['result'].result.message,
          'error'
        );
      }
    });
  }
}
