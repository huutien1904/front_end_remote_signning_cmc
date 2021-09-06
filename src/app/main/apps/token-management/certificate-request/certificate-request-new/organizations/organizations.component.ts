import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import {  FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-organizations',
  templateUrl: './organizations.component.html',
  styleUrls: ['./organizations.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OrganizationsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
