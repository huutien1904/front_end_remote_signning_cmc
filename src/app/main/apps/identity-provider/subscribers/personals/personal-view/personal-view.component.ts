import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PersonalViewService } from './personal-view.service';
import { ActivatedRoute } from '@angular/router';
import { PersonalDetail } from 'app/main/models/Personal';
@Component({
  selector: 'app-personal-view',
  templateUrl: './personal-view.component.html',
  styleUrls: ['./personal-view.component.scss']
})
export class PersonalViewComponent implements OnInit {
   // public
   public url = this.router.url;
   public lastValue;
   public data;
   public countryBirth:string
   public provinceBirth:string
   public districtBirth:string
   public communeBirth:string

   public countryAdress:string
   public provinceAdress:string
   public districtAdress:string
   public communeAdress:string
   // private
  private _unsubscribeAll: Subject<any>;
  constructor(
      private router: Router, 
      private route:ActivatedRoute,
      private _personalViewService: PersonalViewService) { 
        this._unsubscribeAll = new Subject();
      }

  ngOnInit(): void {
    this.getPersonalView();
  }

  getPersonalView(){
    const routerParams = this.route.snapshot.paramMap
    const personalDeatailId = routerParams.get('id')
   this._personalViewService
   .getDetailPersonal(personalDeatailId)
   .pipe(takeUntil(this._unsubscribeAll))
   .subscribe(response => {
    this.data = response.data
    console.log(this.data)
    });
  }
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
