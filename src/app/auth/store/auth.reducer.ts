import { createReducer, on } from "@ngrx/store";
import { User } from "../user.model";

import * as AuthActions from "./auth.actions"

export interface State {
    user: User,
    authErrorMessage: string,
    infoMessage: string,
    isLoading: boolean
}

const initialState: State = {
    user: null,
    authErrorMessage: null,
    infoMessage: null,
    isLoading: false
}

export const authReducer = createReducer(
    initialState,
    on(AuthActions.AuthenticateSuccess, (state, action) => {
        const user = new User(
            action.email,
            action.userId,
            action.token,
            action.expirationDate
        );

        return {
            ...state,
            user: user,
            authErrorMessage: null,
            isLoading: false
        };
    }),
    on(AuthActions.Logout, (state, action) => {
        return {
            ...state,
            user: null,
            infoMessage: action.infoMessage
        };
    }),
    on(AuthActions.Login, AuthActions.Signup, (state, action) => {
        return {
            ...state,
            authErrorMessage: null,
            isLoading: true
        };
    }),
    on(AuthActions.AuthenticateFail, (state, action) => {
        return {
            ...state,
            user: null,
            authErrorMessage: action.errorMessage,
            isLoading: false
        };
    }),
    on(AuthActions.ErrorHandled, (state, action) => {
        return {
            ...state,
            authErrorMessage: null
        };
    }),
);