import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LoggingService } from '../logging.service';
import { Store } from '@ngrx/store';

import * as fromApp from "../store/app.reducer"
import * as fromShoppingList from "./store/shopping-list.reducer"
import * as ShoppingListActions from "./store/shopping-list.actions"

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrl: './shopping-list.component.css'
})
export class ShoppingListComponent implements OnInit {
  shoppingListState$: Observable<fromShoppingList.State>;

  constructor(private loggingService: LoggingService, private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.shoppingListState$ = this.store.select("shoppingList");

    this.loggingService.printLog("from ShoppingListComponent ngOnInit");
  }

  onEditItem(index: number) {
    this.store.dispatch(ShoppingListActions.StartEdit({index: index}));
  }
}
