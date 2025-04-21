import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'decimalFormat',
  standalone: true
})
export class DecimalFormatPipe implements PipeTransform {
  transform(value: number): string {
    return value.toFixed(2).replace('.', ',');
  }
}