import { createAction, props } from "@ngrx/store";
import { Ingredient } from "../../shared/ingredient.model";

export const AddIngredient = createAction(
    "[ShoppingList] AddIngredient",
    props<{ingredient: Ingredient}>()
);

export const AddIngredients = createAction(
    "[ShoppingList] AddIngredients",
    props<{ingredients: Ingredient[]}>()
);

export const UpdateIngredient = createAction(
    "[ShoppingList] UpdateIngredient",
    props<{ingredient: Ingredient}>()
);

export const DeleteIngredient = createAction(
    "[ShoppingList] DeleteIngredient"
);

export const StartEdit = createAction(
    "[ShoppingList] StartEdit",
    props<{index: number}>()
)

export const StopEdit = createAction(
    "[ShoppingList] StopEdit"
)