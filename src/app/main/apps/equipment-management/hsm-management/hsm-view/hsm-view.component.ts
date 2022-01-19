import { FormArray } from '@angular/forms';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HsmService } from '../hsm.service';
import { Token } from 'app/main/models/Equipment';
import { PagedData } from 'app/main/models/PagedData';
import {
  ColumnMode,
  DatatableComponent,
  SelectionType,
} from '@swimlane/ngx-datatable';
@Component({
  selector: 'app-hsm-view',
  templateUrl: './hsm-view.component.html',
  styleUrls: ['./hsm-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HsmViewComponent implements OnInit {
  public isLoading: boolean = false;
  public rowsData = new Array<Token>();
  public pagedData = new PagedData<Token>();
  private _unsubscribeAll: Subject<any>;
  public url = this.router.url;
  public HsmFormView: FormGroup;
  public HSMname: string;
  public lastValue;
  public contentHeader: object;
  public submitted = false;
  public hsmType: any[] = ['NET', 'PCI'];
  public hsmForm: any[] = ['FIPS', 'PC5'];
  public ColumnMode = ColumnMode;
  tokens: any[] = [];
  hsmTokenList;
  get f() {
    return this.HsmFormView.controls;
  }

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private _hsmService: HsmService,
    private toastr: ToastrService
  ) {
    this._unsubscribeAll = new Subject();
    this.lastValue = this.url.substr(this.url.lastIndexOf('/') + 1);
    console.log(this.lastValue);
    this.HsmFormView = this.formBuilder.group({
      hsmName: [null, Validators.required],
      hardwareId: [null, Validators.required],
      hsmManufacturer: [null, Validators.required],
      hsmModel: [null, Validators.required],
      hsmLibraryPath: [
        '/opt/utimaco/PKCS11_R2/lib/libcs_pkcs11_R2.so',
        Validators.required,
      ],
      hsmType: [null, Validators.required],
      hsmForm: ['FIPS', Validators.required],
      hsmTokenList: new FormArray([], Validators.required),
    });

  }
  setPage(pageInfo) {
    this.isLoading = true;
  }
  ngOnInit() {
    this.contentHeader = {
      headerTitle: 'Tạo kết nối HSM',
      actionButton: true,
      breadcrumb: {
        type: 'chevron',
        links: [
          {
            name: 'Danh sách kết nối bị HSM',
            isLink: true,
            link: '/apps/equipment-management/hsm/hsm-list',
          },
          {
            name: 'Chi tiết kết nối HSM',
            isLink: false,
            // link: '/apps/equipment-management/new-hsm'
          },
        ],
      },
    };
    console.log(this.HsmFormView.value);
    this._hsmService
    .getHSMId(this.lastValue)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((hsm) => {
      console.log(hsm);
      this.HSMname =  hsm.data.hsmName;

      this.HsmFormView.controls.hsmName.patchValue( hsm.data.hsmName);
      this.HsmFormView.controls.hardwareId.patchValue( hsm.data.hardwareId);
      this.HsmFormView.controls.hsmManufacturer.patchValue( hsm.data.hsmManufacturer);
      this.HsmFormView.controls.hsmModel.patchValue( hsm.data.hsmModel);
      this.HsmFormView.controls.hsmLibraryPath.patchValue(
        hsm.data.hsmLibraryPath
      );
      this.HsmFormView.controls.hsmType.patchValue( hsm.data.hsmType);
      //this.HsmFormView.controls.hsmTokenList.patchValue([data.tokens]);
      console.log(this.tokens);
      this.HsmFormView.patchValue({
        hsmTokenList:  hsm.data.tokens,
      });


      this.rowsData = hsm.data.tokens;
      console.log(this.rowsData)
      this.rowsData = hsm.data.tokens.map(item => ({
        ...item,
      }))
      this.isLoading = false;
    });
  }
  exit() {
    this.router.navigateByUrl('/apps/equipment-management/hsm/hsm-list');
  }
}
