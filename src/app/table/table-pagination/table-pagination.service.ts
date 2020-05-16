import { Injectable } from "@angular/core";
import { DataService } from "../../shared/data.service";
import { Subscription, Subject } from "rxjs";

@Injectable({
	providedIn: "root",
})
export class TablePaginationService {
	companiesData = [];
	dataSubscr: Subscription;
	numberOfPages: Subject<number> = new Subject<number>();
	numberOfItemsPerPage = 20;
	currentPage = 1;
	currentPageSub: Subject<number> = new Subject<number>();
	dataToDisplay: Subject<any[]> = new Subject<any[]>();

	constructor(private dataService: DataService) {
		this.dataSubscr = this.dataService.dataToDisplay.subscribe((data) => {
			this.companiesData = data;
			this.numberOfPages.next(
				Math.ceil(this.companiesData.length / this.numberOfItemsPerPage)
			);
			this.currentPageSub.next(1);
			this.dataToDisplay.next(
				this.companiesData.slice(0, this.numberOfItemsPerPage)
			);
		});
	}

	setCurrentPage(page) {
		this.currentPageSub.next(page);
		this.dataToDisplay.next(
			this.companiesData.slice(
				this.numberOfItemsPerPage * (page - 1),
				this.numberOfItemsPerPage * page
			)
		);
	}

	ngOnDestroy() {
		this.dataSubscr.unsubscribe();
	}
}
