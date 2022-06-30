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

  ELEMENT_DATA: any[] = [
    {
      name: 'Agwa',
      kind: 'Halawa',
      supplier: 'Moataz',
      unit: 'Kg',
      limit: 20,
      price: 10,
      karateen: [
        { amount: 10, weight: 30 },
        { amount: 20, weight: 40 },
        { amount: 30, weight: 50 },
      ],
    },
  ];

  columnsToDisplay = [
    'م',
    'إسم المادة الخام',
    'إسم المورد',
    'النوع',
    'عدد الكراتين',
    'الوزن الكلي',
    'الوحدة',
    'سعر الكيلو',
    'الحد الأدنى',
    'التعديل',
  ];

  expandedElement: IMaterials | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public dialog: MatDialog) {
    this.dataSource = new MatTableDataSource();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.dataSource.data = this.ELEMENT_DATA;
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
        title: 'مسح هذه المادة',
        text: 'سوف تكون غير قادر على إعادة هذه الخطوة',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'إحذف',
        cancelButtonText: 'إلغاء',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.swalWithBootstrapButtons.fire(
            'تم المسح!',
            'تم المسح بنجاح!',
            'success'
          );
          this.ELEMENT_DATA.splice(i, 1);
          this.dataSource.data = this.ELEMENT_DATA;
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
  deleteWeight(index1, index2) {
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
          this.swalWithBootstrapButtons.fire(
            'تم المسح!',
            'تم المسح بنجاح!',
            'success'
          );
          this.ELEMENT_DATA[index1].karateen.splice(index2, 1);
          this.dataSource.data = this.ELEMENT_DATA;
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
    array.forEach((element) => {
      x += element.weight * element.amount;
    });
    return x;
  }
  totalAmount(array) {
    let x = 0;
    array.forEach((element) => {
      x += element.amount;
    });
    return x;
  }

  addAmount(val1, index1, index2) {
    this.dataSource.data[index1].karateen[index2].amount += Number(val1);
    Swal.fire('تم تعديل الكمية بنجاح!', '', 'success');
  }
  minAmount(val1, index1, index2) {
    this.dataSource.data[index1].karateen[index2].amount -= Number(val1);
    Swal.fire('تم تعديل الكمية بنجاح!', '', 'success');
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
      if (typeof result === 'object') {
        this.ELEMENT_DATA.push(result);
        this.dataSource.data = this.ELEMENT_DATA;
        Swal.fire('تم إضافة المادة الخام بنجاح!', '', 'success');
      } else {
        Swal.fire('تم الإلغاء!', '', 'error');
      }
    });
  }
  editDialog(prod, i) {
    let dialogRef = this.dialog.open(EditMaterialsComponent, {
      width: '600px',
      data: prod,
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(typeof result);
      if (typeof result === 'object') {
        this.ELEMENT_DATA.splice(i, 1, result);
        this.dataSource.data = this.ELEMENT_DATA;
        Swal.fire('تم تعديل المادة الخام بنجاح!', '', 'success');
      } else {
        Swal.fire('تم الإلغاء!', '', 'error');
      }
    });
  }
  addNewWeight(w, a, index1) {
    if (
      this.dataSource.data[index1].karateen.filter((e) => e.weight == w)
        .length > 0
    ) {
      this.visible = true;
    } else {
      const order = {} as kartona;
      order.amount = Number(a);
      order.weight = Number(w);
      this.dataSource.data[index1].karateen.push(order);
      Swal.fire('تم إضافة الوزن الجديد بنجاح!', '', 'success');
      this.visible = false;
      this.amount = null;
      this.weight = null;
    }
  }
}
export interface IMaterials {
  name: string;
  kind: string;
  supplier: string;
  unit: number;
  limit: number;
  price: number;
  karateen: [
    {
      amount: number;
      weight: number;
    }
  ];
}