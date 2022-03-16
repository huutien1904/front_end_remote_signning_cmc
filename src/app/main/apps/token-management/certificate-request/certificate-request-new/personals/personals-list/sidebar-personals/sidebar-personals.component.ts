import { async } from '@angular/core/testing';
import { EntityProfileService } from './../../../../../../identity-provider/entity-profiles/entity-profile.service';
import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PersonalsService } from '../personals.service';
import { Hsm, Token } from 'app/main/models/Equipment';
import { map, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';
import { PersonalDetail } from 'app/main/models/Personal';
import { AddressService } from 'app/main/apps/identity-provider/address.service';
import { HsmService } from 'app/main/apps/equipment-management/hsm-management/hsm.service';
import { controllers } from 'chart.js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar-personals',
  templateUrl: './sidebar-personals.component.html',
  styleUrls: ['./sidebar-personals.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [AddressService],
})
export class SidebarPersonalsComponent implements OnInit {
  private _unsubscribeAll = new Subject();
  public newRequestForm: FormGroup;
  public submitted = false;

  public fileUrl;
  public fileName;

  //form data
  public cryptoSelect: any[] = ['RSA', 'ECDSA'];
  public rsaKeyLength: any[] = [];
  public ecdsaKeyLength: any[] = ['secp256r1', 'secp384r1', 'secp521r1'];
  public lengthSelect = this.rsaKeyLength;

  // public cryptoAlgorithm = {
  //   RSA: ['1024', '1536', '2048', '3072', '4096', '6144', '8192'],
  //   ECDSA: ['secp256r1', 'secp384r1', 'secp521r1'],
  // };
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
  public tokenList: Token[];
  public hsmList = new Array<Hsm>();
  public strProfile: any = '';
  public address: any
  public listProfiles: any[] = [];
  public bodyGetListProfile = {
    "page": 0,
    "size": 10,
    "sort": [],
    "contains": "",
    "fromDate": "",
    "toDate": ""
  }
  @Input() personal: any;
  @ViewChild('modalLink') modalLink;

  get f() {
    return this.newRequestForm.controls;
  }
  constructor(
    private fb: FormBuilder,
    private modal: NgbModal,
    private _personalsService: PersonalsService,
    private toastr: ToastrService,
    private _hsmService: HsmService,
    private sanitizer: DomSanitizer,
    private _addressService: AddressService,
    private _entityProfileService: EntityProfileService,
    private router : Router
  ) { }
  public hsmListSub = new Subject();
  async ngOnInit() {
    console.log(this.personal)
    // get list hsm
    await this._hsmService
      .getListHsm({
        page: 0,
        size: 100,
        sort : ["hsmId,asc"],
        contains : "",
        fromDate : "",
        toDate : ""
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
      .then((hsmList) => {
        console.log(hsmList);
        this.hsmList = hsmList;
        if(this.hsmList.length > 0){
          this.tokenList = this.hsmList[0].tokens;
        }
      });
    // form crate certificate
    this.newRequestForm = this.fb.group(
      {
        cryptoAlgorithm: this.fb.group({
          cryptoSystem: [this.cryptoAlgorithm[0], Validators.required],
          keypairLength: [this.keypairLengthList[0], Validators.required],
        }),
        alias: [
          this.personal.username +
          Math.floor(Date.now()), Validators.required, [this.checkAlias()]]
        ,
        tokenId: [this.tokenList[0] , Validators.required],
        userId: [this.personal.userId],
        hsm: [this.hsmList[0]],
        profile: [null, Validators.required],
      }
    );
    console.log(this.newRequestForm.value)
    this.getListProfiles();
  }
  // dong modal
  toggleSidebar() {
    this.modal.dismissAll();
  }
  //  download yeu cau chung thuc 
  downloadSidebar(res) {
    this.modal.open(this.modalLink);
    const data = res.data.certificateRequestContent;
    console.log(data)
    const blob = new Blob([data], { type: 'csr' });
    console.log(blob)
    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      window.URL.createObjectURL(blob)
    );
    // this.fileName = res.data.certificateRequestId + '.csr';
    this.fileName = res.data.keypairAlias + '.csr.csr';
    console.log(this.fileName)
  }
  changeCrypto() {
    this.keypairLengthList = this.newRequestForm
      .get('cryptoAlgorithm')
      .get('cryptoSystem').value.keypairLength;
    this.newRequestForm
      .get('cryptoAlgorithm')
      .patchValue({ keypairLength: this.keypairLengthList[0] });
  }

  changeHsm() {
    this.tokenList = this.newRequestForm.get('hsm').value.tokens;
    this.newRequestForm.patchValue({ tokenId: this.tokenList[0] });
  }
  // change profile to get detail subjectDN
  async changeProfile(event) {
    const profileId = event.id;
    console.log(this.personal.staffId,profileId)
    this._entityProfileService.getSubjectDnById(this.personal.staffId, profileId)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        console.log(res)
        this.strProfile = JSON.stringify(res).replace('{', " ").replace('}', " ").replace(/['"]+/g, '').replace(/[":"]+/g, " = ")
      });
  }

  // lay danh sanh profile tu api
  getListProfiles() {
    this._entityProfileService.getListProfiles(this.bodyGetListProfile)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        console.log("check");
        this.newRequestForm.controls['profile'].setValue(res.data.data[0].endEntityProfileName)

        // this.
        console.log(res)
        this.listProfiles = res.data.data.map((profile) => ({
          ...profile,

          id: profile.endEntityProfileId,
          nameProfile: profile.endEntityProfileName
        }))
        console.log(this.listProfiles[0].id)
        console.log(this.personal)
        // set thong tin de hien thi subjectDN cua thue bao ca nhan dau tien 
        var profileId = this.listProfiles[0].id

        this._entityProfileService.getSubjectDnById(this.personal.staffId, profileId)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe((res) => {
            console.log(res)
            this.strProfile = JSON.stringify(res).replace('{', " ").replace('}', " ").replace(/['"]+/g, '').replace(/[":"]+/g, " = ")
          });
      })
  }
  // kiem tra alias
  checkAlias(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      return this._personalsService
        .checkAlias(control.value)
        .pipe(map((res) => {
          if (res.data) {
            return { used: true }
          } else {
            return null;
          }
        }));
    }
  }
  // submit 
  async onSubmit() {
    this.submitted = true;
    if (this.newRequestForm.invalid) {
      return;
    }

    const newRequest = JSON.stringify({
      cryptoAlgorithm: [
        this.newRequestForm.get('cryptoAlgorithm').get('cryptoSystem').value.cryptoSystem, 
        this.newRequestForm.get('cryptoAlgorithm').get('keypairLength').value],
      alias: this.f.alias.value,
      tokenId: this.f.tokenId.value.tokenId,
      templateKeyId: '1',
      userId: this.f.userId.value,
    });
    console.log("tiencheck",newRequest);
    let keypairId = await this._personalsService.createKeypair(newRequest).toPromise().then(res => {
      return res.data.keypairId;
    }
    );
    if (keypairId == null) {
      return;
    }
    this._personalsService.createCertificateRequest(JSON.stringify({ keypairId: keypairId })).subscribe((res: any) => {
      console.log(res);
      if ((res.result === true)) {
        this.toggleSidebar();
        this.toastr.success(
          '👋 Bạn đã tạo yêu cầu chứng thực mới',
          'Thành công',
          {
            positionClass: 'toast-top-center',
            toastClass: 'toast ngx-toastr',
            closeButton: true,
          }
        );
        this.downloadSidebar(res);
        this.router.navigate(['/apps/tm/certificate-request/certificate-request-list']);
      }
    });
  }

}
