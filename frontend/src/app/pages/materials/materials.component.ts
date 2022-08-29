import { EditMaterialsComponent } from './edit-materials/edit-materials.component';
import { AddMaterialsComponent } from './add-materials/add-materials.component';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { kartona } from '../store/add-product/add-product.component';
import { MaterialsService } from 'src/app/shared/services/materials.service';
import { SuppliersService } from 'src/app/shared/services/suppliers.service';
@Component({
  selector: 'app-materials',
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class MaterialsComponent implements OnInit {
  dataSource: MatTableDataSource<IMaterials>;

  weight;
  amount;

  swalWithBootstrapButtons;
  visible: boolean = false;

  ELEMENT_DATA: IMaterials[] = [
    {
      id: 5,
      materialName: 'Agwa',
      supplierId: 5,
      supplierName: 'Moataz Handy',
      unit: 'Kg',
      alarm: 202,
      kiloPrice: 10,
      weightsAndAmountsMat: [{ w: 320, a: 10 }],
    },
    {
      id: 5,

      materialName: 'Agwa2',
      supplierId: 5,
      supplierName: 'Moataz Handy',
      unit: 'Kg',
      alarm: 20,
      kiloPrice: 104,
      weightsAndAmountsMat: [{ w: 30, a: 140 }],
    },
  ];

  columnsToDisplay = [
    'id',
    'materialName',
    'supplierName',
    'amount',
    'totalWeight',
    'unit',
    'kiloPrice',
    'alarm',
    'actions',
  ];

  expandedElement: IMaterials | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public dialog: MatDialog,
    private _materialsService: MaterialsService
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this._materialsService.getAllMaterials().subscribe((response) => {
      console.log(response);
      this.dataSource.data = response;
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteMaterial(i) {
    this.swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
    });

    this.swalWithBootstrapButtons
      .fire({
        title: 'مسح هذه المادة الخام؟',
        text: 'سوف تكون غير قادر على إعادة هذه الخطوة',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'إحذف',
        cancelButtonText: 'إلغاء',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this._materialsService.deleteMaterial(i).subscribe((response) => {
            console.log(response);
            if (Object.values(response)[0] === true) {
              this.swalWithBootstrapButtons.fire(
                'تم المسح!',
                'تم المسح بنجاح!',
                'success'
              );
              this._materialsService.getAllMaterials().subscribe((response) => {
                this.dataSource.data = response;
              });
            } else {
              this.swalWithBootstrapButtons.fire('لم يتم المسح!', '', 'error');
            }
          });
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          this.swalWithBootstrapButtons.fire(
            'تم الإلغاء',
            'هذه المادة لم يتم مسحه :)',
            'error'
          );
        }
      });
  }
  deleteWeight(id, weight) {
    this.swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
    });

    this.swalWithBootstrapButtons
      .fire({
        title: 'مسح هذا الوزن؟',
        text: 'سوف تكون غير قادر على إعادة هذه الخطوة',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'إحذف',
        cancelButtonText: 'إلغاء',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this._materialsService
            .deleteWeight(id, weight)
            .subscribe((response) => {
              console.log(response['succeeded'] == true);
              if (response['succeeded'] == true) {
                this.swalWithBootstrapButtons.fire(
                  'تم المسح!',
                  'تم مسح الوزن بنجاح!',
                  'success'
                );
                this._materialsService.getAllMaterials().subscribe((prod) => {
                  this.dataSource.data = prod;
                });
              } else {
                this.swalWithBootstrapButtons.fire(
                  'لم يتم المسح!',
                  '',
                  'error'
                );
              }
            });
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          this.swalWithBootstrapButtons.fire(
            'تم الإلغاء',
            'هذا المنتج لم يتم مسحه :)',
            'error'
          );
        }
      });
  }

  totalWeight(array) {
    let x = 0;
    array?.forEach((element) => {
      x += element.w * element.a;
    });
    return x;
  }
  totalAmount(array) {
    let x = 0;
    array?.forEach((element) => {
      x += element.a;
    });
    return x;
  }

  updateAmountAdd(amount, weight, id) {
    amount = Number(amount);
    console.log('Weight:', weight, 'Amount:', amount, 'ID:', id);
    if (amount > 0) {
      this._materialsService
        .updateAmount(id, amount, weight)
        .subscribe((response) => {
          console.log(response);
          if (Object.values(response)[0] == true) {
            Swal.fire('تم تعديل الكمية بنجاح!', '', 'success');
            this._materialsService.getAllMaterials().subscribe((response) => {
              this.dataSource.data = response;
            });
          } else {
            Swal.fire(
              'لم يتم تعديل الكمية!',
              response['result'].result.message,
              'error'
            );
          }
        });
    } else {
      Swal.fire('أدخل الكمية من فضلك !', '', 'error');
    }
  }
  updateAmountMin(amount, weight, id) {
    amount = Number(amount);
    if (amount > 0) {
      amount = -amount;
      console.log('Weight:', weight, 'Amount:', amount, 'ID:', id);
      this._materialsService
        .updateAmount(id, amount, weight)
        .subscribe((response) => {
          console.log(response);
          if (Object.values(response)[0] == true) {
            Swal.fire('تم تعديل الكمية بنجاح!', '', 'success');
            this._materialsService.getAllMaterials().subscribe((response) => {
              this.dataSource.data = response;
            });
          } else {
            Swal.fire(
              'لم يتم تعديل الكمية!',
              response['result'].result.message,
              'error'
            );
          }
        });
    } else {
      Swal.fire('أدخل الكمية من فضلك !', '', 'error');
    }
  }
  addDialog() {
    let dialogRef = this.dialog.open(AddMaterialsComponent, {
      width: '800px',
      data: {
        name: null,
        supplier: null,
        unit: null,
        kind: null,
        limit: null,
        price: null,
        karateen: [{}],
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      this._materialsService.getAllMaterials().subscribe((response) => {
        console.log(response);
        this.dataSource.data = response;
      });
      // if (typeof result === 'object') {
      //   this.ELEMENT_DATA.push(result);
      //   this.dataSource.data = this.ELEMENT_DATA;
      //   Swal.fire('تم إضافة المادة الخام بنجاح!', '', 'success');
      // } else {
      //   Swal.fire({
      //     position: 'center',
      //     icon: 'error',
      //     title: 'تم الإلغاء!',
      //     showConfirmButton: false,
      //     timer: 800,
      //   });
      // }
    });
  }
  editDialog(prod, i) {
    let dialogRef = this.dialog.open(EditMaterialsComponent, {
      width: '600px',
      data: prod,
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(typeof result);
      this._materialsService.getAllMaterials().subscribe((response) => {
        console.log(response);
        this.dataSource.data = response;
      });
      // if (typeof result === 'object') {
      //   this.ELEMENT_DATA.splice(i, 1, result);
      //   this.dataSource.data = this.ELEMENT_DATA;
      //   Swal.fire('تم تعديل المادة الخام بنجاح!', '', 'success');
      // } else {
      //   Swal.fire({
      //     position: 'center',
      //     icon: 'error',
      //     title: 'تم الإلغاء!',
      //     showConfirmButton: false,
      //     timer: 800,
      //   });
      // }
    });
  }
  addNewWeight(w, a, index1) {
    if (
      this.dataSource.data[index1].weightsAndAmountsMat.filter((e) => e.w == w)
        .length > 0
    ) {
      this.visible = true;
    } else {
      const order = {} as kartona;
      order.a = Number(a);
      order.w = Number(w);
      this.dataSource.data[index1].weightsAndAmountsMat.push(order);
      Swal.fire('تم إضافة الوزن الجديد بنجاح!', '', 'success');
      this.visible = false;
      this.amount = null;
      this.weight = null;
    }
  }
}
export interface IMaterials {
  id: number;
  materialName: string;
  supplierId: number;
  supplierName: string;
  unit: string;
  alarm: number;
  kiloPrice: number;
  weightsAndAmountsMat: [
    {
      w: number;
      a: number;
    }
  ];
}
