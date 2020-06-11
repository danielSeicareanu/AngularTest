import { IApplet } from '../IApplet';
import { ICategory } from './ICategory';
import { Observable } from 'rxjs';

export interface ILibrary{
    categories: Observable<ICategory[]>;
    applets: Observable<IApplet[]>;
    addBigData(ncategs: number, napplets: number): void;
}