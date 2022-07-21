import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-print-options',
  templateUrl: './print-options.component.html',
  styleUrls: ['./print-options.component.css'],
})
export class PrintOptionsComponent implements OnInit {
  form: FormGroup;

  options = [
    {
      id: 1,
      option: 'طباعة الاوبشن 1',
    },
    {
      id: 2,
      option: 'طباعة الاوبشن 2',
    },
    {
      id: 3,
      option: 'طباعة الاوبشن 3',
    },
    {
      id: 4,
      option: 'طباعة الاوبشن 4',
    },
  ];

  // get optionName(): AbstractControl {
  //   return this.form?.get('optionName') as AbstractControl;
  // }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: number,
    private _fb: FormBuilder
  ) {}

  ngOnInit() {
    // this.form = this._fb.group({
    //   optionName: ['', Validators.required],
    // });
    // this.optionName.valueChanges.subscribe((change) => {
    //   console.log(this.optionName.value);
    // });
    // this.data = this.optionName.value;
  }
}
