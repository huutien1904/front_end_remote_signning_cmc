import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-token',
  templateUrl: './new-token.component.html',
  styleUrls: ['./new-token.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NewTokenComponent implements OnInit {
  public TokenForm: FormGroup;
  public contentHeader: object;
  public submitted = false;
  public hsm: any[] = ['1', '2'];


  get f() {
    return this.TokenForm.controls;
  }
  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.TokenForm.invalid) {
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
    this.TokenForm = this.formBuilder.group({
      number: ['', Validators.required],
      label: ['', Validators.required],
      password: ['', Validators.required],
      hsm: [null, Validators.required]
    });
    this.contentHeader = {
      headerTitle: 'Token',
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
            name: 'Token',
            isLink: false
          }
        ]
      }
    };
  }

}
