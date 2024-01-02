import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, switchMap, withLatestFrom } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Recipe } from "../recipe.model";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";

import * as RecipesActions from "./recipes.actions"
import * as fromApp from "../../store/app.reducer"

const backendUrl = "https://ng-course-recipes-book-1e0a4-default-rtdb.europe-west1.firebasedatabase.app/"

@Injectable()
export class RecipesEffects {
    fetchRecipes = createEffect(() => this.actions$.pipe(
        ofType(RecipesActions.FetchRecipes),
        switchMap(() => {
            return this.http.get<Recipe[]>(backendUrl + "recipes.json");
        }),
        map(recipes => {
            return recipes.map(recipe => {
                return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
            });
        }),
        map(recipes => {
            return RecipesActions.SetRecipes({recipes: recipes});
        })
    ));

    storeRecipes = createEffect(() => this.actions$.pipe(
        ofType(RecipesActions.StoreRecipes),
        withLatestFrom(this.store.select("recipes")),
        switchMap(([actionData, recipesState]) => {
            return this.http.put(backendUrl + "recipes.json", recipesState.recipes);
        }),
    ), {dispatch: false});

    constructor(private actions$: Actions, private http: HttpClient, private store: Store<fromApp.AppState>) {}
}