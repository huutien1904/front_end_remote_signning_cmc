import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-hsm',
  templateUrl: './new-hsm.component.html',
  styleUrls: ['./new-hsm.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NewHsmComponent implements OnInit {
  public HsmForm: FormGroup;
  public contentHeader: object;
  public submitted = false;
  public Form = {
    hsm: '',
    hangsx: '',
    model: '',
    lib: '',
  };

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.HsmForm.invalid) {
      return;
    }

    alert('Thành công');
    this.exit();
  }

  exit() {
    this.router.navigateByUrl("/apps/equipment-management/search")
  }

  constructor(private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.HsmForm = this.formBuilder.group({
      hsm: ['', Validators.required],
      hangsx: ['', Validators.required],
      model: ['', Validators.required],
      lib: ['', Validators.required]
    });

    this.contentHeader = {
      headerTitle: 'Thiết bị HSM',
      actionButton: true,
      breadcrumb: {
        type: 'chevron',
        links: [
          {
            name: 'Quản lý thiết bị',
            isLink: true,
            link: '/apps/equipment-management/search'
          },
          {
            name: 'Tạo mới',
            isLink: false
          },
          {
            name: 'Thiết bị HSM',
            isLink: false
          }
        ]
      }
    };
  }

}
