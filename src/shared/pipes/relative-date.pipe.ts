/**
 * FlashCards Pro - Angular 19 Application
 * Module: shared/pipes/relative-date
 * Description: Display relative date strings in Russian
 */

import { Pipe, PipeTransform } from '@angular/core';
import { getRelativeDateString } from '../../app/core/utils/date.helpers';
import type { ISODateString } from '../../app/core/models/card.model';

@Pipe({
  name: 'relativeDate',
  standalone: true,
})
export class RelativeDatePipe implements PipeTransform {
  transform(date: ISODateString | null | undefined): string {
    if (!date) return 'Не указано';
    return getRelativeDateString(date);
  }
}
