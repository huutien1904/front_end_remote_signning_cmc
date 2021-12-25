import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { Personal } from 'app/main/models/Personal';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class ProfileComponent implements OnInit {
  minDate: Date;
  maxDate: Date;
  public rows;
  public tempRow;
  public currentRow = new Array<Personal>()
  public avatarImage: string;
  fullName = 'Nguyễn Việt Hưng';


  @ViewChild('accountForm') accountForm: NgForm;

  constructor(private dateAdapter: DateAdapter<any>,) {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 4, 0, 1);
    this.maxDate = new Date(currentYear + 2, 11, 31);
   }

  ngOnInit() {
  }

}
