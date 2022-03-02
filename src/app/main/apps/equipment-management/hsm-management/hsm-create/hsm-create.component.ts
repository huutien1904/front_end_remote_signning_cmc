import { async } from '@angular/core/testing';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { HsmService } from '../hsm.service';

@Component({
  selector: 'app-hsm-create',
  templateUrl: './hsm-create.component.html',
  styleUrls: ['./hsm-create.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HsmCreateComponent implements OnInit {
  public HsmForm: FormGroup;
  public contentHeader: object;
  public buttonReturn: object;
  public submitted = false;
  public hsmType: any[] = ["NET", "PCI"];
  public hardware: any[] = [{ name: "FIPS" }, { name: "CP5" }]
  public data= "check"
  people: any[] = [ 
    {
     firstName: "Alex",
     lastName: "Brown",
     age: 55,
    },
    {
     firstName: "Foo",
     lastName: "Bar",
     age: 44,
    },
   {
     firstName: "Fido",
     lastName: "Johnson",
     age: 14,
    }

  ]
  get f() {
    return this.HsmForm.controls;
  }

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private _hsmService: HsmService,
    private toastr: ToastrService,
    private modal: NgbModal,
  ) { }

  ngOnInit(): void {
    this.HsmForm = this.formBuilder.group({
      hsmName: [null, Validators.required],
      hardwareId: ["CP5TdVI", Validators.required],
      hsmModel: ["HSdMs", Validators.required],
      hsmLibraryPath: ['/opt/utimaco/PKCS11_R2/lib/libcs_pkcs11_R2.cfg', Validators.required],
      hsmType: ["NET", Validators.required],
    });

    this.contentHeader = {
      headerTitle: 'Tạo kết nối HSM',
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
            name: 'Tạo kết nối HSM',
            isLink: false,
            // link: '/apps/equipment-management/new-hsm'
          }
        ]
      }
    };

    this.buttonReturn = {
      breadcrumbs: {
        links: [
          {
            name:'Quay lại',
            isLink: true,
            link: "/apps/equipment-management/hsm/hsm-list",
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
    // const newRequest = JSON.stringify({
    //   hsmName: this.f.hsmName.value,
    //   manufacturerId: this.f.manufacturerId.value,
    //   hsmModel: this.f.hsmModel.value,
    //   hsmLibraryPath: this.f.hsmLibraryPath.value,
    //   hardwareId: 'CP5TdVI'
    // });
    this.HsmForm.get("hsmLibraryPath").patchValue("/opt/utimaco/PKCS11_R2/lib/libcs_pkcs11_R2.so");

    this._hsmService.submitForm(JSON.stringify(this.HsmForm.value)).subscribe((res: any) => {
      console.log(res);
      if ((res.result === true)) {
        this.toastr.success('👋 Bạn đã tạo HSM mới', 'Thành công', {
          positionClass: 'toast-top-center',
          toastClass: 'toast ngx-toastr',
          closeButton: true
        });
        this.submitted = false;
        this.router.navigate(['/apps/equipment-management/hsm/hsm-list']);
        this.HsmForm.reset();
        // console.log(res.data)
        // this.data = res.data
        // this.toggleSidebar(modalForm) 
      }
    });
  }
  toggleSidebar(modalForm ) {
    this.modal.open(modalForm, {size: 'xl'})
  }

}
