import { Component, forwardRef, input } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-custom-input',
  imports: [ReactiveFormsModule],
  templateUrl: './custom-input.component.html',
  styleUrl: './custom-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputComponent),
      multi: true,
    },
  ],
})
export class CustomInputComponent implements ControlValueAccessor {
  // Form control for the custom input
  control = input.required<FormControl<any>>();

  // Placeholder for the onTouched callback
  onTouched = () => {};
  // Placeholder for the onChange callback
  onChange = (_value: any) => {};

  // Writes a new value to the element
  writeValue(value: any): void {
    if (value !== this.control().value) {
      this.control().setValue(value, { emitEvent: false });
    }
  }

  // Registers a callback function that should be called when the control's value changes in the UI
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // Registers a callback function that should be called when the control is touched
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // Sets the "disabled" property on the input element
  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.control().disable() : this.control().enable();
  }
}
