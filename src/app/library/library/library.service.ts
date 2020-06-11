import { ILibrary } from './ILibrary';
import { IApplet } from '../IApplet';
import { Injectable } from '@angular/core';
import { ICategory } from './ICategory';
import { from, Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class Library implements ILibrary {
    performance = 'Peformance';
    investments = 'Investments';
    operations = 'Operations';

    constructor() {
        //this.addBigData(100, 5000);
    }

    private _applets: IApplet[] = [
        {
            name: 'Performance Snapshot',
            categories: [this.performance]
        },
        {
            name: 'Commitement Widget',
            categories: [this.investments]
        },
        {
            name: 'CMS',
            categories: [this.investments, this.performance]
        }
    ];

    private _categories: ICategory[] = [
        { category: this.investments, count: this._applets.filter(a => a.categories.indexOf(this.investments) !== -1).length },
        { category: this.operations, count: this._applets.filter(a => a.categories.indexOf(this.operations) !== -1).length },
        { category: this.performance, count: this._applets.filter(a => a.categories.indexOf(this.performance) !== -1).length }];

    get categories(): Observable<ICategory[]> {
        return of(this._categories);
    }

    get applets(): Observable<IApplet[]> {
        return of(this._applets);
    }

    getCategories(): ICategory[] {
        return this._categories;
    }

    appletsCountByCategory(category: string, aplletSearch: string): number {
        const reducer = (accumulator: number, currentValue: IApplet) => {
            if (currentValue.categories.indexOf(category) !== -1
                && (aplletSearch ? (currentValue.name.toLocaleLowerCase().indexOf(aplletSearch.toLocaleLowerCase()) !== -1) : true)) {
                return accumulator += 1;
            }
            return accumulator += 0;
        };
        return this._applets.reduce(reducer, 0);
    }

    addBigData(ncategs: number, napplets: number): void {
        // reset, clean up default data
        this._applets = [];
        this._categories = [];

        // create 100 categories
        for (let i = 0; i < ncategs; i++) {
            this._categories.push({ category: 'Sample Category' + i, count: 0 });
        }

        const n = this._categories.length;

        // create 5000 applets
        for (let i = 0; i < napplets; i++) {
            const a: IApplet = {
                name: 'CMS' + i,
                categories: []
            };
            // add categories up to 10 to the applet
            for (let j = 0; j < Math.floor(Math.random() * 10); ++j) {
                const idx = Math.floor(Math.random() * n) % n;
                this._categories[idx].count++;
                a.categories.push(this._categories[idx].category);
            }

            this._applets.push(a);
        }

        console.log('after insert');
    }

}