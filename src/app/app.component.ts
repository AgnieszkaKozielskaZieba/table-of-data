import { Component } from "@angular/core";
import { DataService } from "./shared/data.service";
import { Subscription } from "rxjs";

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"],
})
export class AppComponent {
	title = "table-of-data";
	dataReady = false;
	dataReadySub: Subscription;
	constructor(private dataService: DataService) {
		this.dataReadySub = this.dataService.dataReady.subscribe((val) => {
			this.dataReady = val;
		});
	}

	ngOnInit() {
		this.dataService.prepareData();
	}

	ngOnDestroy() {
		this.dataReadySub.unsubscribe();
	}
}
