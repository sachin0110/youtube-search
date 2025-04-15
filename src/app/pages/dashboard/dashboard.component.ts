import { Component, inject } from '@angular/core';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { VideoListComponent } from '../../components/video-list/video-list.component';
import { YoutubeApiService } from '../../services/youtube-api.service'; // Import service
import { HeaderComponent } from '../../components/shared/header/header.component';
import { FooterComponent } from '../../components/shared/footer/footer.component';
// import { NavbarComponent } from '../../components/shared/navbar/navbar.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    SearchBarComponent,
    VideoListComponent,
    HeaderComponent,
    FooterComponent,
    // NavbarComponent,
  ], // Import child components
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  searchTerm: string = '';
  videos: any[] = [];

  constructor(private youtubeService: YoutubeApiService) {} //  Inject service

  searchVideos(term: string) {
    this.searchTerm = term;
    this.youtubeService.searchVideos(term, '');
  }
}
