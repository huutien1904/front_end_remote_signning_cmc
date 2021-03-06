import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  ColumnMode
} from '@swimlane/ngx-datatable';
import { Hsm, Token } from 'app/main/models/Equipment';
import { PagedData } from 'app/main/models/PagedData';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { TokenService } from '../../token-management/token.service';
import { HsmService } from '../hsm.service';
@Component({
  selector: 'app-hsm-view',
  templateUrl: './hsm-view.component.html',
  styleUrls: ['./hsm-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HsmViewComponent implements OnInit {
  public isLoading: boolean = false;
  public rowsData:any = new Array<Token>();
  public pagedData = new PagedData<Token>();
  private _unsubscribeAll: Subject<any>;
  public url = this.router.url;
  public hsmFormView: FormGroup;
  public hsm:Hsm=null;
  public lastValue;
  public contentHeader: object;
  public buttonReturn: object;
  public submitted = false;
  public hsmType: any[] = ['NET', 'PCI'];
  public hsmForm: any[] = ['FIPS', 'PC5'];
  public ColumnMode = ColumnMode;
  public showConnect:boolean = true;
  public totalItems;
  tokens: any[] = [];
  public formListToken: FormGroup;
  hsmTokenList;


  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private _hsmService: HsmService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private _tokenService: TokenService,
  ) {
    this._unsubscribeAll = new Subject();
    this.lastValue = this.url.substr(this.url.lastIndexOf('/') + 1);
    this.hsmFormView = this.formBuilder.group({
      hsmName: [null, Validators.required],
      hardwareId: [null, Validators.required],
      manufacturerId: [null, Validators.required],
      hsmModel: [null, Validators.required],
      hsmLibraryPath: [
        '/opt/utimaco/PKCS11_R2/lib/libcs_pkcs11_R2.cfg',
        Validators.required,
      ],
      hsmType: [null, Validators.required],
      hsmTokenList: new FormArray([], Validators.required),
    });

  }
  setPage(pageInfo) {
    this.isLoading = true;
  }
  async ngOnInit() {
    this.contentHeader = {
      headerTitle: 'Chi ti???t k???t n???i HSM',
      actionButton: true,
      breadcrumb: {
        type: 'chevron',
        links: [
          {
            name: 'Danh s??ch k???t n???i HSM',
            isLink: true,
            link: '/apps/equipment-management/hsm/hsm-list',
          },
          {
            name: 'Chi ti???t k???t n???i HSM',
            isLink: false,
            // link: '/apps/equipment-management/new-hsm'
          },
        ],
      },
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

     this.hsm = await  this._hsmService.getHsmId(this.lastValue).pipe(takeUntil(this._unsubscribeAll)).toPromise().then((res)=>{
      return res.data;
    }).catch((error)=>{
      throw new Error(error);
    })    
    
    this.hsmFormView.patchValue({
      hsmName : this.hsm.hsmName,
      hardwareId:  this.hsm.hardwareId,
      manufacturerId:  this.hsm.manufacturerId,
      hsmModel: this.hsm.hsmModel,
      hsmLibraryPath : this.hsmFormView.get('hsmLibraryPath').value,
      hsmType : this.hsm.hsmType,
      hsmTokenList:this.hsm.tokenInfoDtoList,
    })

    this.formListToken = this.fb.group({
      page: [null],
      size: [null],
      sort: [null],
      contains: [''],
      fromDate: [""],
      toDate: [""],
    });
    console.log(this.hsmFormView.value);
    console.log(this.hsm);
    
    this._tokenService
    .getListToken(JSON.stringify(this.formListToken.value))
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((pagedData) => {
      console.log(pagedData.data);
      this.totalItems = pagedData.data.totalItems;
      this.pagedData = pagedData.data;
      this.rowsData = pagedData.data.data.map((item,index) =>({
        ...item,
        passwordSO:"???? Kh???i t???o",
        passwordUser:"???? kh???i t???o",
        privateKey: 10,
        secretKey:100
      }));
      this.isLoading = false;
    });
  }

  connectHsm(){
    Swal.fire({
      title: 'B???n c?? ch???c mu???n thay ?????i tr???ng th??i?',
      text: 'B???n s??? kh??ng th??? ho??n t??c ??i???u n??y!',
      icon: 'warning',
      showCancelButton: true,
      preConfirm: async () => {
        return await this._hsmService
        .connectHsm(this.hsm.hsmId)
        .pipe(takeUntil(this._unsubscribeAll))
        .toPromise()
        .then((res)=>{
          if(res.result == false){
            throw new Error(res.message);
          }
          this.hsm = res.data;
          return res;
        })
        .catch((error)=>{
          Swal.showValidationMessage('M?? l???i: ' + error);
        })
        ;
      },
      cancelButtonColor: '#E42728',
      cancelButtonText: 'Tho??t',
      confirmButtonText: '????ng, t??i thay ?????i tr???ng th??i!',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-danger ml-1',
      },
      allowOutsideClick: () => {
        return !Swal.isLoading();
      },
    }).then(function (result:any) {
      console.log(result)
      if (result.value.result) {
        Swal.fire({
          icon: 'success',
          title: 'Th??nh c??ng!',
          text: 'Tr???ng th??i Hsm ???? ???????c c???p nh???t.',
          customClass: {
            confirmButton: 'btn btn-success',
          },
        });
      }
    });
  }
  removeHSM(id){
    this._hsmService.deleteHsmId(id)
    .subscribe((res) =>{
      console.log(res)
      if(res.result === true){
        console.log("tienChecl",res.value)
        this.router.navigate(['/apps/equipment-management/hsm/hsm-list']);
      }
    })
    
  }
  deleteHSM(){
    Swal.fire({
      title: 'B???n c?? ch???c mu???n x??a?',
      text: "B???n s??? kh??ng th??? ho??n t??c ??i???u n??y!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7367F0',
      preConfirm: async () => {
        this.removeHSM(this.hsm.hsmId)
      },
      cancelButtonColor: '#E42728',
      cancelButtonText: "Tho??t",
      confirmButtonText: '????ng, t??i mu???n x??a!',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-danger ml-1'
      },
      allowOutsideClick: () => {
        return !Swal.isLoading();
      }
    }).then(function (result: any) {
      console.log(result)
      if (result.value) {
        Swal.fire({
          icon: 'success',
          title: 'Th??nh c??ng!',
          text: 'B???n ???? x??a th??nh c??ng',
          customClass: {
            confirmButton: 'btn btn-success'
          }
        });
      }
    }

    );
  }
  get f() {
    return this.hsmFormView.controls;
  }
}
