import { createReducer, on } from "@ngrx/store";
import { Ingredient } from "../../shared/ingredient.model";

import * as ShoppingListActions from "./shopping-list.actions"

export interface State {
    ingredients: Ingredient[],
    editingIngredient: Ingredient,
    editingIngredientIndex: number
}

const initialState: State = {
    ingredients: [
        new Ingredient("Apple", 12),
        new Ingredient("Flour", 1),
    ],
    editingIngredient: null,
    editingIngredientIndex: -1
};

export const shoppingListReducer = createReducer(
    initialState,
    on(ShoppingListActions.AddIngredient, (state, action) => {
        return {
            ...state,
            ingredients: [...state.ingredients, action.ingredient]
        };
    }),
    on(ShoppingListActions.AddIngredients, (state, action) => {
        return {
            ...state,
            ingredients: [...state.ingredients, ...action.ingredients]
        };
    }),
    on(ShoppingListActions.UpdateIngredient, (state, action) => {
        const currentIngredient = state.ingredients[state.editingIngredientIndex];
        const updatedIngredient = {
            ...currentIngredient,
            ...action.ingredient
        };

        const updatedIngredients = [...state.ingredients];
        updatedIngredients[state.editingIngredientIndex] = updatedIngredient;
        
        return {
            ...state,
            ingredients: updatedIngredients,
            editingIngredient: null,
            editingIngredientIndex: -1
        };
    }),
    on(ShoppingListActions.DeleteIngredient, (state, action) => {
        const updatedIngredients = [...state.ingredients];

        if (state.editingIngredientIndex != -1) {
            updatedIngredients.splice(state.editingIngredientIndex, 1);
        }

        return {
            ...state,
            ingredients: updatedIngredients,
            editingIngredient: null,
            editingIngredientIndex: -1
        };
    }),
    on(ShoppingListActions.StartEdit, (state, action) => {
        return {
            ...state,
            editingIngredient: {...state.ingredients[action.index]},
            editingIngredientIndex: action.index
        };
    }),
    on(ShoppingListActions.StopEdit, (state) => {
        return {
            ...state,
            editingIngredient: null,
            editingIngredientIndex: -1
        };
    }),
)