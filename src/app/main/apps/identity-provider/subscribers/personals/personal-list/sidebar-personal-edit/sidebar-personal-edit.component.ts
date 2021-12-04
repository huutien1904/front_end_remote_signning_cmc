import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sidebar-personal-edit',
  templateUrl: './sidebar-personal-edit.component.html',
  styleUrls: ['./sidebar-personal-edit.component.scss']
})
export class SidebarPersonalEditComponent implements OnInit {
  @Input() personal: any;
  @Output() getEditPersonal = new EventEmitter();
  formPersonalEdit: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    ) { }

  ngOnInit(): void {
    this.formPersonalEdit = this.formBuilder.group({
      personalFirstName: [''],
      personalMiddleName: [''],
      personalLastName: [''],
      personalCountryId: [''],
      birthday: [''],
      gender: [''],
      email: [''],
      phoneNumber: [''],
    });
    this.formPersonalEdit.patchValue({
        personalFirstName:this.personal.personalFirstName,
        personalMiddleName:this.personal.personalMiddleName,
        personalLastName:this.personal.personalLastName,
        personalCountryId:this.personal.personalCountryId,
        birthday:this.personal.birthday,
        gender:this.personal.gender,
        email:this.personal.email,
        phoneNumber:this.personal.phoneNumber,
      
      })
  }
  onEditPersonal(){
    console.log(this.formPersonalEdit.value)
    this.getEditPersonal.emit(this.formPersonalEdit.value)
    this.closeForm();
  }
  closeForm() {
    this.modalService.dismissAll();
  }

}
