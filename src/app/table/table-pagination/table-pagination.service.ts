import { Injectable } from "@angular/core";
import { DataService } from "../shared/data.service";
import { Subscription } from "rxjs";

@Injectable({
	providedIn: "root",
})
export class TablePaginationService {
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

	setCurrentPage(page) {
		this.currentPage = page;
		if (this.currentPage < 1) this.currentPage = 1;
		if (this.currentPage > this.pagesNumber)
			this.currentPage = this.pagesNumber;
		this.dataToDisplay = this.companiesData.slice(
			this.numberOfItemsPerPage * (this.currentPage - 1),
			this.numberOfItemsPerPage * this.currentPage
		);
	}

	ngOnDestroy() {
		this.dataSubscr.unsubscribe();
		this.dataReadySub.unsubscribe();
	}
}
