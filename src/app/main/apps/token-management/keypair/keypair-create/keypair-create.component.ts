import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
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
import { KeypairListService } from '../keypair-list/keypair-list.service';

@Component({
  selector: 'app-keypair-create',
  templateUrl: './keypair-create.component.html',
  styleUrls: ['./keypair-create.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class KeypairCreateComponent implements OnInit {
  @Output() onUpdate = new EventEmitter<any>();
  @Output() onClose = new EventEmitter<any>();
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
  public cryptoAlgorithm = [
    {
      cryptoSystem: 'RSA',
      keypairLength: ['1024', '1536', '2048', '3072', '4096', '6144', '8192'],
    },
    {
      cryptoSystem: 'ECDSA',
      keypairLength: ['secp256r1', 'secp384r1', 'secp521r1'],
    },
  ];
  public keypairLengthList = this.cryptoAlgorithm[0].keypairLength;
  alias: any[] = [];
  hsmList: any[] = [];
  keypairAliasName: any;
  public tokenName: any;
  public tokenList: any[] = [];
  public keypairAlias: any[] = [];
  public userIdList: any[] = [];
  public numberKeypair: any[] = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20',
  ];
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
    private _keypairService: KeypairListService,
    private _keypairServices: KeypairService,
    private _toastrService: ToastrService
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
            name: 'Quay lại',
            isLink: true,
            link: '/apps/tm/keypair/keypair-list',
          },
        ],
      },
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
        // this.keypairAlias = pagedData.data.data
        // this.alias = this.keypairAlias[0].username;
        // console.log(this.keypairAlias);
        // console.log(this.alias);
        this.userIdList = pagedData.data.data;
        console.log(this.userIdList);
      });

    this._keypairService
      .getData(body)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((pagedData) => {
        console.log(pagedData);
        this.keypairAlias = pagedData.data.data;
        this.keypairAliasName = this.keypairAlias[0].keypairAlias;
        console.log(this.keypairAlias);
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
        this.tokenName = this.hsmList[0].tokens[0].tokenName;
        console.log(this.hsmList);
        console.log(this.tokenList);
      });
    this.keypairFormView = this.formBuilder.group({
      cryptoAlgorithm: this.formBuilder.group({
        cryptoSystem: [null, Validators.required],
        keypairLength: [null, Validators.required],
      }),
      hsmList: [this.hsmList[0], Validators.required],
      tokenList: [null, Validators.required],
      alias: [null, Validators.required],
      keypairAlias: [null, Validators.required],
      userId: [null, Validators.required],
      numberKeypair: [null, Validators.required],
    });
    console.log(this.keypairFormView.value);
  }
  changeHsm() {
    this.tokenList = this.keypairFormView.get('hsmList').value.tokens;
    this.keypairFormView.patchValue({ tokenId: this.tokenList[0] });
  }
  changeCrypto() {
    this.keypairLengthList = this.keypairFormView
      .get('cryptoAlgorithm')
      .get('cryptoSystem').value.keypairLength;
    this.keypairFormView
      .get('cryptoAlgorithm')
      .patchValue({ keypairLength: this.keypairLengthList[0] });
  }
  // disableTokenName() {
  //   console.log(this.keypairFormView.get('numberKeypair').value.numberKeypair);
  //   if (this.keypairFormView.get('numberKeypair').value.numberKeypair === '1') {
  //     this.keypairFormView.controls['keypairAlias'].enable();
  //   } else {
  //     this.keypairFormView.controls['keypairAlias'].disable();
  //   }
  // }
  disableTokenName(e){
    // console.log(e);
    if(e > 1 ){
      this.keypairFormView.controls['keypairAlias'].disable();
    }
    else {
      this.keypairFormView.controls['keypairAlias'].enable();
    }
    
  }
  updateTable() {
    this.onUpdate.emit();
  }
  closeModal() {
    this.onClose.emit();
  }
  onSubmit() {
    console.log('submit');
    console.log(this.keypairFormView.value);
    this.submitted = true;

    const body = {
      cryptoAlgorithm: [
        this.keypairFormView.get('cryptoAlgorithm').get('cryptoSystem').value
          .cryptoSystem,
        this.keypairFormView.get('cryptoAlgorithm').get('keypairLength').value,
      ],
      templateKeyId: '1',
      tokenId: this.keypairFormView.value.tokenList.tokenId,
      userId: this.keypairFormView.value.userId,
      alias: this.keypairFormView.value.keypairAlias,
    };
    console.log(body);
    this._keypairServices
      .createKeypair(JSON.stringify(body))
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        console.log(res);
        if (res.result === true) {
          this.updateTable();
          this._toastrService.success(
            'Tạo cặp khóa thành công ',
            'Thành công',
            {
              toastClass: 'toast ngx-toastr',
              positionClass: 'toast-top-center',
              closeButton: true,
            }
          );
          this.closeModal();
        }
        if (res.result === false) {
          this._toastrService.error('Tên cặp khóa tồn tại', 'Thất Bại', {
            toastClass: 'toast ngx-toastr',
            closeButton: true,
          });
        }
      });
  }
}
