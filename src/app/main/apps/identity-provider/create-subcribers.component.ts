import { Component, OnInit ,ViewEncapsulation} from '@angular/core';


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
  constructor() { }

  ngOnInit(): void {
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
