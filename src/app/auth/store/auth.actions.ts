import { createAction, props } from "@ngrx/store";

export const AutoLogin = createAction(
    "[Auth] AutoLogin"
)

export const Signup = createAction(
    "[Auth] Signup",
    props<{
        email: string,
        password: string
    }>()
);

export const Login = createAction(
    "[Auth] Login",
    props<{
        email: string,
        password: string
    }>()
);

export const AuthenticateSuccess = createAction(
    "[Auth] AuthenticateSuccess",
    props<{
        email: string,
        userId: string,
        token: string,
        expirationDate: Date,
        redirect: boolean
    }>()
);

export const AuthenticateFail = createAction(
    "[Auth] AuthenticateFail",
    props<{errorMessage: string}>()
);

export const Logout = createAction(
    "[Auth] Logout",
    props<{infoMessage: string}>()
);

export const ErrorHandled = createAction(
    "[Auth] ErrorHandled"
);