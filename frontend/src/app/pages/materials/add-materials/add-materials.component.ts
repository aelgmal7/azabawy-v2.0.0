import { IMaterials } from './../materials.component';
import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, Observable } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { kartona } from '../../store/add-product/add-product.component';
import { MaterialsService } from 'src/app/shared/services/materials.service';
import { SuppliersService } from 'src/app/shared/services/suppliers.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-materials',
  templateUrl: './add-materials.component.html',
  styleUrls: ['./add-materials.component.css'],
})
export class AddMaterialsComponent implements OnInit {
  form: FormGroup;
  suppliers: [];
  selectedSupplier;
  karateen: any = [];

  visible: boolean = false;

  kinds = ['حلاوة', 'شوكولاته'];
  filteredOptions: Observable<string[]>;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IMaterials,
    private _fb: FormBuilder,
    private _materialsService: MaterialsService,
    private _suppliersService: SuppliersService,
    private _dialogRef: MatDialogRef<AddMaterialsComponent>
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
    this._suppliersService.getAllSuppliers().subscribe((response) => {
      console.log(response);
      const x: any[] = Object.values(response.result);
      this.suppliers = x[0];
      console.log(this.suppliers);
    });
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
    mat.materialName = form.controls.materialName?.value;
    // mat.supplierId = '45';
    mat.supplierId = form.controls.supplierId?.value.id;
    mat.alarm = form.controls.alarm?.value;
    mat.unit = form.controls.unit?.value;
    mat.kiloPrice = form.controls.kiloPrice?.value;
    mat.weightsAndAmountsMat = this.karateen;

    console.log(form);
    console.log(mat);
    this._materialsService.addNewMaterial(mat).subscribe((response) => {
      console.log(response['succeeded']);
      if (response['succeeded'] === true) {
        Swal.fire('تم إضافة المادة الخام بنجاح!', '', 'success');
        this._dialogRef.close();
      } else {
        Swal.fire(
          'لم يتم حفظ المادة الخام!',
          Object.values(response)[0],
          'error'
        );
      }
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
