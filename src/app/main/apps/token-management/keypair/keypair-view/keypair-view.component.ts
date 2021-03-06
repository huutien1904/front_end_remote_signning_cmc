import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { KeypairService } from '../keypair.service';
import { map, takeUntil } from 'rxjs/operators';
import { HsmService } from 'app/main/apps/equipment-management/hsm-management/hsm.service';
import { Hsm, Token } from 'app/main/models/Equipment';
import { KeypairListService } from '../keypair-list/keypair-list.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-keypair-view',
  templateUrl: './keypair-view.component.html',
  styleUrls: ['./keypair-view.component.scss']
})

export class KeypairViewComponent implements OnInit {

  private _unsubscribeAll: Subject<any>;
  public buttonReturn:object;
  public url = this.router.url;
  public keypairFormView: FormGroup;
  public HSMname :string;
  public lastValue;
  public contentHeader: object;
  public submitted = false;
  public hsmType: any[] = ["NET", "PCI"];
  public hsmForm: any[] = ["FIPS", "PC5"];
  public tokenList: Token[];
  public hsmList = new Array<Hsm>();
  public tokenName:any;
  public hsmName:any;
  get f() {
    return this.keypairFormView.controls;
  }

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private   toastr: ToastrService,
    private _hsmService: KeypairService,
    private _hsmServices: HsmService,
    private _keypairService: KeypairListService,
  ) { 
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this._hsmServices
      .getListHsm({
        page: 0,
        size: 100,
      })
      .pipe(
        map((res) => {
          res.data.data.forEach((element, index) => {
            if (element.tokens.length == 0) {
              delete res.data.data[index];
            }
          });
          return res.data.data.filter((x) => x !== null);
        }),
        takeUntil(this._unsubscribeAll)
      )
      .toPromise()
      .then((hsmList:any) => {
        console.log(hsmList);
        this.hsmList = hsmList;
        this.hsmName = this.hsmList[0].hsmName;
        this.tokenName = this.hsmList[0].tokens[0].tokenName;
        console.log(this.tokenName);
      });
    this.keypairFormView = this.formBuilder.group({
      cryptoSystem: [null, Validators.required],
      keypairAlias: [null, Validators.required],
      keypairId: [null, Validators.required],
      keypairLength: [null, Validators.required],
      keypairStatusName: [null, Validators.required],
      keypairPath: ['Trong HSM', Validators.required],
      hsmName: [null, Validators.required],
      tokenName:[null, Validators.required],
    });
    this.contentHeader = {
      headerTitle: 'C???p kh??a',
      actionButton: true,
      breadcrumb: {
        type: 'chevron',
        links: [
          {
            name: 'Danh s??ch c???p kh??a',
            isLink: true,
            link: '/apps/tm/keypair/keypair-list'
          },
          {
            name: 'Chi ti???t c???p kh??a',
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
            link: "/apps/tm/keypair/keypair-list",
        }
        ]
      }
    };
    this.lastValue = this.url.substr(this.url.lastIndexOf('/') + 1);
    console.log(this.lastValue);
    this._hsmService
    .getKeypairID(this.lastValue)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((token)=>{
      console.log(token);
      const data = token.data
      this.keypairFormView.controls.cryptoSystem.patchValue(data.cryptoSystem);
      this.keypairFormView.controls.keypairAlias.patchValue(data.keypairAlias.trim());
      this.keypairFormView.controls.keypairId.patchValue(data.keypairId);
      this.keypairFormView.controls.keypairLength.patchValue(data.keypairLength);
      this.keypairFormView.controls.keypairStatusName.patchValue(data.keypairStatusName);
      this.keypairFormView.controls.keypairPath.patchValue(data.username);
    })
    console.log(this.keypairFormView.value)
  }

  deleteKeypair(id) {
    this._keypairService
      .deleteKeypairById(id)
      .toPromise()
      .then((res) => {
        if (res.result === true) {
         
          this.router.navigate(['/apps/tm/keypair/keypair-list']);
           return res
        }
        
      })
  }
  deleteListKeypair() {
    Swal.fire({
      title: 'B???n c?? ch???c mu???n x??a?',
      text: "B???n s??? kh??ng th??? ho??n t??c ??i???u n??y!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7367F0',
      preConfirm: async () => {
        this.deleteKeypair(this.lastValue)
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
      if (result.value === true) {
        Swal.fire({
          icon: 'success',
          title: 'Th??nh c??ng!',
          text: 'B???n ???? x??a th??nh c??ng',
          customClass: {
            confirmButton: 'btn btn-success'
          }
        });
      }
      if (result.value === false )

        Swal.fire({
          icon: 'warning',
          title: 'Th???t b???i!',
          text: 'Kh??ng th??? x??a c???p kh??a t???o b???ng super admin',
          customClass: {
            confirmButton: 'btn btn-warning'
          }
        });

    }

    );
  }
}
