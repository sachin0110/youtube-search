import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateCustom',
  standalone: true,
})
export class DateCustomPipe implements PipeTransform {
  transform(value: any, format: string = 'dd/mm/yyyy'): string {
    // Convert value to a Date object
    const date = new Date(value);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return ''; // Return empty string if invalid date
    }

    const day = date.getDate();
    const month = date.getMonth() + 1; // JavaScript months are zero-based
    const year = date.getFullYear();
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    format = format.toLowerCase();

    const formattedDate = format
      .replace(/dd/, day.toString().padStart(2, '0'))
      .replace(/d/, day.toString())
      .replace(/mmm/, monthNames[month - 1])
      .replace(/mm/, month.toString().padStart(2, '0'))
      .replace(/m/, month.toString())
      .replace(/yyyy/, year.toString())
      .replace(/yy/, year.toString().slice(-2));

    return formattedDate;
  }
}
