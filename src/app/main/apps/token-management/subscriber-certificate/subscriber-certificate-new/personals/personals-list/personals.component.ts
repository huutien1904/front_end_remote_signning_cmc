import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PersonalListService } from 'app/main/apps/identity-provider/subscribers/personals/personal-list/personal-list.service';

@Component({
  selector: 'app-personals',
  templateUrl: './personals.component.html',
  styleUrls: ['./personals.component.scss']
})
export class PersonalsComponent implements OnInit {

  public rows: any[] = [];
  public moreOption = true;
  public page: number = 0;
  public pageAdvancedEllipses = 1;
  public totalPages: number;
  public formListSubscriberCertificate: FormGroup;
  public sizePage: number[] = [5, 10, 15, 20];
  gender: string[] = ["Nam", "Nữ"];
  constructor(
    private fb: FormBuilder,
    private _userListService: PersonalListService,
    ) { }
  
  ngOnInit(): void {
    this.formListSubscriberCertificate = this.fb.group({
      inputPersonal: [null, Validators.required],
      fromDate: [null],
      toDate: [null],
      sizePage: [this.sizePage[1]],
      gender: [],
      birthday: [],
    });
    this._userListService
      .getData(this.page, this.sizePage[1])
      .subscribe((res: any) => {
        this.totalPages = res.data.totalPages * 10;
        this.rows = res.data.data;
    });
  }
  onSubmit(){

  }
  selectItem(){

  }
  pageChange(){
    
  }

}
