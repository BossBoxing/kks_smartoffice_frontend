import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService, I18nService } from '@app/core';
import { Subscription } from 'rxjs';
import { LoadingService } from '@app/loading/loading.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-auth-callback',
  template: '',
  styles: []
})
export class AuthCallbackComponent implements OnInit {

  private completeAuthSubscription!: Subscription;
  
  constructor(
    private i18n: I18nService,
    private authService: AuthService,
    private router: Router,
    private loading:LoadingService
  ) { }

  ngOnInit() {
   this.loading.show();
   this.completeAuthSubscription = this.authService.completeAuthentication().pipe(
     finalize(()=>this.loading.hide())
   ).subscribe(()=>{
      this.router.navigate([this.authService.redirectUrl], { replaceUrl: true });
    })
  }

  ngOnDestroy(){
    if (this.completeAuthSubscription) {
      this.completeAuthSubscription.unsubscribe();
    }
  }
}