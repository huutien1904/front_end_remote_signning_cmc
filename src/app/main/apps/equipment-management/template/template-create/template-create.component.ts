import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-template-create',
  templateUrl: './template-create.component.html',
  styleUrls: ['./template-create.component.scss']
})
export class TemplateCreateComponent implements OnInit {

  // public 
  public contentHeader: object;
  public templateFormView: FormGroup;
  public submitted = false;
  constructor(
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Tạo mới template',
      actionButton: true,
      breadcrumb: {
        type: 'chevron',
        links: [
          {
            name: 'Danh sách Template',
            isLink: true,
            link: '/apps/equipment-management/template/template-list',
          },
          {
            name: 'Tạo mới Template',
            isLink: false,
          },
        ],
      },
    };
    this.templateFormView = this.formBuilder.group({
      keypairTemplateName: [null, Validators.required],
      privateKeyExtractable: [null, Validators.required],
      privateKeySensitive: [null, Validators.required],
      privateKeyDerive: [null, Validators.required],
      privateKeyDecrypt: [null, Validators.required],
      privateKeySign: [null, Validators.required],
      privateKeySignRecover: [null, Validators.required],
      privateKeyUnwrap: [null, Validators.required],
      publicKeyModifiable: [null, Validators.required],
      publicKeyToken: [null, Validators.required],
      publicKeyPrivate: [null, Validators.required],
      publicKeyDerive: [null, Validators.required],
      publicKeyWrap: [null, Validators.required],
    
    });
  }

  get f() {
    return this.templateFormView.controls;
  }



}
