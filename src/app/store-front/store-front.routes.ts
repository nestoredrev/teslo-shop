import { Routes } from "@angular/router";
import { StoreFrontLayout } from "./layouts/store-front-layout/store-front-layout";
import { HomePage } from "./pages/home-page/home-page";
import { GenderPage } from "./pages/gender-page/gender-page";
import { ProductPage } from "./pages/product-page/product-page";
import { NotFoundPage } from "./pages/not-found-page/not-found-page";

export const storeFrontRoutes:Routes = [

    {
        path: '',
        title: 'Home',
        component: StoreFrontLayout,
        children: [
            {
                path: '',
                component: HomePage,
                title: 'Home'
            },
            {
                path: 'gender/:gender',
                component: GenderPage,
                title: 'Gender'
            },
            {
                path: 'product/:id',
                component: ProductPage,
                title: 'Product Details'
            },
            {
                path: '**',
                component: NotFoundPage,
                title: 'Not Found',
            }
        ]
    },
    {
        path: '**',
        redirectTo: ''
    }
];

export default storeFrontRoutes;