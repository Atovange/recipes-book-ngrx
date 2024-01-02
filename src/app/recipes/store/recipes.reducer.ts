import { createReducer, on } from "@ngrx/store";
import { Recipe } from "../recipe.model";

import * as RecipesActions from "./recipes.actions"

export interface State {
    recipes: Recipe[]
}

const initialState: State = {
    recipes: []
}

export const recipesReducer = createReducer(
    initialState,
    on(RecipesActions.SetRecipes, (state, action) => {
        return {
            ...state,
            recipes: [...action.recipes]
        }
    }),
    on(RecipesActions.AddRecipe, (state, action) => {
        return {
            ...state,
            recipes: [...state.recipes, action.recipe]
        }
    }),
    on(RecipesActions.UpdateRecipe, (state, action) => {
        const updatedRecipes = [...state.recipes]
        updatedRecipes[action.index] = action.recipe

        return {
            ...state,
            recipes: updatedRecipes
        }
    }),
    on(RecipesActions.DeleteRecipe, (state, action) => {
        const updatedRecipes = [...state.recipes]
        updatedRecipes.splice(action.index, 1);

        return {
            ...state,
            recipes: updatedRecipes
        }
    }),
)