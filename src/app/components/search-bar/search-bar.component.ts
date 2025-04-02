import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true, //  Standalone component
  imports: [CommonModule, FormsModule], //  Import required modules
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {
  searchTerm = '';
  @Output() search = new EventEmitter<string>();

  onSearch() {
    if (this.searchTerm.trim()) {
      this.search.emit(this.searchTerm);
    }
  }

  clearSearch() {
    this.searchTerm = '';
    // Emit empty search to reset results
    this.search.emit('');
  }
}
