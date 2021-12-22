import { Component, OnInit, ViewEncapsulation } from '@angular/core';
// import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProfileComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  // // Success
  // toastrSuccess() {
  //   this.toastr.success('👋 Jelly-o macaroon brownie tart ice cream croissant jelly-o apple pie.', 'Success!', {
  //     toastClass: 'toast ngx-toastr',
  //     closeButton: true
  //   });
  // }

  // // Info
  // toastrInfo() {
  //   this.toastr.info('👋 Chupa chups biscuit brownie gummi sugar plum caramels.', 'Info!', {
  //     toastClass: 'toast ngx-toastr',
  //     closeButton: true
  //   });
  // }

  // // Warning
  // toastrWarning() {
  //   this.toastr.warning('👋 Icing cake pudding carrot cake jujubes tiramisu chocolate cake.', 'Warning!', {
  //     toastClass: 'toast ngx-toastr',
  //     closeButton: true
  //   });
  // }

  // // Error
  // toastrError() {
  //   this.toastr.error('👋 Jelly-o marshmallow marshmallow cotton candy dessert candy.', 'Danger!', {
  //     toastClass: 'toast ngx-toastr',
  //     closeButton: true
  //   });
  // }


}
