import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Library } from './library.service';
import { ILibrary } from './ILibrary';
import { ICategory } from './ICategory';
import { IApplet } from '../IApplet';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { element } from 'protractor';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LibraryComponent {

  constructor(private library: Library) {
  }

  categories$ = this.library.categories;
  applets$ = this.library.applets;

  private searchEnteredSubject = new BehaviorSubject<string>(null);
  searchEntered$ = this.searchEnteredSubject.asObservable();

  private categoriesSelectedSubject = new BehaviorSubject<string>('Investments');
  categorySelected$ = this.categoriesSelectedSubject.asObservable();

  appletsFiltered$ = combineLatest([this.applets$, this.categorySelected$, this.searchEntered$])
    .pipe(
      map(([applets, selectedCategory, search]) =>
        applets.filter(a => selectedCategory ? a.categories.indexOf(selectedCategory) !== -1
          && (search ? a.name.toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) !== -1 : true) : true)
      )
    );

  categoriesFiltered$ = combineLatest([this.categories$, this.searchEntered$])
    .pipe(
      map(([categories, search]) => {
        let selected = false;
        const categs = categories.map(category => {
          category.count = this.library.appletsCountByCategory(category.category, search);
          if (category.selected) {
            selected = true;
          }
          return category;
        });

        const categsFiltered = categs.filter(c => c.count > 0 || (!search));
        if (!selected) {
          categsFiltered[0].selected = true;
        }
        return categsFiltered;
      })
    );

  public onCategorySelected(item) {
    this.categoriesSelectedSubject.next(item.category);
    const categories = this.library.getCategories();
    categories.forEach(i => i.selected = false);
    item.selected = true;
  }

  public onSearch(search: string): void {
    this.searchEnteredSubject.next(search);
  }

}
