import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { Grid } from 'src/app/shared/models/grid.model';
import { GridService } from 'src/app/shared/services/grid.service';
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent {

  
  rows: any = [];
  grid: Grid;
  public currentPageLimit: number = 10;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  ColumnMode = ColumnMode;
  contentHeader: object;
  searchText: string;
  pageLimitOptions = [
    {value: 3},
    {value: 5},
    {value: 10},
    {value: 25},
    {value: 50},
    {value: 100},
    {value: 500},
  ];

  constructor(
    private http:HttpClient,
    private gridService:GridService,
    private route: ActivatedRoute
  ) {}

 

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: "Projects",
      actionButton: true,
      breadcrumb: {
        type: "",
        links: [
          {
            name: "Home",
            isLink: true,
            link: `/dashboard`,
          },
          {
            name: "Projects",
            isLink: false,
          },
        ],
      },
    };
    this.grid = new Grid(`${environment.apiUrl}projects`, this.http,this.gridService);
    this.grid.findOpion.orderby = "Id";
    this.grid.findOpion.isDescending = false;
    this.grid.find();
  }

  public onPageChange(event: any) {
    this.grid.findOpion.page = event.page;
    this.grid.find();
  }

  public onSort(event: any) {
    this.grid.findOpion.orderby = event.column.prop;
    this.grid.findOpion.isDescending = event.newValue == "asc" ? false : true;
    this.grid.find();
  }

  public onLimitChange(limit: any): void {
    this.changePageLimit(limit);
    this.table.limit = this.currentPageLimit;
    this.table.recalculate();
    setTimeout(() => {
      // if (this.table.bodyComponent.temp.length <= 0) {
      //   this.table.offset = Math.floor(
      //     (this.table.rowCount - 1) / this.table.limit
      //   );
      // }
      this.grid.findOpion.size = this.currentPageLimit;
      this.grid.find();
    });
  }
  private changePageLimit(limit: any): void {
    this.currentPageLimit = parseInt(limit, 10);
  }

}
