import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthorizationGuard } from '@app/core';
import { ManualResolver } from './manual-resolver.service';
import { ManualComponent } from './manual.component';

const routes: Routes = [
  {
    path: '',
    data: {
      code: 'Manual'
    },
    resolve:{
       manual:ManualResolver
    },
    component : ManualComponent,
    canActivate:[AuthorizationGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers:[ManualResolver ]
})
export class ManualRoutingModule { }
