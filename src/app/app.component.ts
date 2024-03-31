import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule ,FormBuilder , Validators, AbstractControl , FormArray} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { forbiddenNameValidator } from './common/user-name.validator';
import { PasswordValidator } from './common/password.validator';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,RouterOutlet,ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  // Declaration of registrationForm as a FormGroup
  registrationForm!: FormGroup;

  // Getter for userName form control
  get userName() {
    return this.registrationForm.get('userName');
  }

  // Getter for email form control
  get email() {
    return this.registrationForm.get('email');
  }

  // Getter for additionalEmails form array
  get additionalEmails() {
    return this.registrationForm.get('additionalEmails') as FormArray;
  }

  // Method to add additional email form control
  addAdditionalEmail() {
    this.additionalEmails.push(this.fb.control(''));
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    // Initialization of registrationForm using FormBuilder
    this.registrationForm = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(3), forbiddenNameValidator(/angular/)]],
      password: [''],
      confirmPassword: [''],
      email: [''],
      notify: [false],
      skill: this.fb.group({
        angularLevel: [''],
        githubLink: [''],
        portfolioLink: ['']
      }),
      additionalEmails: this.fb.array([])
    }, { validator: PasswordValidator }); // Applying custom validator for password confirmation

    // Subscribe to changes in the 'notify' checkbox value
    this.registrationForm.get('notify')?.valueChanges.subscribe(checkedValue => {
      const email = this.registrationForm.get('email');
      if (checkedValue) {
        email?.setValidators(Validators.required); // If checked, require email input
      } else {
        email?.clearValidators(); // If unchecked, clear validators for email input
      }
      email?.updateValueAndValidity(); // Update validity status of email input
    });
  }

  // Method to load sample data into the form
  loadSampleData() {
    console.log("Hello");
    // Patch sample data into the form
    this.registrationForm.patchValue({
      userName: 'John',
      password: 'john123',
      confirmPassword: 'john123'
    });
  }

  // Method to handle form submission
  onSubmit() {
    console.log(this.registrationForm.value); // Log form values on submission
  }
}