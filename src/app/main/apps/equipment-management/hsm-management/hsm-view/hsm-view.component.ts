import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HsmService } from '../hsm.service';

@Component({
  selector: 'app-hsm-view',
  templateUrl: './hsm-view.component.html',
  styleUrls: ['./hsm-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HsmViewComponent implements OnInit {

  private _unsubscribeAll: Subject<any>;
  public url = this.router.url;
  public HsmFormView: FormGroup;
  public HSMname :string;
  public lastValue;
  public contentHeader: object;
  public submitted = false;
  public hsmType: any[] = ["NET", "PCI"];
  get f() {
    return this.HsmFormView.controls;
  }

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private _hsmService: HsmService,
    private   toastr: ToastrService
  ) { 

    this._unsubscribeAll = new Subject();
    this.lastValue = this.url.substr(this.url.lastIndexOf('/') + 1);
    console.log(this.lastValue);
    this._hsmService
      .getHSMId(this.lastValue)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((hsm) => {
        console.log(hsm);
        const data = hsm.data
        this.HSMname = data.hsmName;
        this.HsmFormView.controls.hsmName.patchValue(data.hsmName);
        this.HsmFormView.controls.hardwareId.patchValue(data.hardwareId);
        this.HsmFormView.controls.hsmManufacturer.patchValue(data.hsmManufacturer);
        this.HsmFormView.controls.hsmModel.patchValue(data.hsmModel);
        this.HsmFormView.controls.hsmLibraryPath.patchValue(data.hsmLibraryPath);
        this.HsmFormView.controls.hsmType.patchValue(data.hsmType);
      });
  }

  ngOnInit() {
    this.HsmFormView = this.formBuilder.group({
      hsmName: [null, Validators.required],
      hardwareId: [null, Validators.required],
      hsmManufacturer: [null, Validators.required],
      hsmModel: [null, Validators.required],
      hsmLibraryPath: ['/opt/utimaco/PKCS11_R2/lib/libcs_pkcs11_R2.so', Validators.required],
      hsmType: [null, Validators.required],
    });
    this.contentHeader = {
      headerTitle: 'Tạo Thiết bị HSM',
      actionButton: true,
      breadcrumb: {
        type: 'chevron',
        links: [
          {
            name: 'Danh sách thiết bị HSM',
            isLink: true,
            link: '/apps/equipment-management/hsm/hsm-list'
          },
          {
            name: 'Chi tiết HSM',
            isLink: false,
            // link: '/apps/equipment-management/new-hsm'
          }
        ]
      }
    };
  }

}
