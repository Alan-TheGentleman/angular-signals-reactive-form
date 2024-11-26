import { Component, computed, inject } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormChildComponent } from './form-child/form-child.component';

export interface ItemForm {
  id: FormControl<number>;
  name: FormControl<string>;
  value: FormControl<number>;
}

export type CustomFormGroup = FormGroup<ItemForm>;

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule, FormChildComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  // Injecting NonNullableFormBuilder service
  fb = inject(NonNullableFormBuilder);

  // Initializing the form with an array of custom form groups
  form: FormGroup<{ items: FormArray<CustomFormGroup> }> = this.fb.group({
    items: this.fb.array<CustomFormGroup>([]),
  });

  // Getter for the items form array
  get items() {
    return this.form.controls.items;
  }

  // Converting form value changes to a signal
  itemChanges = toSignal(this.form.valueChanges);

  // Computed property to calculate the total value of all items
  totalValue = computed(() => {
    const value = this.itemChanges()?.items?.reduce(
      (total, item) => total + (Number(item?.value) || 0),
      0,
    );
    console.log('computing total value: ', value);
    return value;
  });

  // Method to add a new item to the form array
  addItem() {
    const id = this.items.length + 1;
    const itemForm = this.fb.group<ItemForm>({
      id: this.fb.control(id),
      name: this.fb.control('', { validators: [Validators.required] }),
      value: this.fb.control(0, { validators: [Validators.required] }),
    });

    this.form.controls.items.push(itemForm);
  }
}
