import { createAction, props } from "@ngrx/store";
import { Recipe } from "../recipe.model";

export const SetRecipes = createAction(
    "[Recipes] SetRecipes",
    props<{recipes: Recipe[]}>()
)

export const AddRecipe = createAction(
    "[Recipes] AddRecipe",
    props<{recipe: Recipe}>()
)

export const UpdateRecipe = createAction(
    "[Recipes] UpdateRecipe",
    props<{index: number, recipe: Recipe}>()
)

export const DeleteRecipe = createAction(
    "[Recipes] DeleteRecipe",
    props<{index: number}>()
)

export const FetchRecipes = createAction(
    "[Recipes] FetchRecipes",
)

export const StoreRecipes = createAction(
    "[Recipes] StoreRecipes",
)