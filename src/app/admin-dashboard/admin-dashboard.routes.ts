import { Routes } from "@angular/router";
import { AdminDashboardLayout } from "./layouts/admin-dashboard-layout/admin-dashboard-layout";
import { ProductsAdminPage } from "./pages/products-admin-page/products-admin-page";
import { ProductAdminPage } from "./pages/product-admin-page/product-admin-page";
import { isAdminGuard } from "@/auth/guards/is-admin-guard";

export const adminDasboardRoutes:Routes = [
    {
        path: '',
        component: AdminDashboardLayout,
        canMatch: [
            // canMatch: mens match with the path for the route
            isAdminGuard,
        ],
        children: [
            {
                path: 'products',
                component: ProductsAdminPage
            },
            {
                path: 'products/:id',
                component: ProductAdminPage
            },
            {
                path: '**',
                redirectTo: 'products'
            }
        ]
    }
];

export default adminDasboardRoutes;