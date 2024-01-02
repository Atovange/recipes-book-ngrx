import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Recipe } from "./recipe.model";
import { Observable, map, of, switchMap, take } from "rxjs";
import { Store } from "@ngrx/store";

import * as fromApp from "../store/app.reducer"
import * as RecipesActions from "../recipes/store/recipes.actions"
import { Actions, ofType } from "@ngrx/effects";

@Injectable({providedIn: "root"})
export class RecipesResolverService implements Resolve<Recipe[]> {

    constructor(private store: Store<fromApp.AppState>, private actions$: Actions) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Recipe[] | Observable<Recipe[]> | Promise<Recipe[]> {
        return this.store.select("recipes").pipe(
            take(1),
            map(recipesState => recipesState.recipes),
            switchMap(recipes => {
                if (recipes.length === 0) {
                    this.store.dispatch(RecipesActions.FetchRecipes());
                    return this.actions$.pipe(
                        ofType("[Recipes] SetRecipes"),
                        take(1)
                    );
                } else {
                    return of(recipes);
                }
            }
        ));
    }
}