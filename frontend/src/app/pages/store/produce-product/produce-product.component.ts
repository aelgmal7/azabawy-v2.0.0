import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { StoreService } from 'src/app/shared/services/store.service';
import { BillsService } from 'src/app/shared/services/bills.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { PeriodicElement } from '../store.component';
import { MaterialsService } from 'src/app/shared/services/materials.service';

@Component({
  selector: 'app-produce-product',
  templateUrl: './produce-product.component.html',
  styleUrls: ['./produce-product.component.css'],
})
export class ProduceProductComponent implements OnInit {
  form: FormGroup;
  materials;
  selectedMaterial;
  weights;
  selectedWeight;
  amount;
  myMaterials: addProduct[] = [];
  products;
  selectedProduct;

  constructor(
    private _fb: FormBuilder,
    private materialsService: MaterialsService,
    private productsService: StoreService
  ) {}

  get materialName(): AbstractControl {
    return this.form?.get('materialName') as AbstractControl;
  }
  get materialWeight(): AbstractControl {
    return this.form?.get('materialWeight') as AbstractControl;
  }
  get materialAmount(): AbstractControl {
    return this.form?.get('materialAmount') as AbstractControl;
  }
  get productName(): AbstractControl {
    return this.form?.get('productName') as AbstractControl;
  }
  get productWeight(): AbstractControl {
    return this.form?.get('productWeight') as AbstractControl;
  }
  get productAmount(): AbstractControl {
    return this.form?.get('productAmount') as AbstractControl;
  }

  ngOnInit() {
    this.materialsService.getAllMaterials().subscribe((mat) => {
      // let x = Object.values(mat.result);
      this.materials = mat;
      console.log(this.materials);
    });

    this.productsService.getAllProducts().subscribe((prod) => {
      let x = Object.values(prod.result);
      this.products = x[0];
      console.log(this.products);
    });

    this.form = this._fb.group({
      productName: [''],
      productWeight: [''],
      productAmount: [''],
      materialName: [''],
      materialWight: [''],
      materialAmount: [''],
    });

    this.materialName?.valueChanges.subscribe((change) => {
      this.materialsService.getAllMaterials().subscribe((mat) => {
        // const x: any[] = Object.values(prod.result);
        // const y = x[0];
        const z = mat?.filter((e) => e.id == this.materialName.value?.id);
        this.weights = z[0]?.weightAndAmounts;
        console.log(z);
      });
    });
    this.materialWeight?.valueChanges.subscribe((change) => {
      this.amount = this.materialWeight.value?.amount;
      console.log(this.amount);
      this.materialAmount.setValidators([
        Validators.max(this.amount),
        Validators.min(1),
      ]);
    });
    this.productName?.valueChanges.subscribe((change) => {
      this.productsService.getAllProducts().subscribe((prod) => {
        const x: any[] = Object.values(prod.result);
        const y = x[0];
        const z = y?.filter((e) => e.id == this.productName.value?.id);
        this.weights = z[0]?.weightAndAmounts;
        console.log(z);
      });
    });
    this.productWeight?.valueChanges.subscribe((change) => {
      this.amount = this.productWeight.value?.amount;
      console.log(this.amount);
      this.productAmount.setValidators([
        Validators.max(this.amount),
        Validators.min(1),
      ]);
    });
  }
  addProduct(name, weight, amount) {
    if (
      this.myMaterials?.filter((e) => {
        e.weight == weight;
      }).length > 0
    ) {
      if (
        this.myMaterials?.filter((e) => {
          e.name == name;
        }).length > 0
      ) {
        console.log(true);
      }
    } else {
      const prod = {} as addProduct;
      prod.name = name.productName;
      prod.weight = weight.weight;
      prod.amount = Number(amount);
      this.myMaterials?.push(prod);
      this.materialName.reset();
      this.materialWeight.reset();
      this.materialAmount.reset();
      console.log(this.myMaterials);
    }
  }
  deleteProduct(i) {
    this.myMaterials.splice(i, 1);
  }
}
export interface addProduct {
  name: string;
  weight: number;
  amount: number;
}
