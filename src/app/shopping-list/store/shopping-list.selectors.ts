import * as fromApp from "../../store/app.reducer"
import * as fromShoppingList from "./shopping-list.reducer"

export const editingIngredientSelector = (state: fromApp.AppState) => state.shoppingList.editingIngredient;