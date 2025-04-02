import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { AppComponent } from './app.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { VideoListComponent } from './components/video-list/video-list.component';
import { YoutubeApiService } from './services/youtube-api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let youtubeServiceSpy: jasmine.SpyObj<YoutubeApiService>;

  beforeEach(async () => {
    youtubeServiceSpy = jasmine.createSpyObj('YoutubeApiService', [
      'searchVideos',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        SearchBarComponent,
        VideoListComponent,
      ],
      providers: [{ provide: YoutubeApiService, useValue: youtubeServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update searchTerm when searchVideos is called', () => {
    const searchTerm = 'Angular';
    youtubeServiceSpy.searchVideos.and.returnValue(
      of({ items: [], nextPageToken: '' })
    );

    component.searchVideos(searchTerm);

    expect(component.searchTerm).toBe(searchTerm);
  });

  it('should call YoutubeApiService when searching for videos', () => {
    const searchTerm = 'Angular';
    youtubeServiceSpy.searchVideos.and.returnValue(
      of({ items: [], nextPageToken: '' })
    );

    component.searchVideos(searchTerm);

    expect(youtubeServiceSpy.searchVideos).toHaveBeenCalledWith(searchTerm, '');
  });

  it('should handle empty search term', () => {
    const searchTerm = '';
    youtubeServiceSpy.searchVideos.and.returnValue(
      of({ items: [], nextPageToken: '' })
    );

    component.searchVideos(searchTerm);

    expect(component.searchTerm).toBe('');
    expect(youtubeServiceSpy.searchVideos).toHaveBeenCalledWith('', '');
  });

  it('should handle search term with special characters', () => {
    const searchTerm = 'Angular & TypeScript';
    youtubeServiceSpy.searchVideos.and.returnValue(
      of({ items: [], nextPageToken: '' })
    );

    component.searchVideos(searchTerm);

    expect(component.searchTerm).toBe(searchTerm);
    expect(youtubeServiceSpy.searchVideos).toHaveBeenCalledWith(searchTerm, '');
  });

  it('should handle service errors', fakeAsync(() => {
    const searchTerm = 'Angular';
    const error = new Error('API Error');
    youtubeServiceSpy.searchVideos.and.returnValue(throwError(() => error));

    component.searchVideos(searchTerm);
    tick();

    expect(component.searchTerm).toBe(searchTerm);
  }));

  it('should render search bar component', () => {
    const searchBar = fixture.debugElement.query(
      By.directive(SearchBarComponent)
    );
    expect(searchBar).toBeTruthy();
  });

  it('should render video list component', () => {
    const videoList = fixture.debugElement.query(
      By.directive(VideoListComponent)
    );
    expect(videoList).toBeTruthy();
  });
});
