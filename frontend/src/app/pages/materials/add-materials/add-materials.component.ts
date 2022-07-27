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
import { MaterialsService } from 'src/app/shared/services/materials.service';
import { response } from 'express';
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
    private _fb: FormBuilder,
    private _materialsService: MaterialsService
  ) {}

  get type(): AbstractControl {
    return this.form?.get('type') as AbstractControl;
  }
  get weight(): AbstractControl {
    return this.form?.get('weight1') as AbstractControl;
  }
  get amount(): AbstractControl {
    return this.form?.get('amount1') as AbstractControl;
  }

  ngOnInit() {
    this.form = this._fb.group({
      materialName: ['', Validators.required],
      supplierId: ['', Validators.required],
      alarm: ['', Validators.required],
      unit: ['', Validators.required],
      kiloPrice: ['', Validators.required],
      weight1: [''],
      amount1: [''],
    });

    this.filteredOptions = this.type?.valueChanges.pipe(
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
      order.a = Number(a);
      order.w = Number(w);
      this.karateen.push(order);
      this.amount.reset();
      this.weight.reset();
      this.data.weightsAndAmountsMat = this.karateen;
      this.visible = false;
      document.getElementById('kartona')?.scrollIntoView();
    }
    console.log(this.karateen);
  }
  deleteWeight(i) {
    this.karateen.splice(i, 1);
  }

  submit(form) {
    const mat = {} as IMaterials;
    mat.materialName = form.controls.name.value;
    mat.supplierId = form.controls.supplier.value;
    mat.alarm = form.controls.limit.value;
    mat.unit = form.controls.unit.value;
    mat.kiloPrice = form.controls.price.value;
    mat.weightsAndAmountsMat = this.karateen;

    console.log(mat);
    this._materialsService.addNewMaterial(mat).subscribe((response) => {
      console.log(response);
    });
    // this._storeService.addNewProduct(prod).subscribe((response) => {
    //   console.log(response);
    //   if (Object.keys(response)[0] === '0') {
    //     Swal.fire('تم إضافة المنتج بنجاح!', '', 'success');
    //     this._dialogRef.close();
    //   } else {
    //     Swal.fire('لم يتم حفظ المنتج!', Object.values(response)[0], 'error');
    //   }
    // });
  }
}
