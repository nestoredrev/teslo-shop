import { Routes } from "@angular/router";
import { AuthLayoutComponent } from "./layout/auth-layout/auth-layout";
import { LoginPage } from "./pages/loginPage/loginPage";
import { RegisterPage } from "./pages/registerPage/registerPage";

export const authRoutes:Routes = [
    {
        path: '',
        component: AuthLayoutComponent,
        children:[
            {
                path: 'login',
                component: LoginPage
            },
            {
                path: 'register',
                component: RegisterPage
            },
            {
                path: '**',
                redirectTo: 'login'
            }
        ]
    }
];

export default authRoutes;
  