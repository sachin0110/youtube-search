import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  EventEmitter,
  inject,
  Output,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SearchHistoryDB } from '../../services/search-history-db.service';
import { SearchEntry } from '../../interfaces/search-entry';
import { SharedService } from '../../services/shared.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule], // ✅ ReactiveFormsModule instead of FormsModule
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css'],
})
export class SearchBarComponent {
  searchControl = new FormControl('');
  searchTerm = signal<string>(''); // 🔁 reactive signal
  suggestions: SearchEntry[] = [];

  @Output() search = new EventEmitter<string>();

  db = inject(SearchHistoryDB);
  shared = inject(SharedService);

  constructor() {
    // 🔁 Update signal based on input changes
    this.searchControl.valueChanges.subscribe((value) => {
      this.searchTerm.set(value ?? '');
    });

    // 📡 Reactive effect to fetch suggestions
    effect(() => {
      const term = this.searchTerm();
      if (term && term.length > 0) {
        this.shared.updateValue(term); // optional shared logic
        this.db.searchSuggestions(term).then((matches) => {
          this.suggestions = matches;
        });
      } else {
        this.suggestions = [];
      }
    });
  }

  onSearch() {
    const term = this.searchTerm();
    if (term?.trim() && term.length > 3) {
      this.db.addSearchTerm(term); // ✅ Save to IndexedDB
      this.search.emit(term);
    }
  }

  fillFromSuggestion(term: string) {
    this.searchControl.setValue(term); // ✅ updates signal as well
    this.suggestions = []; // hide after selection
    this.search.emit(term);
  }

  clearSearch() {
    this.searchControl.setValue('');
    this.suggestions = [];
    this.search.emit('');
  }
}
