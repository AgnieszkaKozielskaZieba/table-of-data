import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
	title = "table-of-data";
	companiesData = [];
	sortedBy = "";
	sortDirection = 1;
	dataReady = false;
	constructor(private http: HttpClient) {}

	getIncomeData(urlID) {
		let url = `https://recruitment.hal.skygate.io/incomes/${urlID}`;
		return this.http
			.get<{
				id: number;
				incomes: [
					{
						value: string;
						date: string;
					}
				];
			}>(url)
			.pipe(
				map((income) => {
					let totalIncome = +income.incomes.reduce((acc, val) => {
						acc = +(acc + +val.value).toFixed(2);
						return acc;
					}, 0);
					let averageIncome = +(
						totalIncome / income.incomes.length
					).toFixed(2);
					let lastMonthIncome = +income.incomes
						.filter((el) => {
							let monthAgo = new Date();
							monthAgo.setMonth(monthAgo.getMonth() - 1);
							let elDate = new Date(el.date);
							let dateDiff = +elDate - +monthAgo;
							if (dateDiff > 0) {
								return true;
							} else {
								return false;
							}
						})
						.reduce((acc, val) => {
							acc = +(acc + +val.value).toFixed(2);
							return acc;
						}, 0);

					return {
						totalIncome: totalIncome,
						averageIncome: averageIncome,
						lastMonthIncome: lastMonthIncome,
					};
				})
			);
	}

	getCompaniesData() {
		return this.http.get<[]>(
			"https://recruitment.hal.skygate.io/companies"
		);
	}

	prepareData() {
		this.getCompaniesData().subscribe((data) => {
			let dataWithIncome = [];
			let promises = [];
			data.forEach((el: { id: number }) => {
				let newPromise = this.getIncomeData(el.id)
					.toPromise()
					.then((incomeData) => {
						dataWithIncome.push({ ...el, ...incomeData });
					});
				promises.push(newPromise);
			});
			Promise.all(promises).then(() => {
				this.companiesData = dataWithIncome;
				this.sortData("id");
				this.dataReady = true;
			});
		});
	}

	sortData(method: string) {
		if (this.sortedBy === method) {
			this.sortDirection = this.sortDirection === 1 ? -1 : 1;
		} else {
			this.sortDirection = 1;
		}
		this.companiesData.sort((a, b) => {
			if (a[method] > b[method]) return 1 * this.sortDirection;
			if (a[method] < b[method]) return -1 * this.sortDirection;
			return 0;
		});
		this.sortedBy = method;
	}

	ngOnInit() {
		this.prepareData();
	}
}
