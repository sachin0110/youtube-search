import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';
import { SearchEntry } from '../interfaces/search-entry';

@Injectable({ providedIn: 'root' })
export class SearchHistoryDB extends Dexie {
  searchTerms!: Table<SearchEntry, number>;

  constructor() {
    super('SearchHistoryDB');

    this.version(1).stores({
      searchTerms: '++id, term, createdAt',
    });
  }

  async addSearchTerm(term: string): Promise<void> {
    const trimmed = term.trim();
    if (!trimmed) return;

    // Optional: Check if already exists to avoid duplicates
    const exists = await this.searchTerms
      .where('term')
      .equalsIgnoreCase(trimmed)
      .count();

    if (!exists) {
      await this.searchTerms.add({
        term: trimmed,
        createdAt: new Date(),
      });
    }
  }

  async searchSuggestions(query: string, limit = 5): Promise<SearchEntry[]> {
    return this.searchTerms
      .where('term')
      .startsWithIgnoreCase(query)
      .reverse()
      .limit(limit)
      .toArray();
  }
}
