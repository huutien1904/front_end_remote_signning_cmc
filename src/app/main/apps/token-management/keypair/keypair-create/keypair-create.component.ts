import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { KeypairService } from '../keypair.service';
import { takeUntil } from 'rxjs/operators';
import { Hsm, Token } from 'app/main/models/Equipment';
import { HsmService } from '../../../equipment-management/hsm-management/hsm.service';
import { CertificateRequestListService } from '../../certificate-request/certificate-request-list/certificate-request-list.service';
import { PersonalService } from '../../../identity-provider/subscribers/personals/personal.service';

@Component({
  selector: 'app-keypair-create',
  templateUrl: './keypair-create.component.html',
  styleUrls: ['./keypair-create.component.scss'],
})
export class KeypairCreateComponent implements OnInit {
  private _unsubscribeAll: Subject<any>;
  public buttonReturn: object;
  public url = this.router.url;
  public keypairFormView: FormGroup;
  public newRequestForm: FormGroup;
  public HSMname: string;
  public lastValue;
  public contentHeader: object;
  public submitted = false;
  public hsmType: any[] = ['NET', 'PCI'];
  public hsmForm: any[] = ['FIPS', 'PC5'];
  public cryptoSystem: any[] = ['RSA', 'ECDSA'];
  public keypairLength: any[] = [
    '1024',
    '1536',
    '2048',
    '3072',
    '4096',
    '6144',
    '8192',
  ];
  alias: any[] = [];
  hsmList: any[] = [];
  public tokenList: any[] = [];
  public userIdList: any[] = [];
  get f() {
    return this.keypairFormView.controls;
  }
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private _listCerReqService: CertificateRequestListService,
    private _hsmService: HsmService,
    private _personalService: PersonalService,
    private _keypairService:KeypairService,
  ) {
    this._unsubscribeAll = new Subject();
    this.lastValue = this.url.substr(this.url.lastIndexOf('/') + 1);
  }

  ngOnInit() {
    this.contentHeader = {
      headerTitle: 'Tạo mới cặp khóa',
      actionButton: true,
      breadcrumb: {
        type: 'chevron',
        links: [
          {
            name: 'Danh sách cặp khóa',
            isLink: true,
            link: '/apps/tm/keypair/keypair-list',
          },
          {
            name: 'Tạo mới cặp khóa',
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
            name:'Quay lại',
            isLink: true,
            link: "/apps/tm/keypair/keypair-list",
        }
        ]
      }
    };
    const body = {
      contains: null,
      fromDate: null,
      page: 0,
      size: 1000,
      sort: null,
      toDate: null,
    };
    this._personalService
      .getListPersonals(JSON.stringify(body))
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((pagedData) => {
        console.log(pagedData.data.data);
        this.userIdList = pagedData.data.data;
        console.log(this.userIdList);
      });

    this._hsmService
      .getListHsm({
        page: 0,
        size: 100,
      })
      .toPromise()
      .then((hsmList) => {
        console.log(hsmList);
        this.hsmList = hsmList.data.data;
        this.tokenList = this.hsmList[0].tokens;
        console.log(this.hsmList);
        console.log(this.tokenList);
      });
    this.keypairFormView = this.formBuilder.group({
      hsmList: [null, Validators.required],
      tokenList: [null, Validators.required],
      cryptoSystem: [null, Validators.required],
      keypairLength: [null, Validators.required],
      keypairAlias: [null, Validators.required],
      userId: [null, Validators.required],
    });
    console.log(this.keypairFormView.value);
  }
  changeHsm() {
    this.tokenList = this.keypairFormView.get('hsmList').value.tokens;
    this.keypairFormView.patchValue({ tokenId: this.tokenList[0] });
  }
  onSubmit() {
    console.log('submit');
    const body = {
      cryptoAlgorithm: [this.keypairFormView.value.cryptoSystem, this.keypairFormView.value.keypairLength],
      templateKeyId: '1',
      tokenId: this.keypairFormView.value.tokenList.tokenId,
      userId: this.keypairFormView.value.userId.userId,
      alias: this.keypairFormView.value.keypairAlias,
    };
    console.log(body)
    this._keypairService.createKeypair(JSON.stringify(body))
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((responDataa) => {
      console.log(responDataa)
    });
  }

}
