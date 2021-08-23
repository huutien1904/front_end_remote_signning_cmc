import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-certificate-request-list',
  templateUrl: './certificate-request-list.component.html',
  styleUrls: ['./certificate-request-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CertificateRequestListComponent implements OnInit {
  public moreOption = true;
  public tested = [];
  public test: any = [{name: '1'}, {name: '2'}, {name: '3'}];
  constructor() { }

  ngOnInit(): void {
  }

}
