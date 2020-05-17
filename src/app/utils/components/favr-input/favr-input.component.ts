import {Component, forwardRef, Input, OnInit, Output} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

const CUSTOM_VALUE_ACCESSOR: any = {
  provide : NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => FavrInputComponent),
  multi : true,
};

@Component({
  selector: 'favr-input',
  templateUrl: './favr-input.component.html',
  styleUrls: ['./favr-input.component.scss'],
  providers: [CUSTOM_VALUE_ACCESSOR]
})
export class FavrInputComponent implements ControlValueAccessor {
  @Input() inputId: string;
  @Input() inputType: string;
  @Input() inputClass: string;
  @Input() inputRequired: boolean;

  @Input() labelName: string;
  @Input() labelClass: string;

  @Input() value: any;
  @Input() disabled: boolean;

  onChange: any = (obj?: any) => {};
  onTouch: any = (obj?: any) => {};

  set setValue(val) {
    // set local value programmatically
    if (val !== undefined && this.value !== val) {
      this.value = val;
      this.onChange(val);
      this.onTouch(val);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValue(obj: any): void {
    // sets value programmatically
    this.value = obj;
  }

}
