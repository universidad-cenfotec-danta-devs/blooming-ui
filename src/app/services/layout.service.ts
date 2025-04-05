import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class LayoutService{
  private unsuscriber: Subject<any> = new Subject();
  private pageTitle = new BehaviorSubject<string>('');
  private pageDescription = new BehaviorSubject<string>('');
  public title = this.pageTitle.asObservable();
  public description = this.pageDescription.asObservable();

  public setTitle(title: string){
    this.pageTitle.next(title);
  }

  public setDescription(descripcion:string){
    this.pageDescription.next(descripcion)
  }

  ngOnDestroy(): void{
    this.unsuscriber.complete();
  }

}
