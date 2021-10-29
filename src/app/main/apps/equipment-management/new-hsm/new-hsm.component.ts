import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HsmListService } from '../hsm-management/hsm-list.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-hsm',
  templateUrl: './new-hsm.component.html',
  styleUrls: ['./new-hsm.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NewHsmComponent implements OnInit {
  public HsmForm: FormGroup;
  public contentHeader: object;
  public submitted = false;
  public hsmType: any[] = ["NET", "PCI"];


  get f() {
    return this.HsmForm.controls;
  }

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private _hsmService: HsmListService,
    private   toastr: ToastrService
    
  ) { }

  ngOnInit(): void {
    this.HsmForm = this.formBuilder.group({
      hsmName: [null, Validators.required],
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
            name: 'Quản lý thiết bị',
            isLink: false,
          },
          {
            name: 'Tạo Thiết bị HSM',
            isLink: true,
            link: '/apps/equipment-management/new-hsm'
          }
        ]
      }
    };
  }

  onSubmit() {
    this.submitted = true;
    console.log(this.HsmForm)
    // stop here if form is invalid
    if (this.HsmForm.invalid) {
      return;
    }
    const newRequest = JSON.stringify({
      hsmName: this.f.hsmName.value,
      hsmManufacturer: this.f.hsmManufacturer.value,
      hsmModel: this.f.hsmModel.value,
      hsmLibraryPath: this.f.hsmLibraryPath.value,
      hardwareId: 'CP5TdVI'
    });
    this._hsmService.submitForm(newRequest).subscribe((res: any) => {
      console.log(res);
      if ((res.result = true)) {
        this.toastr.success('👋 Bạn đã tạo HSM mới', 'Thành công', {
          positionClass: 'toast-top-center',
          toastClass: 'toast ngx-toastr',
          closeButton: true
        });
        this.submitted = false;
        this.HsmForm.reset();
      }
    });
  }

  exit() {
    this.router.navigateByUrl("/apps/equipment-management/search")
  }

}
