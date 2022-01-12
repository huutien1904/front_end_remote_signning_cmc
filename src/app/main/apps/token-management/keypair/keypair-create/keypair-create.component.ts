import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { KeypairService } from '../keypair.service';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-keypair-create',
  templateUrl: './keypair-create.component.html',
  styleUrls: ['./keypair-create.component.scss']
})
export class KeypairCreateComponent implements OnInit {
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

  }

  ngOnInit() {
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
