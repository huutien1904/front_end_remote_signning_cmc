import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AddressService } from 'app/main/apps/identity-provider/address.service';
import { Subject } from 'rxjs';
import { takeUntil } from "rxjs/operators";
import { PersonalService } from '../personal.service';

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
  public address: any;
  public birthPlace: any;
  //  public countryBirth:string
  public provinceBirth: any
  public districtBirth: any
  public communeBirth: any

  public countryAdress: any
  public provinceAdress: any
  public districtAdress: any
  public communeAdress: any
  // private
  private _unsubscribeAll: Subject<any>;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _addressService: AddressService,
    private _personalService: PersonalService) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.getPersonalView();
  }

  getPersonalView() {
    const routerParams = this.route.snapshot.paramMap
    const personalDeatailId = routerParams.get('id')
    this._personalService
      .getDetailPersonal(personalDeatailId)
      .pipe(takeUntil(this._unsubscribeAll))

      .subscribe(response => {
        console.log(response)
        this.data = response.data
        this.address = response.data.address
        this.birthPlace = response.data.birthPlace
        console.log("address", this.address)
        console.log("birthPlace", this.birthPlace)
        // this.provinceBirth = this._addressService.getProvince(this.birthPlace.)
      });
  }
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
