import { Routes } from '@angular/router';
import { ProductosComponent } from './pages/productos/productos.component';
import { HomeComponent } from './pages/home/home.component';
import { NosotrosComponent } from './pages/nosotros/nosotros.component';
import { ContactoComponent } from './pages/contacto/contacto.component';
import { Error404Component } from './pages/error404/error404.component';
import { AdminComponent } from './pages/admin/admin.component';
import { RegistroComponent } from './auth/registro/registro.component';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HistorialdecomprasComponent } from './pages/dashboard/historialdecompras/historialdecompras.component';
import { CartComponent } from './pages/cart/cart.component';
import { isLoggedInGuard } from './core/guards/is-logged-in.guard';
import { PagoSimComponent } from './pages/pago.sim/pago.sim.component';



export const routes: Routes = [
    { path: "", redirectTo: "/home", pathMatch: "full" },
    { path: "login", component: LoginComponent },
    { path: 'productos', component: ProductosComponent, canActivate:[isLoggedInGuard] },
    { path: 'home', component: HomeComponent },
    { path: 'nosotros', component: NosotrosComponent },
    { path: 'contacto', component: ContactoComponent },
    { path: 'admin', component: AdminComponent, canActivate:[isLoggedInGuard]  },
    { path: 'registro', component: RegistroComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate:[isLoggedInGuard]  },
    { path: 'historialdecompras', component: HistorialdecomprasComponent },
    { path: 'cart', component: CartComponent },
    { path: 'pago.sim', component: PagoSimComponent  },
    { path: '**', component: Error404Component },
    
];