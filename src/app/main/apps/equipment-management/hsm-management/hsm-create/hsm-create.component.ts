import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HsmListService } from '../hsm-list.service';

@Component({
  selector: 'app-hsm-create',
  templateUrl: './hsm-create.component.html',
  styleUrls: ['./hsm-create.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HsmCreateComponent implements OnInit {
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
            name: 'Quản lý thiết bị',
            isLink: true,
            link: '/apps/equipment-management/hsm/hsm-list'
          },
          {
            name: 'Tạo Thiết bị HSM',
            isLink: false,
            // link: '/apps/equipment-management/new-hsm'
          }
        ]
      }
    };
  }

  onSubmit() {
    this.submitted = true;
    console.log(this.HsmForm.value)
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
    this._hsmService.submitForm(JSON.stringify(this.HsmForm.value)).subscribe((res: any) => {
      console.log(res);
      if ((res.result = true)) {
        this.toastr.success('👋 Bạn đã tạo HSM mới', 'Thành công', {
          positionClass: 'toast-top-center',
          toastClass: 'toast ngx-toastr',
          closeButton: true
        });
        this.submitted = false;
        this.router.navigate(['/apps/equipment-management/hsm/hsm-list']);
        this.HsmForm.reset();
      }
    });
  }

  exit() {
    this.router.navigateByUrl("/apps/equipment-management/search")
  }

}
