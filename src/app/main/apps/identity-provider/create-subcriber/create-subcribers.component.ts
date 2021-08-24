import { Component, OnInit ,ViewEncapsulation,ElementRef } from '@angular/core';


@Component({
  selector: 'app-create-subcribers',
  templateUrl: './create-subcribers.component.html',
  styleUrls: ['./create-subcribers.component.scss'],
  encapsulation: ViewEncapsulation.None
})


export class CreateSubcribersComponent implements OnInit {
  // imports: [FeatherIconDirective]
  // declarations: [ FeatherIconDirective]
//   public subcriberP = true
//   public subcriberO = false
  public isTabActive= "false"

  constructor(private el: ElementRef) { }
  create(e){
    let myTag = this.el.nativeElement.querySelector("#modal-dialog-remove");
    let myTagOgn = this.el.nativeElement.querySelector("#modal-dialog-organization");
    if(e.target.value === "thuê bao cá nhân" ){
      
      myTag.classList.remove('modal-dialog'); 
      myTag.classList.add('create-subcriber'); 
      myTagOgn.classList.add('modal-dialog');
    }
    if(e.target.value === "thuê bao tổ chức" ){
      myTag.classList.add('modal-dialog'); 
      myTagOgn.classList.remove('modal-dialog'); 
      myTagOgn.classList.add('create-orgnization'); 
    }
  }
  ngOnInit(): void {
    this.isTabActive = "true"
    let myTag = this.el.nativeElement.querySelector("#modal-dialog-remove");
    myTag.classList.remove('modal-dialog'); 
    myTag.classList.add('create-subcriber'); 
    
    
  }
//   selectSubcriber(e):any{
//     if(e.target.value === "thuê bao cá nhân"){
//       this.subcriberP = true
//       this.subcriberO = false
//     }
//     if(e.target.value === "thuê bao tổ chức"){
//       this.subcriberP = false
//       this.subcriberO = true
//     }
    
//   }

}
