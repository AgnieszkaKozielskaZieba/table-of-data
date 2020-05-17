import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { TableComponent } from "./table/table.component";
import { FilterFieldsComponent } from "./filter-fields/filter-fields.component";
import { TablePaginationComponent } from './table/table-pagination/table-pagination.component';
import { LoadingComponent } from './loading/loading.component';

@NgModule({
	declarations: [AppComponent, TableComponent, FilterFieldsComponent, TablePaginationComponent, LoadingComponent],
	imports: [BrowserModule, HttpClientModule, FormsModule],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
