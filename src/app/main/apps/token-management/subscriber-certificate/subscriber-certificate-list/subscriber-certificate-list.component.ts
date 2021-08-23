import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-subscriber-certificate-list',
  templateUrl: './subscriber-certificate-list.component.html',
  styleUrls: ['./subscriber-certificate-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SubscriberCertificateListComponent implements OnInit {
  public moreOption = true;
  public tested = [];
  public test: any = [{name: '1'}, {name: '2'}, {name: '3'}];
  constructor() { }

  ngOnInit() {
  }

}
