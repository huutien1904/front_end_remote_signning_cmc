import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { KeypairService } from '../keypair.service';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-keypair-view',
  templateUrl: './keypair-view.component.html',
  styleUrls: ['./keypair-view.component.scss']
})

export class KeypairViewComponent implements OnInit {

  private _unsubscribeAll: Subject<any>;
  public url = this.router.url;
  public keypairFormView: FormGroup;
  public HSMname :string;
  public lastValue;
  public contentHeader: object;
  public submitted = false;
  public hsmType: any[] = ["NET", "PCI"];
  public hsmForm: any[] = ["FIPS", "PC5"];

  get f() {
    return this.keypairFormView.controls;
  }

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private   toastr: ToastrService,
    private _hsmService: KeypairService,

  ) { 
    this._unsubscribeAll = new Subject();
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
  }

  ngOnInit() {
    this.keypairFormView = this.formBuilder.group({
      cryptoSystem: [null, Validators.required],
      keypairAlias: [null, Validators.required],
      keypairId: [null, Validators.required],
      keypairLength: [null, Validators.required],
      keypairStatusName: [null, Validators.required],
      keypairPath: ['/opt/utimaco/PKCS11_R2/lib/libcs_pkcs11_R2.so', Validators.required],
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
  }
  exit() {
    this.router.navigateByUrl("/apps/tm/keypair/keypair-list")
  }
}
