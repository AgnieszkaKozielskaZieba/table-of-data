import { Component, OnInit } from "@angular/core";
import { DataService } from "../shared/data.service";
@Component({
	selector: "app-filter-fields",
	templateUrl: "./filter-fields.component.html",
	styleUrls: ["./filter-fields.component.scss"],
})
export class FilterFieldsComponent {
	hideFilterFields: boolean = true;
	filteringData = {};

	constructor(private dataService: DataService) {}

	onFilterChange(field, fieldName: string = field.name) {
		this.filteringData[fieldName] = field.value;
		for (let key in this.filteringData) {
			if (!this.filteringData[key]) delete this.filteringData[key];
			if (typeof this.filteringData[key] === "object") {
				let emptyObj = true;
				for (let k in this.filteringData[key]) {
					if (this.filteringData[key][k]) emptyObj = false;
				}
				if (emptyObj) delete this.filteringData[key];
			}
		}
		this.dataService.filterData(this.filteringData);
	}
}
