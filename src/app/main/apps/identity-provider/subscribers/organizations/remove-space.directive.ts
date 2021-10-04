import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: 'input[appRemoveSpace]',
})
export class AppRemoveSpace {
  constructor(private _el: ElementRef) {}

  @HostListener('input', ['$event']) onInputChange(event) {
    const initalValue = this._el.nativeElement.value;
    this._el.nativeElement.value = initalValue.replace(/ /g, '');
    if (initalValue !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
  }
}
