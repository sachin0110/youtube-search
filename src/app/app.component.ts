import { Component } from '@angular/core';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { VideoListComponent } from './components/video-list/video-list.component';
import { YoutubeApiService } from './services/youtube-api.service'; // Import service

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SearchBarComponent, VideoListComponent], // Import child components
  template: `
    <div class="container">
      <app-search-bar (search)="searchVideos($event)"></app-search-bar>
      <app-video-list [searchTerm]="searchTerm"></app-video-list>
    </div>
  `,
  styles: [`
    .container {
      margin: 0 auto;
      padding: 5px;
    }
  `]
})
export class AppComponent {
  searchTerm: string = '';
  videos: any[] = [];

  constructor(private youtubeService: YoutubeApiService) {} //  Inject service

  searchVideos(term: string) {
    this.searchTerm = term;
    this.youtubeService.searchVideos(term, '');
  }
}
