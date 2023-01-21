import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { GridService } from '../services/grid.service';
import { FindOpion } from './FindOpion.model';

export class Grid {
  public orderBy: string = '';
  private _orderBy: string = '';
  public isDesc: boolean = false;
  private _isDesc: boolean = false;
  public filter: any = {};
  private url: string = '';
  public rows: any[] = [];

  public findOpion: FindOpion = new FindOpion();

  constructor(url: string, private http: HttpClient,private gridService:GridService) {
    this.findOpion = new FindOpion();
    this.url = url;
  }

  public reset() {
    this.findOpion.page = 1;
    this.orderBy = this._orderBy;
    this.isDesc = this._isDesc;
    this.rows = [];
    this.find();
  }

  public find() {
    this.gridService.getGrid(`${this.url}?${this.toParams()}`).subscribe(
      (d: any) => {
        this.rows = d.Rows;
        this.findOpion.total = d.TotalRows;
      },
      (e) => {
      }
    );
  }

  public toParams() {
    var params =
      'page=' +
      this.findOpion.page +
      '&pageSize=' +
      this.findOpion.size +
      '&orderBy=' +
      this.toPascalCase(this.findOpion.orderby) +
      '&isDescending=' +
      (this.findOpion.isDescending ? true : false);
    for (var key in this.filter) {
      if (this.filter[key])
        params += '&' + key + '=' + escape(this.filter[key]);
    }

    return params;
  }

  public toPascalCase(sentence: any) {
    return sentence
      .split(' ')
      .map((word:any) => word[0].toUpperCase().concat(word.slice(1)))
      .join('');
  }
}
