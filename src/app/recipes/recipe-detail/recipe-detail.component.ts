import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { switchMap } from 'rxjs';

import * as fromApp from "../../store/app.reducer"
import * as ShoppingListActions from "../../shopping-list/store/shopping-list.actions"
import * as RecipesActions from "../store/recipes.actions"

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrl: './recipe-detail.component.css'
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<fromApp.AppState>) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params["id"];
      // this.recipe = this.recipeService.getRecipeFromId(this.id);
      this.store.select("recipes").subscribe(recipesState => {
        this.recipe = recipesState.recipes[this.id];
      });
    });
  }

  onAddToShopingList() {
    // this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
    this.store.dispatch(ShoppingListActions.AddIngredients({ingredients: this.recipe.ingredients}));
  }

  onDelete() {
    // this.recipeService.deleteRecipe(this.id);
    this.store.dispatch(RecipesActions.DeleteRecipe({index: this.id}));

    this.router.navigate(["/recipes"]);
  }
}
