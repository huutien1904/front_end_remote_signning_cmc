import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-user-sidebar',
  templateUrl: './new-user-sidebar.component.html',
  styleUrls: ['./new-user-sidebar.component.scss'],
})
export class NewUserSidebarComponent implements OnInit {
  public ReactiveUserDetailsForm: FormGroup;
  public ReactiveUDFormSubmitted = false;
  public confPassword = '';
  public roles = [ 'ADMIN', 'SUPERADMIN', 'OPERATOR',   
  'USER-PERSONAL', 'USER-ORGANIZATION', 'USER-SERVICE', 'USER-DEVICE' ];
  public UDForm = {
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNo: '',
    email: '',
    role: '',
  };


  countryResidencePlace:String[] =[
    'Việt Nam',
    'Thái Lan',
    'Lào',
  ]
  provinceResidencePlace:String[] =[
    'Hà Nam',
    'Thài Bình ',
    'Nam Định',
  ]
  districtResidencePlace:String[] =[
    'Lý Nhân',
    'Bình Lục',
    'Thanh Liêm',
  ]
  communeResidencePlace:String[] =[
    'Nhân Nghĩa',
    'Nhân Bình',
    'Xuân Khê',
  ]
  /**
   *' Constructor
   *
   * @param {NgbModal} modalService
   * @param {HttpClient} _httpClient
   */
  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private _httpClient: HttpClient,
    private toastr: ToastrService
    ) {}

  get ReactiveUDForm() {
    return this.ReactiveUserDetailsForm.controls;
  }

  toggleSidebar(){
    this.modalService.dismissAll();
  }

  ReactiveUDFormOnSubmit() { 
    this.ReactiveUDFormSubmitted = true;
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const token = currentUser.token;
    const bodyRequest = this.UDForm;
    const option = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      }
    };
    // stop here if form is invalid
    if (this.ReactiveUserDetailsForm.invalid) {
      return;
    }
    return this._httpClient.post<any>(`${environment.apiUrl}/user/register`, bodyRequest, option).subscribe((response: any) => {
      console.log(response);
      this.toggleSidebar();
      this.toastr.success('👋 Bạn đã đăng ký tài khoản mởi', 'Thành công', {
        positionClass: 'toast-top-center',
        toastClass: 'toast ngx-toastr',
        closeButton: true
      });
    })
  }

  ngOnInit(): void {
    this.ReactiveUserDetailsForm = this.formBuilder.group(
    {
      username: ['', Validators.required],
      firstName: ['', Validators.required, Validators.pattern('[a-zA-z]')],
      lastName: ['', Validators.required, Validators.pattern('[a-zA-z]')],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(1)]],
      confPassword: ['', [Validators.required, Validators.minLength(1)]],
      phoneNo: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      role: ['', [Validators.required]]
    },
    {
        validator: MustMatch('password', 'confPassword')
    }
    );
  }
}
  export function MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
  
      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        // return if another validator has already found an error on the matchingControl
        return;
      }
  
      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

