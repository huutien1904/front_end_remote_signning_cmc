import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { HsmService } from '../hsm.service';

@Component({
  selector: 'app-hsm-edit',
  templateUrl: './hsm-edit.component.html',
  styleUrls: ['./hsm-edit.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HsmEditComponent implements OnInit {
  private _unsubscribeAll: Subject<any>;
  public url = this.router.url;
  public HsmFormEdit: FormGroup;
  public hsmName :string;
  public lastValue;
  public contentHeader: object;
  public buttonReturn: object;
  public submitted = false;
  public hsmType: any[] = ["NET", "PCI"];
  public hsmManufacturer: any[] = ["FIPS", "PC5"];

  get f() {
    return this.HsmFormEdit.controls;
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
      .getHsmId(this.lastValue)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((hsm) => {
        console.log(hsm);
        const data = hsm.data
        this.hsmName = data.hsmName;
        this.HsmFormEdit.controls.hsmName.patchValue(data.hsmName);
        this.HsmFormEdit.controls.hardwareId.patchValue(data.hardwareId);
        // this.HsmFormEdit.controls.manufacturerId.patchValue(data.manufacturerId);
        this.HsmFormEdit.controls.hsmModel.patchValue(data.hsmModel);
        this.HsmFormEdit.controls.hsmLibraryPath.patchValue(data.hsmLibraryPath);
        this.HsmFormEdit.controls.hsmType.patchValue(data.hsmType);
      });
  }

  ngOnInit() {
    this.HsmFormEdit = this.formBuilder.group({
      hsmName: [null, Validators.required],
      hardwareId: [null, Validators.required],
      // manufacturerId: [null, Validators.required],
      hsmModel: [null, Validators.required],
      hsmLibraryPath: ['/opt/utimaco/PKCS11_R2/PKCS11.cfg', Validators.required],
      hsmType: [null, Validators.required],
      hsmManufacturer: ["FIPS", Validators.required],
    });

    this.contentHeader = {
      headerTitle: 'Ch???nh s???a k???t n???i HSM',
      actionButton: true,
      breadcrumb: {
        type: 'chevron',
        links: [
          {
            name: 'Danh s??ch k???t n???i HSM',
            isLink: true,
            link: '/apps/equipment-management/hsm/hsm-list'
          },
          {
            name: 'Ch???nh s???a k???t n???i HSM',
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
            name:'Quay l???i',
            isLink: true,
            link: "/apps/equipment-management/hsm/hsm-list",
        }
        ]
      }
    };

  }

  onSubmit(){
    // console.log(this.HsmFormEdit.value);
    // this.lastValue = this.url.substr(this.url.lastIndexOf('/') + 1);
    // this._hsmService.updateHSMId(this.lastValue,JSON.stringify(this.HsmFormEdit.value))
    // .subscribe((res) =>{
    //   console.log(res);
    // })
    this.HsmFormEdit.get("hsmLibraryPath").patchValue("/opt/utimaco/PKCS11_R2/lib/libcs_pkcs11_R2.so");
    console.log(this.HsmFormEdit.value)
    Swal.fire({
      title: 'B???n c?? ch???c mu???n c???p nh???t?',
      text: "B???n s??? kh??ng th??? ho??n t??c ??i???u n??y!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7367F0',
      preConfirm:   async () => {
      return await this._hsmService
      .updateHsmId(this.lastValue, JSON.stringify(this.HsmFormEdit.value))
      .pipe(takeUntil(this._unsubscribeAll))
      .toPromise().then(res=>{
        if(res.result==false){
          throw new Error(res.message);
        }
        return res;
      }).catch(
        function (error) {
          Swal.showValidationMessage('M?? l???i:  ' + error + '');
        }
      );
     },
      cancelButtonColor: '#E42728',
      cancelButtonText: "Tho??t",
      confirmButtonText: '????ng, t??i mu???n c???p nh???t!',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-danger ml-1'
      },
      allowOutsideClick:  () => {
        return !Swal.isLoading();
      }
    }).then(function (result) {
      if (result.value) {
        Swal.fire({
          icon: 'success',
          title: 'Th??nh c??ng!',
          text: 'HSM ???? ???????c c???p nh???t.',
          customClass: {
            confirmButton: 'btn btn-success'
          }
        });
      }
    }
    
    );
  }

}
