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
  materialWeights;
  materialSelectedWeight;
  productWeights;
  productSelectedWeight;
  amount;
  myMaterials: addMaterial[] = [];
  products;
  selectedProduct;
  addProductWeights: addProductWeights[] = [];
  productInfo: addProduct;

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
      materialWeight: [''],
      materialAmount: [''],
    });

    this.materialName?.valueChanges.subscribe((change) => {
      this.materialsService.getAllMaterials().subscribe((mat) => {
        // const x: any[] = Object.values(prod.result);
        // const y = x[0];
        const z = mat?.filter((e) => e.id == this.materialName.value?.id);
        this.materialWeights = z[0]?.weightAndAmountMats;
        console.log(this.materialWeights);
      });
    });
    this.materialWeight?.valueChanges.subscribe((change) => {
      this.amount = this.materialWeight.value?.a;
      console.log(this.amount);
      this.materialAmount.setValidators([
        Validators.max(this.amount),
        Validators.min(1),
      ]);
    });
    this.productName?.valueChanges.subscribe((change) => {
      this.addProductWeights = [];
      this.addProductWeights = [];
      this.productsService.getAllProducts().subscribe((prod) => {
        const x: any[] = Object.values(prod.result);
        const y = x[0];
        const z = y?.filter((e) => e.id == this.productName.value?.id);
        this.productWeights = z[0]?.weightAndAmounts;
        console.log(z);
      });
    });
  }
  addMaterial(name, weight, amount) {
    // if (
    //   this.myMaterials?.filter((e) => {
    //     e.weight == weight;
    //   }).length > 0
    // ) {
    //   if (
    //     this.myMaterials?.filter((e) => {
    //       e.name == name;
    //     }).length > 0
    //   ) {
    //     console.log(true);
    //   }
    // } else {
    // }
    const mat = {} as addMaterial;
    mat.id = name.id;
    mat.materialName = name.materialName;
    mat.weightId = weight.id;
    mat.weight = weight.w;
    mat.amount = Number(amount);
    this.myMaterials?.push(mat);
    this.materialName.reset();
    this.materialWeight.reset();
    this.materialAmount.reset();
    console.log(this.myMaterials);
  }
  deleteMaterial(i) {
    this.myMaterials.splice(i, 1);
  }
  addProduct(name, weight, amount) {
    const weights = {} as addProductWeights;
    weights.weight = weight.weight;
    weights.amount = amount;
    this.addProductWeights?.push(weights);
    this.productWeight.reset();
    this.productAmount.reset();
    this.productInfo = {
      id: name.id,
      productName: name.productName,
      weightsAndAmounts: this.addProductWeights,
    };
  }
  deleteProduct(i) {
    this.addProductWeights.splice(i, 1);
  }
  submit() {
    const obj = {
      materialInfo: this.myMaterials,
      productInfo: this.productInfo,
    };
    console.log(obj);
  }
}
export interface addMaterial {
  id: string;
  materialName: string;
  weightId: number;
  weight: number;
  amount: number;
}
export interface addProduct {
  id: number;
  productName: string;
  weightsAndAmounts: addProductWeights[];
}
export interface addProductWeights {
  weight: number;
  amount: number;
}
