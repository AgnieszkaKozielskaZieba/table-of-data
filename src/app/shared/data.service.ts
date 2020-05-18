import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Subject, Observable } from "rxjs";
import { map, tap } from "rxjs/operators";

@Injectable({
	providedIn: "root",
})
export class DataService {
	companiesData = [];
	filteredData = [];
	dataToDisplay: Subject<any[]> = new Subject<any[]>();
	sortedBy = "";
	sortDirection = 1;
	dataReady = new Subject<boolean>();
	latestIncomesDates: number[] = [];
	lastMonthDate: Date;
	constructor(private http: HttpClient) {}

	private getIncomeData(urlID) {
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
				tap((income) => {
					let allDates = [];
					income.incomes.forEach((el) => {
						allDates.push(+new Date(el.date));
					});
					let newestIncomeDate = Math.max(...allDates);
					this.latestIncomesDates.push(newestIncomeDate);
				})
			);
	}

	private getCompaniesData() {
		return this.http.get<[]>(
			"https://recruitment.hal.skygate.io/companies"
		);
	}

	private calculateIncomeData(incomes: { value: number; date: string }[]) {
		let totalIncome = +incomes.reduce((acc, val) => {
			acc = +(acc + +val.value).toFixed(2);
			return acc;
		}, 0);
		let averageIncome = +(totalIncome / incomes.length).toFixed(2);

		let lastMonthIncome = incomes
			.filter((el) => {
				let elDate = new Date(el.date);
				let dateDiff = +elDate - +this.lastMonthDate;
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
	}

	prepareData() {
		this.getCompaniesData().subscribe((data) => {
			let dataWithIncome = [];
			let promises = [];
			data.forEach((el: { id: number }) => {
				let newPromise = this.getIncomeData(el.id)
					.toPromise()
					.then((incomeData) => {
						dataWithIncome.push({
							...el,
							incomes: incomeData.incomes,
						});
					});
				promises.push(newPromise);
			});
			Promise.all(promises).then(() => {
				let latestIncome = new Date(
					Math.max(...this.latestIncomesDates)
				);
				this.lastMonthDate = latestIncome;
				this.lastMonthDate.setMonth(this.lastMonthDate.getMonth() - 1);
				dataWithIncome = dataWithIncome.map((el) => {
					return {
						id: el.id,
						name: el.name,
						city: el.city,
						...this.calculateIncomeData(el.incomes),
					};
				});

				this.companiesData = dataWithIncome;
				this.filteredData = this.companiesData;
				this.sortData("id");
				this.dataReady.next(true);
				this.dataToDisplay.next(this.filteredData);
			});
		});
	}

	sortData(method: string) {
		if (this.sortedBy === method) {
			this.sortDirection = this.sortDirection === 1 ? -1 : 1;
		} else {
			this.sortDirection = 1;
		}
		this.filteredData.sort((a, b) => {
			if (a[method] > b[method]) return 1 * this.sortDirection;
			if (a[method] < b[method]) return -1 * this.sortDirection;
			return 0;
		});
		this.sortedBy = method;
		this.dataToDisplay.next(this.filteredData);
	}

	filterData(filteringData) {
		let filteredData = this.companiesData.filter((el) => {
			for (let fd in filteringData) {
				if (typeof filteringData[fd] === "string") {
					if (typeof el[fd] === "string") {
						if (
							!el[fd]
								.toUpperCase()
								.includes(filteringData[fd].toUpperCase())
						)
							return false;
					}
					if (typeof el[fd] === "number") {
						if (el[fd] != filteringData[fd]) return false;
					}
				}
				if (typeof filteringData[fd] === "object") {
					if (
						filteringData[fd].min &&
						el[fd] < +filteringData[fd].min
					)
						return false;
					if (
						filteringData[fd].max &&
						el[fd] > +filteringData[fd].max
					)
						return false;
				}
			}
			return true;
		});
		this.filteredData = filteredData;
		this.dataToDisplay.next(this.filteredData);
	}
}
