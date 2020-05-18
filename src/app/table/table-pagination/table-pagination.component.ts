import { Component, OnDestroy } from "@angular/core";
import { TablePaginationService } from "./table-pagination.service";
import { Subscription } from "rxjs";

@Component({
	selector: "app-table-pagination",
	templateUrl: "./table-pagination.component.html",
	styleUrls: ["./table-pagination.component.scss"],
})
export class TablePaginationComponent implements OnDestroy {
	pagesNumber: number;
	pagesNumberSubscr: Subscription;
	currentPageSubscr: Subscription;
	currentPage: number = 1;

	constructor(private tablePagService: TablePaginationService) {
		this.pagesNumberSubscr = this.tablePagService.numberOfPages.subscribe(
			(num) => {
				this.pagesNumber = num;
				console.log(this.pagesNumber);
			}
		);
		this.currentPageSubscr = this.tablePagService.currentPageSub.subscribe(
			(num) => {
				this.currentPage = num;
			}
		);
	}

	onInput(inputField) {
		if (inputField.value > this.pagesNumber)
			inputField.value = this.pagesNumber;
		if (inputField.value < 1) inputField.value = 1;
		this.onSetCurrentPage();
	}

	onSetCurrentPage() {
		if (this.currentPage < 1) this.currentPage = 1;
		if (this.currentPage > this.pagesNumber)
			this.currentPage = this.pagesNumber;
		this.tablePagService.setCurrentPage(this.currentPage);
	}
	onPageIncrement() {
		if (this.currentPage < this.pagesNumber) {
			this.currentPage++;
			this.onSetCurrentPage();
		}
	}
	onPageDecrement() {
		if (this.currentPage > 1) {
			this.currentPage--;
			this.onSetCurrentPage();
		}
	}

	ngOnDestroy() {
		this.pagesNumberSubscr.unsubscribe();
		this.currentPageSubscr.unsubscribe();
	}
}
