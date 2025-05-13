import { Routes } from '@angular/router';
import { ProductosComponent } from './pages/productos/productos.component';
import { HomeComponent } from './pages/home/home.component';
import { NosotrosComponent } from './pages/nosotros/nosotros.component';
import { ContactoComponent } from './pages/contacto/contacto.component';
import { Error404Component } from './pages/error404/error404.component';
import { AdminComponent } from './pages/admin/admin.component';
import { RegistroComponent } from './pages/auth/registro/registro.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { HistorialdecomprasComponent } from './pages/historialdecompras/historialdecompras.component';
import { CartComponent } from './pages/cart/cart.component';
import { isLoggedInGuard } from './core/guards/is-logged-in.guard';
import { PerfilUsuarioComponent } from './pages/perfil-usuario/perfil-usuario.component';
import { IsAdminGuard } from './core/guards/isAdmin.guard';
import { IsUserGuard } from './core/guards/isUser.guard';

export const routes: Routes = [
    { path: "", redirectTo: "/home", pathMatch: "full" },
    { path: "login", component: LoginComponent },
    { path: 'productos', component: ProductosComponent, canActivate:[isLoggedInGuard] },
    { path: 'home', component: HomeComponent },
    { path: 'nosotros', component: NosotrosComponent },
    { path: 'contacto', component: ContactoComponent },
    { path: 'admin', component: AdminComponent, canActivate: [isLoggedInGuard, IsAdminGuard] },
    { path: 'registro', component: RegistroComponent },
    { path: 'perfil-usuario', component: PerfilUsuarioComponent, canActivate: [isLoggedInGuard, IsUserGuard] },
    { path: 'historialdecompras', component: HistorialdecomprasComponent, canActivate: [isLoggedInGuard, IsUserGuard] },
    { path: 'cart', component: CartComponent, canActivate: [isLoggedInGuard, IsUserGuard] },   
    { path: '**', component: Error404Component },
    
];