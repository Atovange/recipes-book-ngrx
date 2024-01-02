import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Ingredient } from '../../shared/ingredient.model';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromApp from "../../store/app.reducer"
import * as fromShoppingList from "../store/shopping-list.reducer"
import * as ShoppingListActions from "../store/shopping-list.actions"
import { editingIngredientSelector } from '../store/shopping-list.selectors';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrl: './shopping-edit.component.css'
})
export class ShoppingEditComponent implements OnInit, OnDestroy {  
  @ViewChild("ingredientForm") ingredientForm: NgForm;

  ingredientSelectedSubscription: Subscription;
  editMode = false;
  editingItem: Ingredient;

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.ingredientSelectedSubscription = this.store.select(editingIngredientSelector).subscribe((editingIgredient) => {
      console.log("updating edit mode");
      if (editingIgredient) {
        this.editMode = true;
        this.editingItem = editingIgredient;
        this.ingredientForm.setValue({
          name: this.editingItem.name,
          amount: this.editingItem.amount
        });
      } else {
        this.editMode = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.ingredientSelectedSubscription.unsubscribe();
    this.store.dispatch(ShoppingListActions.StopEdit());
  }

  onAdd() {
    if (this.ingredientForm.invalid) {
      return;
    }
    const value = this.ingredientForm.value;
    const ingredientName = value.name;
    const ingredientAmount = parseInt(value.amount);
    const newIngredient = new Ingredient(ingredientName, ingredientAmount);
    if (this.editMode) {
      this.store.dispatch(ShoppingListActions.UpdateIngredient({ingredient: newIngredient}));
    } else {
      this.store.dispatch(ShoppingListActions.AddIngredient({ingredient: newIngredient}));
    }
    this.ingredientForm.reset();
    this.editMode = false;
  }

  onDelete() {
    this.store.dispatch(ShoppingListActions.DeleteIngredient());
    this.onClear();
  }

  onClear() {
    this.ingredientForm.reset();
    this.editMode = false;
    this.store.dispatch(ShoppingListActions.StopEdit());
  }
}
