import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PersonalViewService } from './personal-view.service';

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

   // private
  private _unsubscribeAll: Subject<any>;
  constructor(
      private router: Router, 
      private _personalViewService: PersonalViewService) { 
        this._unsubscribeAll = new Subject();
      }

  ngOnInit(): void {
    this._personalViewService.onUserViewChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
      this.data = response;
    });
    console.log(this.data);
  }

  
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
