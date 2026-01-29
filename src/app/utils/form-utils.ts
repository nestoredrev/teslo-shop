import { AbstractControl, FormArray, FormGroup, ValidationErrors } from "@angular/forms";

async function sleep() {
    return new Promise( resolve => {
        setTimeout( () => {
            resolve(true);
        }, 2000 );
    });
}

export class FormUtils {

    
    static namePattern = '([a-zA-Z]+) ([a-zA-Z]+)';
    static emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
    static notOnlySpacesPattern = '^[a-zA-Z0-9]+$';
    static slugPattern = '^[a-z0-9_]+(?:-[a-z0-9_]+)*$';

    static getTextError(errors: ValidationErrors): string {
        
        let message = '';
        for (const key of Object.keys(errors)) {
            switch (key) {

                case 'required':
                    message = 'This field is required';
                break;

                case 'minlength':
                    message = `Minimum ${errors['minlength'].requiredLength} characters required`;
                break;

                case 'min':
                    message = `Minimum value is ${errors['min'].min}`;
                break;

                case 'email':
                    message = `Invalid email address format`;
                break;

                case 'emailTaken':
                    message = `Email address is already taken`;
                break;

                case 'pattern':
                    if ( errors['pattern'].requiredPattern === this.emailPattern ) {
                        message = `Invalid email address format`;
                    }
                break;

                case 'notPermitedUsername':
                    message = `This username is not allowed`;
                break;

                default:
                    message = `Error not controled by ${key}`;
                break
            }
        }
        return message;
    }

    static isValidField(form: FormGroup, field: string): boolean | null {

        return (form.controls[field].errors && form.controls[field].touched);

    }

    static getFieldError(form: FormGroup, field: string): string | null {

        if (!form.controls[field].errors) return null;

        const errors = form.controls[field].errors ?? {};

        return this.getTextError(errors);

    }

    static isValidFieldInArray(formArray: FormArray, index: number) {

        return (formArray.controls[index].errors && formArray.controls[index].touched);

    }

    static getFieldErrorInArray(formArray: FormArray, index: number): string | null {

        if( formArray.controls.length === 0 ) return null;
        
        const errors = formArray.controls[index].errors ?? {};   
        return this.getTextError(errors);
    }

    static sameFields(field1: string, field2: string) {
        return (formGroup: FormGroup) => {
            const pass1 = formGroup.controls[field1].value;
            const pass2 = formGroup.controls[field2].value;  
            return pass1 === pass2 ? null : { passwordsNotEqual: true };
        }     
    }

    static async checkingServerResponse(control: AbstractControl): Promise<ValidationErrors | null> {

        // Simulate server response delay
        await sleep();

        // Simulate email check
        const formValue = control.value;

        if ( formValue === 'nestor.edrev@gmail.com' ) {
            return { emailTaken: true };
        }

        return null;
    }

    static notPermiteUsername(control: AbstractControl): ValidationErrors | null {

        const userName: string = control.value?.trim().toLowerCase();  
         if ( userName === 'admin' || userName  === 'user' ) {
            return { notPermitedUsername: true };
        }     
        return null;
    }     
}