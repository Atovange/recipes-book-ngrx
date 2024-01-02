import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { PlaceholderDirective } from "../shared/placeholder/placeholder.directive";
import { Store } from "@ngrx/store";

import * as fromApp from "../store/app.reducer"
import * as AuthActions from "./store/auth.actions"

@Component({
    selector: "app-auth",
    templateUrl: "./auth.component.html"
})
export class AuthComponent implements OnInit, OnDestroy {
    @ViewChild(PlaceholderDirective, {static: false}) alertHost: PlaceholderDirective; 

    private storeSubscription: Subscription;
    private alertSubscription: Subscription;

    isLoginMode = true;
    isLoading = false;
    error: string = null;
    infoMessage: string = null;

    constructor(private componentFactoryResolver: ComponentFactoryResolver, private store: Store<fromApp.AppState>) {}

    ngOnInit(): void {
        this.storeSubscription = this.store.select("auth").subscribe(authState => {
            this.isLoading = authState.isLoading;
            this.error = authState.authErrorMessage;
            this.infoMessage = authState.infoMessage;
            // if (this.error) {
            //     this.showErrorAlert(this.error);
            // }
        });
    }

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode
    }

    onSubmit(form: NgForm) {
        // if (form.invalid) {
        //     return;
        // }
        const email = form.value.email;
        const password = form.value.password;

        this.isLoading = true;
        if (this.isLoginMode) {
            this.store.dispatch(AuthActions.Login({email, password}));
        } else {
            this.store.dispatch(AuthActions.Signup({email, password}));
        }

        form.reset();
    }

    onHandleError() {
        // this.error = null;
        this.store.dispatch(AuthActions.ErrorHandled());
    }

    // private showErrorAlert(message: string) {
    //     // NOPE const alert = new AlertComponent();
    //     const alertComponentFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    //     const hostViewContainerRef = this.alertHost.viewContainerRef;
    //     hostViewContainerRef.clear();

    //     const componentRef = hostViewContainerRef.createComponent(alertComponentFactory);
        
    //     componentRef.instance.message = message;
    //     this.alertSubscription = componentRef.instance.close.subscribe(() => {
    //         this.alertSubscription.unsubscribe();
    //         hostViewContainerRef.clear();
    //     })
    // }

    ngOnDestroy(): void {
        if (this.alertSubscription) {
            this.alertSubscription.unsubscribe();
        }
        if (this.storeSubscription) {
            this.storeSubscription.unsubscribe();
        }
    }
}