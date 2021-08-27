import { Component, OnInit ,ViewEncapsulation,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-create-subscribers',
  templateUrl: './create-subscribers.component.html',
  styleUrls: ['./create-subscribers.component.scss'],
  encapsulation: ViewEncapsulation.None
})


export class CreateSubcribersComponent implements OnInit {
  
  public selectFormP = false;
  public selectFormO = false;
  public contentHeader: object;
  formSelectSearch: FormGroup;
  constructor(private fb: FormBuilder,private el: ElementRef) { }
  public searchType = [
    {
      id: 1,
      key:"Thuê bao cá nhân",
      name: "Thuê bao cá nhân"
    }, 
    {
      id: 2,
      key:"Thuê bao tổ chức",
      name: "Thuê bao tổ chức"
    }, 
    
  ]  
  changeSelect(e){
      let myTag = this.el.nativeElement.querySelector("#modal-dialog-remove");
      console.log(e.key,myTag)
      myTag.classList.remove('modal-dialog'); 
      myTag.classList.add('create-subcriber');
      let myTagOgn = this.el.nativeElement.querySelector("#modal-dialog-organization");
      myTagOgn.classList.remove('modal-dialog'); 
      myTagOgn.classList.add('create-orgnization');
    //   console.log(myTag)
    // if(e.key === "Thuê bao cá nhân"){
    //   console.log(e.key)
    //   this.selectFormP = true;
    //   this.selectFormO= false;
    //   let myTag = document.querySelector("app-new-personal-sidebar");
    //   console.log(myTag)
    //   myTag.classList.remove('modal-dialog'); 
    //   myTag.classList.add('create-subcriber'); 
    // }
    // if(e.key === "Thuê bao tổ chức"){
    //   this.selectFormP = false;
    //   this.selectFormO= true;
    //   let myTagOgn = this.el.nativeElement.querySelector("#modal-dialog-organization");
    //   myTagOgn.classList.remove('modal-dialog'); 
    //   myTagOgn.classList.add('create-orgnization');
    // }
    
  }
  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Tạo mới thuê bao',
      actionButton: true,
      breadcrumb: {
        type: 'chevron',
        links: [
          {
            name: 'Thuê bao',
            isLink: true,
            link: '/apps/tm/search'
          },
          {
            name: 'Tạo mới thuê bao',
            isLink: false
          }
        ]
      }
    };
    this.formSelectSearch = this.fb.group({
      searchType : [null, Validators.required]
    })
    // let myTag = this.el.nativeElement.querySelector("#modal-dialog-remove");
    // myTag.classList.remove('modal-dialog'); 
    // myTag.classList.add('create-subcriber'); 
    // let myTagOgn = this.el.nativeElement.querySelector("#modal-dialog-organization");
    // myTagOgn.classList.remove('modal-dialog'); 
    // myTagOgn.classList.add('create-orgnization'); 
    
  }


}
