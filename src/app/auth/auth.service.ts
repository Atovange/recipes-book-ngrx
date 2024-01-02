import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";

import * as fromApp from "../store/app.reducer"
import * as AuthActions from "./store/auth.actions"

@Injectable({providedIn: "root"})
export class AuthService {
    // user = new BehaviorSubject<User>(null);
    private tokenExpirationTimer: any;

    constructor(private store: Store<fromApp.AppState>) {}

    // expirationDuration is in ms
    setLogoutTimer(expirationDuration: number) {
        console.log("token expiring in: " + expirationDuration / 1000);
        this.tokenExpirationTimer = setTimeout(() => {
            this.store.dispatch(AuthActions.Logout({infoMessage: "Your session expired"}));
        }, expirationDuration);
    }

    clearLogoutTimer() {
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
            this.tokenExpirationTimer = null;
        }
    }
}