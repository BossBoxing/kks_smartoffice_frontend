import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Shell } from '@app/shell/shell.service';
import { EmptyComponent } from './feature/empty/empty.component';

const routes: Routes = [
  { path: 'account', loadChildren: () => import('./feature/account/account.module').then(m => m.AccountModule) },
  Shell.childRoutes([
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'empty/lang/:code', component: EmptyComponent },
    { path: 'empty/comp/:code', component: EmptyComponent },
    { path: 'empty/division/:code', component: EmptyComponent },
    { path: 'manual', loadChildren: () => import('./feature/manual/manual.module').then(m => m.ManualModule) },
    { path: 'demo', loadChildren: () => import('./feature/demo/demo.module').then(m => m.DemoModule) },
    { path: 'dashboard', loadChildren: () => import('./feature/dashboard/dashboard.module').then(m => m.DashboardModule) },
    { path: 'db', loadChildren: () => import('./feature/db/db.module').then(m => m.DbModule) },
    { path: 'su', loadChildren: () => import('./feature/su/su.module').then(m => m.SuModule) },
    { path: 'tn/db', loadChildren: () => import('./feature/tn/db/db.module').then(m => m.DbModule) },
    { path: 'tn/pl', loadChildren: () => import('./feature/tn/pl/pl.module').then(m => m.PlModule) },
    { path: 'dp', loadChildren: () => import('./feature/dp/dp.module').then(m => m.DpModule) },
    { path: 'pl', loadChildren: () => import('./feature/pl/pl.module').then(m => m.PlModule) },
    { path: 'tn/2022', loadChildren: () => import('./feature/tn/2022/tn.module').then(m => m.TnModule) }
  ]),
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
