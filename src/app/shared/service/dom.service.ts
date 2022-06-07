import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DomService {
    constructor(
    ) { }

    private resize() {
        window.dispatchEvent(new Event('resize'));
    }

    triggerResize(delay=1){
        setTimeout(this.resize.bind(this),delay);
    }
}