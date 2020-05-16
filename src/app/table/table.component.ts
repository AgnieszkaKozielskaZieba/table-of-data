import { Component, OnDestroy } from "@angular/core";
import { DataService } from "../shared/data.service";
import { TablePaginationService } from "./table-pagination/table-pagination.service";
import { Subscription } from "rxjs";

@Component({
	selector: "app-table",
	templateUrl: "./table.component.html",
	styleUrls: ["./table.component.scss"],
})
export class TableComponent implements OnDestroy {
	dataSubscr: Subscription;
	dataToDisplay = [];

	constructor(
		private dataService: DataService,
		private tablePagService: TablePaginationService
	) {
		this.dataSubscr = this.tablePagService.dataToDisplay.subscribe(
			(data) => {
				this.dataToDisplay = data;
			}
		);
	}

	sortData(method: string) {
		this.dataService.sortData(method);
	}

	ngOnDestroy() {
		this.dataSubscr.unsubscribe();
	}
}
