import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sidebar-organization-edit',
  templateUrl: './sidebar-organization-edit.component.html',
  styleUrls: ['./sidebar-organization-edit.component.scss']
})
export class SidebarOrganizationEditComponent implements OnInit {
  @Input() organization: any;
  @Output() getEditOrganization = new EventEmitter();
  formOrganizationEdit: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    ) { }

  ngOnInit(): void {
    this.formOrganizationEdit = this.formBuilder.group({
      organizationName:[''],
      countryOrganizationId:[''],
      phoneNumber:[''],
      email:[''],
      website:[''],
      parentOrganizationId:['']
    });
    this.formOrganizationEdit.patchValue({
        organizationName:this.organization.organizationName,
        countryOrganizationId:this.organization.countryOrganizationId,
        phoneNumber:this.organization.phoneNumber,
        email:this.organization.email,
        website:this.organization.website,
        parentOrganizationId:this.organization.parentOrganizationId,
      })
  }
  onEditPersonal(){
    console.log(this.formOrganizationEdit.value)
    this.getEditOrganization.emit(this.formOrganizationEdit.value)
    this.closeForm();
  }
  closeForm() {
    this.modalService.dismissAll();
  }

}
