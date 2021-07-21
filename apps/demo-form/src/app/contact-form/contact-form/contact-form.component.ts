import {Component, Input, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {FormContent} from './form-content.model';
import {merge, Observable} from 'rxjs';
import {debounceTime, map} from 'rxjs/operators';

@Component({
  selector: 'jdrks-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent {

  firstName = new FormControl('');
  lastName = new FormControl('');
  message = new FormControl('');

  @Input()
  get formContent(): FormContent {
    return {
      firstName: this.firstName.value,
      lastName: this.lastName.value,
      message: this.message.value,
    };
  }

  set formContent(newContent: FormContent) {
    this.firstName.patchValue(newContent.firstName);
    this.lastName.patchValue(newContent.lastName);
    this.message.patchValue(newContent.message);
  }

  @Output()
  private formContentChange: Observable<FormContent> = merge(
    this.firstName.valueChanges,
    this.lastName.valueChanges,
    this.message.valueChanges
  ).pipe(
    map(() => ({
      firstName: this.firstName.value,
      lastName: this.lastName.value,
      message: this.message.value,
    })),
    debounceTime(10)
  );
}
