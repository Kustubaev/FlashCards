/**
 * FlashCards Pro - Angular 19 Application
 * Module: core/services/auto-save
 * Description: Debounced save service using RxJS
 */

import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import type { FlashCard } from '../models/card.model';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class AutoSaveService {
  #storage = inject(StorageService);

  /**
   * Create a debounced auto-save observable for cards
   */
  createAutoSave(cards$: Observable<readonly FlashCard[]>): void {
    cards$
      .pipe(
        debounceTime(300),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
      )
      .subscribe((cards) => {
        this.#storage.saveCards(cards);
      });
  }
}
