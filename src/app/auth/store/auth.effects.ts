import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, of, switchMap, tap } from "rxjs";

import * as AuthActions from "./auth.actions"
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Router } from "@angular/router";
import { User } from "../user.model";
import { AuthService } from "../auth.service";

export interface AuthResponseData {
    idToken: string,
    email: string,
    refreshToken: string,
    expiresIn: string,
    localId: string
    registered?: string
}

@Injectable()
export class AuthEffects {

    authSignup$ = createEffect(
        () => this.actions$.pipe(
            ofType(AuthActions.Signup),
            switchMap(signupData => {
                return this.http.post<AuthResponseData>(
                    "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" + environment.firebaseAPIKey,
                    {
                        email: signupData.email,
                        password: signupData.password,
                        returnSecureToken: true
                    }
                ).pipe(
                    tap(responseData => {
                        this.authService.setLogoutTimer(+responseData.expiresIn * 1000)
                    }),
                    map(this.handleAuthentication),
                    catchError(this.handleError)
                );
            })
        )
    );

    authLogin$ = createEffect(
        () => this.actions$.pipe(
            ofType(AuthActions.Login),
            switchMap(loginData => {
                return this.http.post<AuthResponseData>(
                    "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" + environment.firebaseAPIKey,
                    {
                        email: loginData.email,
                        password: loginData.password,
                        returnSecureToken: true
                    }
                ).pipe(
                    tap(responseData => {
                        this.authService.setLogoutTimer(+responseData.expiresIn * 1000)
                    }),
                    map(this.handleAuthentication),
                    catchError(this.handleError)
                );
            })
        ),
        // {dispatch: false}
    );

    authRedirect$ = createEffect(
        () => this.actions$.pipe(
            ofType(AuthActions.AuthenticateSuccess),
            tap((authSuccessAction) => {
                if (authSuccessAction.redirect) {
                    this.router.navigate(["/"]);
                }
            })
        ),
        {dispatch: false}
    );

    authLogout$ = createEffect(
        () => this.actions$.pipe(
            ofType(AuthActions.Logout),
            tap(() => {
                this.authService.clearLogoutTimer();
                localStorage.removeItem("userData");
                this.router.navigate(["/auth"]);
            })
        ),
        {dispatch: false}
    )

    autoLogin$ = createEffect(
        () => this.actions$.pipe(
            ofType(AuthActions.AutoLogin),
            map(() => {
                const userData: {
                    email: string,
                    id: string,
                    _token: string,
                    _tokenExpirationDate: string
                } = JSON.parse(localStorage.getItem("userData"));
        
                if (!userData) {
                    return { type: "DUMMY" };
                }
                
                const loadedUser = new User(
                    userData.email,
                    userData.id,
                    userData._token,
                    new Date(userData._tokenExpirationDate)
                );
        
                if (loadedUser.token) {
                    const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
                    this.authService.setLogoutTimer(expirationDuration);
                    return AuthActions.AuthenticateSuccess({
                            email: loadedUser.email,
                            userId: loadedUser.id,
                            token: loadedUser.token,
                            expirationDate: new Date(userData._tokenExpirationDate),
                            redirect: false
                    });
                }

                return { type: "DUMMY" };
            })
        )
    )

    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private router: Router,
        private authService: AuthService) {}

    private handleAuthentication(authResponseData: AuthResponseData) {
        const expirationDate = new Date(new Date().getTime() + +authResponseData.expiresIn * 1000);
        const user = new User(
            authResponseData.email,
            authResponseData.localId,
            authResponseData.idToken,
            expirationDate
        );
        localStorage.setItem("userData", JSON.stringify(user));
        return AuthActions.AuthenticateSuccess({
            email: authResponseData.email,
            userId: authResponseData.localId,
            token: authResponseData.idToken,
            expirationDate: expirationDate,
            redirect: true
        });
    }

    private handleError(errorResponse: any) {
        let errorMessage = "";
        if (!errorResponse.error || !errorResponse.error.error) {
            console.log(errorResponse);
            errorMessage = "Unexpected error"
            // return throwError(() => new Error(errorMessage));
            return of(AuthActions.AuthenticateFail({errorMessage}));
        }
        switch (errorResponse.error.error.message) {
            case "EMAIL_EXISTS":
                errorMessage = "Email already in use";
                break;
            case "INVALID_LOGIN_CREDENTIALS":
                errorMessage = "Invalid login credentials";
                break;
            default:
                errorMessage = "An error occurred!";
        };
        // return throwError(() => new Error(errorMessage));
        return of(AuthActions.AuthenticateFail({errorMessage}));
    }

    
}