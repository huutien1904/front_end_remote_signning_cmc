import { Component, OnInit,Input } from '@angular/core';
import { PersonalListService } from '../personal-list.service';

@Component({
  selector: 'app-table-personal-list',
  templateUrl: './table-personal-list.component.html',
  styleUrls: ['./table-personal-list.component.scss']
})
export class TablePersonalListComponent implements OnInit {
  public rows;
  public pageAdvancedEllipses = 1;
  public totalItems:number;
  public totalPages:number ;
  public page = 0;
  @Input() itemOnPage;
  constructor(private _userListService: PersonalListService,) { }

  ngOnInit() : void{
    this._userListService.getData(this.page,this.itemOnPage).subscribe((respon:any) =>{
      this.totalPages = respon.data.totalPages * 10
      this.rows = respon.data.data;
    });
  }
  changePage(e){
    console.log(typeof(e))
    this.page = e
    this._userListService.getData(e-1,this.itemOnPage).subscribe((respon:any) =>{
      this.rows = respon.data.data;
    })
  }
  selectItem(e){
    console.log(e)
    const item = Number(e)
    this.itemOnPage = Number(e)
    this._userListService.getData(this.page,item).subscribe((respon:any) =>{
      this.totalPages = respon.data.totalPages * 10
      this.rows = respon.data.data;
    })
  }
  updateTable(){
    this._userListService.getData(this.page,this.itemOnPage).subscribe((respon:any) =>{
      this.rows = respon.data.data;
    })
  }
}
