import { Directive, ElementRef, HostListener } from '@angular/core';
import { IonInput } from '@ionic/angular';

@Directive({ selector: '[select]' })
export class SelectDirective {
    constructor(
        private elementRef: ElementRef<IonInput>
    ) {
        
    }    

    @HostListener('ionFocus') async focus() {
        (await this.elementRef.nativeElement.getInputElement()).select();
    }
}