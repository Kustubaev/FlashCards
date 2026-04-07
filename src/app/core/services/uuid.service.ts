/**
 * FlashCards Pro - Angular 19 Application
 * Module: core/services/uuid
 * Description: UUID v4 generation service
 */

import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UuidService {
  /**
   * Generate a UUID v4
   */
  generate(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return this.fallbackUuid();
  }

  /**
   * Fallback UUID generation for environments without crypto.randomUUID
   */
  private fallbackUuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
