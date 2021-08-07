import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-new-user-sidebar',
  templateUrl: './new-user-sidebar.component.html'
})
export class NewUserSidebarComponent implements OnInit {
  public ReactiveUserDetailsForm: FormGroup;
  public ReactiveUDFormSubmitted = false;
  public UDForm = {
    username: '',
    email:'',
    password:'',
    firstName:'',
    lastName:'',
    phoneNo:'',
    role:'',
    createdAt : new Date(),
    confPassword:'',
  };
  roles = [ 'ADMIN', 'SUPERADMIN', 'OPERATOR',   
  
  'USER-PERSONAL', 'USER-ORGANIZATION', 'USER-SERVICE', 'USER-DEVICE' ]

  /**
   *' Constructor
   *
   * @param {NgbModal} modalService
   */
  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal
    ) {}

  get ReactiveUDForm() {
    return this.ReactiveUserDetailsForm.controls;
  }

  ReactiveUDFormOnSubmit() {
    this.ReactiveUDFormSubmitted = true;

    // stop here if form is invalid
    if (this.ReactiveUserDetailsForm.invalid) {
      return;
    }

    alert('Đăng kí thành công');
  }

  toggleSidebar(){
    this.modalService.dismissAll();
  }
  
  ngOnInit(): void {
    this.ReactiveUserDetailsForm = this.formBuilder.group({
      username: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confPassword: ['', [Validators.required, Validators.minLength(6)]],
      phoneNo: ['', [Validators.required]],
    });
  }
}

