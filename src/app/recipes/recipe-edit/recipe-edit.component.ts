import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import * as fromApp from "../../store/app.reducer"
import * as ShoppingListActions from "../../shopping-list/store/shopping-list.actions"
import * as RecipesActions from "../store/recipes.actions"
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrl: './recipe-edit.component.css'
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  id: number;
  editMode = false;
  recipeForm: FormGroup;
  storeSubscription: Subscription;

  constructor(private router: Router, private route: ActivatedRoute, private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params["id"];
        this.editMode = params["id"] != null;
        this.initForm();
      }
    );
  }

  ngOnDestroy(): void {
    if (this.storeSubscription) {
      this.storeSubscription.unsubscribe();
    }
  }

  private initForm() {
    let recipeName = "";
    let recipeImagePath = "";
    let recipeDescription = "";
    let recipeIngredients = new FormArray([]);

    if (this.editMode) {
      this.storeSubscription = this.store.select("recipes").subscribe(recipesState => {
        const recipe = recipesState.recipes[this.id];
        recipeName = recipe.name;
        recipeImagePath = recipe.imagePath;
        recipeDescription = recipe.description;
        for (let ingredient of recipe.ingredients) {
          recipeIngredients.push(new FormGroup({
            "name": new FormControl(ingredient.name, Validators.required),
            "amount": new FormControl(ingredient.amount, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
          }));
        }
      });
      // const recipe = this.recipeService.getRecipeFromId(this.id);
      
    }

    this.recipeForm = new FormGroup({
      "name": new FormControl(recipeName, Validators.required),
      "imagePath": new FormControl(recipeImagePath, Validators.required),
      "description": new FormControl(recipeDescription, Validators.required),
      "ingredients": recipeIngredients
    });
  }

  getIngredientsFormControls() {
    return (<FormArray>this.recipeForm.get("ingredients")).controls
  }

  onAddIngredient() {
    (<FormArray>this.recipeForm.get("ingredients")).push(
      new FormGroup({
        "name": new FormControl(null, Validators.required),
        "amount": new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)]),
      })
    );
  }

  onSubmit() {
    // const newRecipe = new Recipe(
    //   this.recipeForm["name"],
    //   this.recipeForm["imagePath"],
    //   this.recipeForm["description"],
    //   this.recipeForm["ingredients"]
    // );
    if (this.editMode) {
      // this.recipeService.updateRecipe(this.id, this.recipeForm.value);
      this.store.dispatch(RecipesActions.UpdateRecipe({index: this.id, recipe: this.recipeForm.value}));
    } else {
      // this.recipeService.addRecipe(this.recipeForm.value);
      this.store.dispatch(RecipesActions.AddRecipe({recipe: this.recipeForm.value}));

    }
    this.onCancel()
  }

  onCancel() {
    if (this.editMode) {
      this.router.navigate(["/recipes", this.id]);
    } else {
      this.router.navigate(["/recipes"]);
    }
  }

  onDeleteIngredient(index: number) {
    (<FormArray>this.recipeForm.get("ingredients")).removeAt(index);
  }
}
