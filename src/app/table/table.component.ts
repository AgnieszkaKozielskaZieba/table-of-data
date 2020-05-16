import { Component, OnInit, OnDestroy } from "@angular/core";
import { DataService } from "../shared/data.service";
import { Subscription } from "rxjs";

@Component({
	selector: "app-table",
	templateUrl: "./table.component.html",
	styleUrls: ["./table.component.scss"],
})
export class TableComponent implements OnInit {
	companiesData = [];
	dataReady = false;
	dataSubscr: Subscription;
	dataReadySub: Subscription;
	numberOfPages: number;
	numberOfItemsPerPage = 20;
	currentPage = 1;
	dataToDisplay = [];

	constructor(private dataService: DataService) {
		this.dataSubscr = this.dataService.dataToDisplay.subscribe((data) => {
			this.companiesData = data;
			this.numberOfPages = Math.ceil(
				this.companiesData.length / this.numberOfItemsPerPage
			);
			this.dataToDisplay = this.companiesData.slice(
				0,
				this.numberOfItemsPerPage
			);
			console.log(this.dataToDisplay);
		});
		this.dataReadySub = this.dataService.dataReady.subscribe((val) => {
			this.dataReady = val;
		});
	}

	sortData(method: string) {
		this.dataService.sortData(method);
	}
	setCurrentPage(page) {
		this.currentPage = page;
		this.dataToDisplay = this.companiesData.slice(
			this.numberOfItemsPerPage * (this.currentPage - 1),
			this.numberOfItemsPerPage * this.currentPage
		);
	}

	ngOnInit() {
		this.dataService.prepareData();
	}

	ngOnDestroy() {
		this.dataSubscr.unsubscribe();
		this.dataReadySub.unsubscribe();
	}
}
