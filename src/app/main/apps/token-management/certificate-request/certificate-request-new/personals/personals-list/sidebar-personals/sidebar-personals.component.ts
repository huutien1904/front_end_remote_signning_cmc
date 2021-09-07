import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sidebar-personals',
  templateUrl: './sidebar-personals.component.html',
  styleUrls: ['./sidebar-personals.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SidebarPersonalsComponent implements OnInit {
  public NewRequestForm: FormGroup;
  public submitted = false;
  public lengthSelect: any[];
  public Form = {
    crypto: '',
    keyLength: '',
    alias: '',
    token: ''
  }
  public cryptoSelect = [
    {
      value: 'RSA',
      name: 'RSA',
      keyLength: [
        {
          value: '1024',
          name: '1024'
        },
        {
          value: '1536',
          name: '1536'
        },
        {
          value: '2048',
          name: '2048'
        },
        {
          value: '3072',
          name: '3072'
        },
        {
          value: '4096',
          name: '4096'
        },
        {
          value: '6144',
          name: '6144'
        },
        {
          value: '8192',
          name: '8192'
        }
      ]
    },
    {
      value: 'ECDSA',
      name: 'ECDSA',
      keyLength: [
        {
          value: 'brainpoolIP160r1',
          name: 'brainpoolIP160r1'
        },
        {
          value: 'brainpoolIP160t1',
          name: 'brainpoolIP160t1'
        },
        {
          value: 'brainpoolIP192r1',
          name: 'brainpoolIP192r1'
        },
        {
          value: 'brainpoolIP192t1',
          name: 'brainpoolIP192t1'
        },
        {
          value: 'brainpoolIP224r1',
          name: 'brainpoolIP224r1'
        },
        {
          value: 'brainpoolIP224t1',
          name: 'brainpoolIP224t1'
        },
        {
          value: 'brainpoolIP256r1',
          name: 'brainpoolIP256r1'
        },
        {
          value: 'brainpoolIP256t1',
          name: 'brainpoolIP256t1'
        },
        {
          value: 'brainpoolIP384r1',
          name: 'brainpoolIP384r1'
        },
        {
          value: 'brainpoolIP384t1',
          name: 'brainpoolIP384t1'
        },
        {
          value: 'brainpoolIP521r1',
          name: 'brainpoolIP521r1'
        },
        {
          value: 'brainpoolIP521t1',
          name: 'brainpoolIP521t1'
        }
      ]
    }
  ]

  constructor(
    private fb: FormBuilder,
    private modal: NgbModal
  ) { }

  ngOnInit(): void {
    this.NewRequestForm = this.fb.group({
      crypto: ['', Validators.required],
      keyLength: ['', Validators.required],
      alias: ['', Validators.required],
      token: ['', Validators.required]
    })
  }

  toggleSidebar(){
    this.modal.dismissAll();
  }

  test(event) {
    this.Form.crypto = event.value;
    this.Form.keyLength = '';
    console.log(this.Form.crypto)
    this.lengthSelect = [];
    const crypto = event.value;
    const search = this.cryptoSelect.filter(data => data.value == crypto);
    if(search) {
      this.lengthSelect = search[0].keyLength;
    }
  }

  submit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.NewRequestForm.invalid) {
      return;
    }
    console.log(this.Form);
    alert('SUCCESS!! :-)');
  }

}
