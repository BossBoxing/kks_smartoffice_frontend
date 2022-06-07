import { ApplicationRef, Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { interval, concat } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UpdateService {
    constructor(
        private appRef: ApplicationRef,
        private swUpdate: SwUpdate,
        private toast: ToastrService) {

    }
    public init() {
        if (this.swUpdate.isEnabled) {
            this.swUpdate.available.subscribe(event => {
                console.log('current version is', event.current);
                console.log('available version is', event.available);
                this.toast.info("Update Available", "Reload", {
                    disableTimeOut: true,
                    positionClass: 'toast-bottom-right'
                }).onTap.subscribe(() => {
                    this.swUpdate.activateUpdate().then(() => document.location.reload());
                })
            });
            this.swUpdate.activated.subscribe(event => {
                console.log('old version was', event.previous);
                console.log('new version is', event.current);
            });

            const appIsStable = this.appRef.isStable.pipe(first(isStable => isStable === true));
            const everyDelay = interval(6 * 60 * 60);
            const everyDelayOnceAppIsStable = concat(appIsStable, everyDelay);
            console.log("begin Check..");
            everyDelayOnceAppIsStable.subscribe(() => this.swUpdate.checkForUpdate().then(() => console.log("checking for new version..")));
        }
    }

}