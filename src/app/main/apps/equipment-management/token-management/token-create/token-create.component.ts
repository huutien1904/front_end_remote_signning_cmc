import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { PagedData } from 'app/main/models/PagedData';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { HsmService } from '../../hsm-management/hsm.service';
import { TokenService } from '../token.service';

@Component({
  selector: 'app-token-create',
  templateUrl: './token-create.component.html',
  styleUrls: ['./token-create.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TokenCreateComponent implements OnInit {

  private _unsubscribeAll = new Subject();
  public tokenForm: FormGroup;
  public contentHeader: object;
  public buttonReturn: object;
  public submitted = false;
  public hsmList: any[];
  public slotOption: any[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
  public lockQuantity: any[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
  public body = {
    "page": null,
    "size": 4,
    "sort": ["hsmId,asc"],
    "contains": "",
    "fromDate": "",
    "toDate": ""
  }
  // set table detail hsm
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('tableRowDetails') tableRowDetails: any;
  public rowsData: any
  public isLoading: boolean = false;
  public ColumnMode = ColumnMode;
  public pagedData = new PagedData<any>();
  public placeholder:string
  
  public row:any;
  public chkBoxSelected = [];
  public selected = [];
  public SelectionType = SelectionType;
  name = 'Angular 5';
  // show input
  public showSelect:boolean = false
  public rePasswordSo = true
  // public totalItems: any = 10;
  get f() {
    return this.tokenForm.controls;
  }

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private _tokenService: TokenService,
    private _hsmService: HsmService,
    private toastr: ToastrService,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    this.tokenForm = this.formBuilder.group(
      {
        slotNumber: [null, Validators.required],
        tokenName: [null, Validators.required],
        tokenPassword: ['', Validators.required],
        confPassword: ['', Validators.required],
        hsmInformationId: [null, Validators.required],
        lockQuantity: [null, Validators.required],
      },
      {
        validator: MustMatch('tokenPassword', 'confPassword')
      }
    );
    this.getHsmList();
    this.contentHeader = {
      headerTitle: 'Tạo Slot',
      actionButton: true,
      breadcrumb: {
        type: 'chevron',
        links: [
          {
            name: 'Danh sách Slot',
            isLink: true,
            link: '/apps/equipment-management/token/token-list'

          },
          {
            name: 'Tạo Slot',
            isLink: false,
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
            link: "/apps/equipment-management/token/token-list",
        }
        ]
      }
    };
  }
  getHsmList() {
    console.log("check")
    this._hsmService.getListHsm(this.body)
      .pipe(
        takeUntil(this._unsubscribeAll)
      )
      .subscribe(response => {
        console.log(response)
        this.hsmList = response.data.data;
        console.log(this.hsmList);
        
        this.tokenForm.controls['hsmInformationId'].setValue(this.hsmList[0]);
        const id = this.hsmList[0].hsmId
        this._hsmService.getHsmId(id)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe((res: any) => {
            this.rowsData = res.data.tokenInfoDtoList
            this.pagedData.totalItems = this.rowsData.length + 1
            console.log(this.rowsData)
          })

      });

  }
  changeHSM(e) {
    
    const id = e.hsmId
    console.log(id)
    this._hsmService.getHsmId(id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res: any) => {
        this.rowsData = res.data.tokenInfoDtoList
        this.pagedData.totalItems = this.rowsData.length + 1
        console.log(this.rowsData)
      })
  }
  openViewToken(modal,row) {
    this.name = row
    console.log(row)
    this.modalService.open(modal, {
      centered: true,
      size: "xl",
    });
    
    
  }
  onSubmit() {
    console.log("create")
    this.submitted = true;
    // stop here if form is invalid
    // if (this.tokenForm.invalid) {
    //   return;
    // }
    console.log(this.tokenForm.value);
    const newRequest = JSON.stringify({
      slotNumber: this.f.slotNumber.value,
      tokenName: this.f.tokenName.value,
      tokenPassword: this.f.tokenPassword.value,
      hsmId: this.f.hsmInformationId.value.hsmId
    });
    console.log(newRequest)
    this._tokenService.createToken(newRequest)
      .subscribe((res) => {
        console.log(res);
        if ((res.result = true)) {
          this.toastr.success('👋 Bạn đã tạo TOKEN mới', 'Thành công', {
            positionClass: 'toast-top-center',
            toastClass: 'toast ngx-toastr',
            closeButton: true
          });
          this.submitted = false;
          this.router.navigate(['/apps/equipment-management/token/token-list']);
          this.tokenForm.reset();
        }
      })
  }


  /**
   * Custom Checkbox On Select
   *
   * @param { selected }
   */
   customCheckboxOnSelect({ selected }) {
    this.chkBoxSelected.splice(0, this.chkBoxSelected.length);
    this.chkBoxSelected.push(...selected);
  }
  /**
   * For ref only, log selected values
   *
   * @param selected
   */
  onSelect({ selected },modal) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
    if(this.selected.length > 0){
      this.showSelect = true
    }
    console.log(this.selected)
    const tokenInit = this.selected[0].tokenInitialized;
    const userPinInit = this.selected[0].userPinInitialized
    if(tokenInit === false){
      this.showSelect = true;
      this.rePasswordSo = true
    }
    if(tokenInit === true){
      if(userPinInit ===  false){
        this.showSelect = true;
        this.rePasswordSo = false
      }
      if(userPinInit ===  true){
        console.log('hien thi popup')
        this.modalService.open(modal, {
          centered: true,
        });
        this.showSelect = true;
        this.rePasswordSo = false;
      }
    }
    

  }
  cancelToken(){
    this.showSelect = false;
    this.toggleSidebar();
  }
  toggleSidebar() {
    this.modalService.dismissAll();
  }
}
export function MustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];
    if (matchingControl?.errors && !matchingControl?.errors?.mustMatch) {
      // return if another validator has already found an error on the matchingControl
      return;
    }
    // set error on matchingControl if validation fails
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
}
