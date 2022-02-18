import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { KeypairService } from '../keypair.service';
import { map, takeUntil } from 'rxjs/operators';
import { HsmService } from 'app/main/apps/equipment-management/hsm-management/hsm.service';
import { Hsm, Token } from 'app/main/models/Equipment';
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
      keypairStatus:['Đã chứng thực',Validators.required],
      keypairPath: ['Trong HSM', Validators.required],
      hsmName: [null, Validators.required],
      tokenName:[null, Validators.required],
    });
    this.contentHeader = {
      headerTitle: 'Cặp khóa',
      actionButton: true,
      breadcrumb: {
        type: 'chevron',
        links: [
          {
            name: 'Danh sách cặp khóa',
            isLink: true,
            link: '/apps/tm/keypair/keypair-list'
          },
          {
            name: 'Chi tiết cặp khóa',
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
      this.keypairFormView.controls.keypairAlias.patchValue(data.keypairAlias);
      this.keypairFormView.controls.keypairId.patchValue(data.keypairId);
      this.keypairFormView.controls.keypairLength.patchValue(data.keypairLength);
      this.keypairFormView.controls.keypairStatusName.patchValue(data.keypairStatusName);
      //this.keypairFormView.controls.keypairPath.patchValue(data.hsmType);
    })
    console.log(this.keypairFormView.value)
  }
}
