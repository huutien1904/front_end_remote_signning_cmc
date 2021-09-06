import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-my-ngdropdown',
  templateUrl: './my-ngdropdown.component.html',
  styleUrls: ['./my-ngdropdown.component.scss']
})
export class MyNgdropdownComponent implements OnInit {
  @Input() item;
  constructor() { }

  ngOnInit() {
  }

}
