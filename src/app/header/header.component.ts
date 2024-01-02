import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, map } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromApp from "../store/app.reducer"
import * as AuthActions from "../auth/store/auth.actions"
import * as RecipesActions from "../recipes/store/recipes.actions"

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  private userSubscription: Subscription;

  isAuthenticated = false;

  constructor(private store: Store<fromApp.AppState>) {}
  
  ngOnInit(): void {
    this.userSubscription = this.store
      .select("auth")
      .pipe(map(authState => authState.user))
      .subscribe(user => {
        this.isAuthenticated = !user ? false : true;
      });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  onSaveData() {
    // this.dataStorageService.storeRecipes();
    this.store.dispatch(RecipesActions.StoreRecipes());
  }

  onFetchData() {
    // this.dataStorageService.fetchRecipes().subscribe();
    this.store.dispatch(RecipesActions.FetchRecipes());
  }

  onLogout() {
    // this.authService.logout();
    this.store.dispatch(AuthActions.Logout({infoMessage: "You successfully logged out"}));
  }
}
