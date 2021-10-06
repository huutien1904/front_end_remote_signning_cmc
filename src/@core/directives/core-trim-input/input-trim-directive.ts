import { Directive, forwardRef, HostListener } from "@angular/core";
import { DefaultValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
const TRIM_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => InputTrimDirective),
  multi: true,
};
/**
 * The trim accessor for writing trimmed value and listening to changes that is
 * used by the {@link NgModel}, {@link FormControlDirective}, and
 * {@link FormControlName} directives.
 */
@Directive({
  // tslint:disable-next-line:directive-selector
  selector: `
 input:not([type=checkbox]):not([[matDatepicker]]):not([type=radio]):not([type=password]):not([readonly]):not(.ng-trim-ignore)[formControlName],
 input:not([type=checkbox]):not([type=radio]):not([type=password]):not([readonly]):not(.ng-trim-ignore)[formControl],
 input:not([type=checkbox]):not([type=radio]):not([type=password]):not([readonly]):not(.ng-trim-ignore)[ngModel],
 textarea:not([readonly]):not(.ng-trim-ignore)[formControlName],
 textarea:not([readonly]):not(.ng-trim-ignore)[formControl],
 textarea:not([readonly]):not(.ng-trim-ignore)[ngModel],
 :not([readonly]):not(.ng-trim-ignore)[ngDefaultControl]’
 `,
  providers: [TRIM_VALUE_ACCESSOR],
})
export class InputTrimDirective extends DefaultValueAccessor {
  @HostListener("input", ["$event.target.value"])
  ngOnChange = (val: string) => {
    this.onChange(val.trim());
  };
  @HostListener("blur", ["$event.target.value"])
  applyTrim(val: string) {
    this.writeValue(val.trim());
  }
  writeValue(value: any): void {
    if (typeof value === "string") {

      value = value.replace(/ {2,}/g, " ").trim();
    }
    super.writeValue(value);
  }
  @HostListener("mouseenter") mouseover(eventData: Event) {
    //this.renderer.setStyle(this.elementRef.nativeElement,'background-color','pink');
  }
}
