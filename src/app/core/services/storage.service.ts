/**
 * FlashCards Pro - Angular 19 Application
 * Module: core/services/storage
 * Description: Typed localStorage access for cards, tags, and settings
 */

import { Injectable, inject } from '@angular/core';
import type { FlashCard } from '../models/card.model';
import type { Tag } from '../models/tag.model';
import type { AppSettings } from '../models/settings.model';
import { STORAGE_KEYS } from '../config/constants';
import { DEFAULT_SETTINGS } from '../models/settings.model';

@Injectable({ providedIn: 'root' })
export class StorageService {
  /**
   * Get all cards from storage
   */
  getCards(): readonly FlashCard[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CARDS);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as FlashCard[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      console.error('Failed to parse cards from localStorage');
      return [];
    }
  }

  /**
   * Save all cards to storage
   */
  saveCards(cards: readonly FlashCard[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(cards));
    } catch {
      console.error('Failed to save cards to localStorage');
    }
  }

  /**
   * Atomically update cards using a mutator function
   */
  updateCards(mutator: (cards: FlashCard[]) => FlashCard[]): void {
    const cards = [...this.getCards()];
    const updated = mutator(cards);
    this.saveCards(updated);
  }

  /**
   * Get all tags from storage
   */
  getTags(): readonly Tag[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.TAGS);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as Tag[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      console.error('Failed to parse tags from localStorage');
      return [];
    }
  }

  /**
   * Save all tags to storage
   */
  saveTags(tags: readonly Tag[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(tags));
    } catch {
      console.error('Failed to save tags to localStorage');
    }
  }

  /**
   * Get application settings from storage
   */
  getSettings(): AppSettings {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!raw) return { ...DEFAULT_SETTINGS };
      const parsed = JSON.parse(raw) as Partial<AppSettings>;
      return { ...DEFAULT_SETTINGS, ...parsed };
    } catch {
      console.error('Failed to parse settings from localStorage');
      return { ...DEFAULT_SETTINGS };
    }
  }

  /**
   * Save application settings to storage
   */
  saveSettings(settings: AppSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch {
      console.error('Failed to save settings to localStorage');
    }
  }

  /**
   * Get streak data from storage
   */
  getStreak(): { current: number; lastDate: string | null } {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.STREAK);
      if (!raw) return { current: 0, lastDate: null };
      return JSON.parse(raw) as { current: number; lastDate: string | null };
    } catch {
      return { current: 0, lastDate: null };
    }
  }

  /**
   * Save streak data to storage
   */
  saveStreak(streak: { current: number; lastDate: string | null }): void {
    try {
      localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify(streak));
    } catch {
      console.error('Failed to save streak to localStorage');
    }
  }
}
