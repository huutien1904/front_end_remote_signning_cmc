import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-keypair-list',
  templateUrl: './keypair-list.component.html',
  styleUrls: ['./keypair-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class KeypairListComponent implements OnInit {
  public moreOption = true;
  public tested = [];
  public test: any = [{name: '1'}, {name: '2'}, {name: '3'}];
  public addOption = false
  changeAb(){
    this.addOption = true
  }
  constructor() { }

  ngOnInit(): void {
  }

}
