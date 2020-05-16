import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
	selector: "app-table-pagination",
	templateUrl: "./table-pagination.component.html",
	styleUrls: ["./table-pagination.component.scss"],
})
export class TablePaginationComponent implements OnInit {
	@Input() pagesNumber: number;
	currentPage: number = 1;
	@Output() currentPageE: EventEmitter<number> = new EventEmitter<number>();

	constructor() {}

	ngOnInit() {}
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
		this.currentPageE.emit(this.currentPage);
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
}
