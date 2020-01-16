import {Pipe, PipeTransform} from '@angular/core';
import {parsePhoneNumber} from 'libphonenumber-js';

@Pipe({
  name: 'phoneFormatter'
})
export class PhonePipe implements PipeTransform {

  transform(phoneValue: number | string): string {
    const stringPhone = phoneValue + '';
    const phoneNumber = parsePhoneNumber(stringPhone, 'US');
    return phoneNumber.formatNational();
  }
}
