import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-operation',
  templateUrl: './new-operation.component.html',
  styleUrls: ['./new-operation.component.css'],
})
export class NewOperationComponent implements OnInit {
  constructor(private router: Router) {}

  operationData!: {
    type?: 'fromUsToThem' | 'fromThemToUs' | '';
    typeOfType?: 'tash8eel' | 'bill' | 'direct-operation' | '';
  };

  ngOnInit(): void {}

  showInnerBranches(operationType: 'fromUsToThem' | 'fromThemToUs') {
    if (this.operationData && this.operationData?.type) {
      this.operationData.type = '';
    }
    this.operationData = { type: operationType };

    console.log(this.operationData);
  }

  showForm(operationTypeOfType: 'tash8eel' | 'bill' | 'direct-operation' | '') {
    if (
      this.operationData?.typeOfType &&
      this.operationData?.typeOfType === operationTypeOfType
    ) {
      this.operationData.type = '';
    }
    this.operationData = {
      ...this.operationData,
      typeOfType: operationTypeOfType,
    };

    console.log(this.operationData);
  }

  saveForm() {
    this.router.navigate(['.']);
  }
}
