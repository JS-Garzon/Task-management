import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'emailValidator',
  standalone: true,
})
export class EmailValidatorPipe implements PipeTransform {
  transform(value: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(value);
  }
}
