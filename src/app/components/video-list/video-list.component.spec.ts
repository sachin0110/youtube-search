import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { VideoListComponent } from './video-list.component';
import { By } from '@angular/platform-browser';
import { YoutubeApiService } from '../../services/youtube-api.service';
import { of, throwError } from 'rxjs';
import { Component, Input } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { YouTubePlayer } from '@angular/youtube-player';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-video-item',
  template: `
    <div class="video">
      <youtube-player
        [videoId]="video.id.videoId"
        suggestedQuality="small"
      ></youtube-player>
      <h3>{{ video.snippet.title }}</h3>
      <div class="video-info">
        <span class="channel-title">
          <a
            [href]="
              'https://www.youtube.com/@' +
              getChannelId(video.snippet.channelTitle)
            "
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ video.snippet.channelTitle }}
          </a>
        </span>
        <span>|</span>
        <span class="publish-date">{{
          video.snippet.publishedAt | date : 'mediumDate'
        }}</span>
      </div>
    </div>
  `,
  standalone: true,
  imports: [YouTubePlayer, DatePipe],
})
class MockVideoItemComponent {
  @Input() video: any;

  getChannelId(channelId: string) {
    return channelId.replaceAll('', '');
  }
}

describe('VideoListComponent', () => {
  let component: VideoListComponent;
  let fixture: ComponentFixture<VideoListComponent>;
  let youtubeServiceSpy: jasmine.SpyObj<YoutubeApiService>;

  const mockVideos = [
    {
      id: { videoId: '1' },
      snippet: {
        title: 'Test Video 1',
        description: 'Description 1',
        channelTitle: 'Test Channel 1',
        publishedAt: '2024-03-20T10:00:00Z',
        thumbnails: {
          medium: {
            url: 'https://example.com/thumb1.jpg',
            width: 320,
            height: 180,
          },
        },
      },
    },
    {
      id: { videoId: '2' },
      snippet: {
        title: 'Test Video 2',
        description: 'Description 2',
        channelTitle: 'Test Channel 2',
        publishedAt: '2024-03-19T15:30:00Z',
        thumbnails: {
          medium: {
            url: 'https://example.com/thumb2.jpg',
            width: 320,
            height: 180,
          },
        },
      },
    },
  ];

  beforeEach(async () => {
    youtubeServiceSpy = jasmine.createSpyObj('YoutubeApiService', [
      'searchVideos',
    ]);

    await TestBed.configureTestingModule({
      imports: [VideoListComponent, MockVideoItemComponent],
      providers: [{ provide: YoutubeApiService, useValue: youtubeServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(VideoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    youtubeServiceSpy.searchVideos.calls.reset();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.videos).toEqual([]);
      expect(component.loading).toBeFalse();
      expect(component.nextPageToken).toBe('');
      expect(component.hasMoreVideos).toBeTrue();
      expect(component.error).toBeNull();
      expect(component.searchTerm).toBeFalsy();
    });

    it('should not show no-results message on initial load', () => {
      const noResultsElement = fixture.debugElement.query(
        By.css('.no-results')
      );
      expect(noResultsElement).toBeNull();
    });
  });

  describe('Search Term Changes', () => {
    it('should reset state and load videos when search term changes', fakeAsync(() => {
      const mockResponse = { items: mockVideos, nextPageToken: 'token123' };
      youtubeServiceSpy.searchVideos.and.returnValue(of(mockResponse));

      component.searchTerm = 'new search';
      component.ngOnChanges();
      tick();
      fixture.detectChanges();

      expect(youtubeServiceSpy.searchVideos).toHaveBeenCalledWith(
        'new search',
        ''
      );
      expect(component.videos).toEqual(mockVideos);
      expect(component.nextPageToken).toBe('token123');
      expect(component.error).toBeNull();
    }));

    it('should not load videos if search term is empty', fakeAsync(() => {
      component.searchTerm = '';
      component.ngOnInit();
      tick();

      expect(youtubeServiceSpy.searchVideos).not.toHaveBeenCalled();
      const noResultsElement = fixture.debugElement.query(
        By.css('.no-results')
      );
      expect(noResultsElement).toBeNull();
    }));
  });

  describe('Video Loading', () => {
    beforeEach(() => {
      component.searchTerm = 'test';
    });

    it('should load videos successfully', fakeAsync(() => {
      const mockResponse = { items: mockVideos, nextPageToken: 'token123' };
      youtubeServiceSpy.searchVideos.and.returnValue(of(mockResponse));

      component.loadVideos();
      tick();
      fixture.detectChanges();

      expect(component.loading).toBeFalse();
      expect(component.videos).toEqual(mockVideos);
      expect(component.nextPageToken).toBe('token123');
      expect(component.hasMoreVideos).toBeTrue();
      expect(component.error).toBeNull();

      const noResultsElement = fixture.debugElement.query(
        By.css('.no-results')
      );
      expect(noResultsElement).toBeNull();
    }));

    it('should show no results message when search returns empty with search term', fakeAsync(() => {
      const mockResponse = { items: [], nextPageToken: undefined };
      youtubeServiceSpy.searchVideos.and.returnValue(of(mockResponse));

      component.loadVideos();
      tick();
      fixture.detectChanges();

      const noResultsElement = fixture.debugElement.query(
        By.css('.no-results')
      );
      expect(noResultsElement).toBeTruthy();
      expect(noResultsElement.nativeElement.textContent).toContain(
        'No videos found for "test"'
      );
    }));

    it('should handle network errors correctly', fakeAsync(() => {
      const networkError = new ErrorEvent('Network Error');
      youtubeServiceSpy.searchVideos.and.returnValue(
        throwError(() => networkError)
      );

      component.loadVideos();
      tick();
      fixture.detectChanges();

      expect(component.error?.type).toBe('network');
      expect(component.error?.message).toContain(
        'Unable to connect to the server'
      );
      expect(component.error?.retryable).toBeTrue();

      const errorElement = fixture.debugElement.query(By.css('.error-message'));
      expect(errorElement).toBeTruthy();
      expect(errorElement.nativeElement.textContent).toContain(
        'Unable to connect to the server'
      );
    }));

    it('should handle quota exceeded errors correctly', fakeAsync(() => {
      const quotaError = { error: { error: { message: 'quotaExceeded' } } };
      youtubeServiceSpy.searchVideos.and.returnValue(
        throwError(() => quotaError)
      );

      component.loadVideos();
      tick();
      fixture.detectChanges();

      expect(component.error?.type).toBe('quota');
      expect(component.error?.message).toContain('Daily API quota exceeded');
      expect(component.error?.retryable).toBeFalse();

      const errorElement = fixture.debugElement.query(By.css('.error-message'));
      expect(errorElement).toBeTruthy();
      expect(errorElement.nativeElement.textContent).toContain(
        'Daily API quota exceeded'
      );
    }));

    it('should append new videos to existing list', fakeAsync(() => {
      const initialResponse = { items: mockVideos, nextPageToken: 'token1' };
      youtubeServiceSpy.searchVideos.and.returnValue(of(initialResponse));
      component.loadVideos();
      tick();
      fixture.detectChanges();

      const newVideos = [
        {
          id: { videoId: '3' },
          snippet: {
            title: 'Test Video 3',
            channelTitle: 'Test Channel 3',
            publishedAt: '2024-03-18T20:00:00Z',
            thumbnails: {
              medium: {
                url: 'https://example.com/thumb3.jpg',
                width: 320,
                height: 180,
              },
            },
          },
        },
      ];
      const nextResponse = { items: newVideos, nextPageToken: 'token2' };
      youtubeServiceSpy.searchVideos.and.returnValue(of(nextResponse));
      component.loadVideos();
      tick();
      fixture.detectChanges();

      expect(component.videos.length).toBe(3);
      expect(component.videos).toEqual([...mockVideos, ...newVideos]);
      expect(component.nextPageToken).toBe('token2');
    }));
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      component.searchTerm = 'test';
    });

    it('should handle rate limit errors', fakeAsync(() => {
      const rateLimitError = new HttpErrorResponse({
        error: { error: { message: 'Rate limit exceeded' } },
        status: 429,
      });
      youtubeServiceSpy.searchVideos.and.returnValue(
        throwError(() => rateLimitError)
      );

      component.loadVideos();
      tick();
      fixture.detectChanges();

      expect(component.error?.type).toBe('rate-limit');
      expect(component.error?.message).toContain('Too many requests');
      expect(component.error?.retryable).toBeTrue();
    }));

    it('should handle server errors', fakeAsync(() => {
      const serverError = new HttpErrorResponse({
        error: { error: { message: 'Internal Server Error' } },
        status: 500,
      });
      youtubeServiceSpy.searchVideos.and.returnValue(
        throwError(() => serverError)
      );

      component.loadVideos();
      tick();
      fixture.detectChanges();

      expect(component.error?.type).toBe('server');
      expect(component.error?.message).toContain('Server error');
      expect(component.error?.retryable).toBeTrue();
    }));

    it('should handle API errors', fakeAsync(() => {
      const apiError = new HttpErrorResponse({
        error: { error: { message: 'Bad Request' } },
        status: 400,
      });
      youtubeServiceSpy.searchVideos.and.returnValue(
        throwError(() => apiError)
      );

      component.loadVideos();
      tick();
      fixture.detectChanges();

      expect(component.error?.type).toBe('api');
      expect(component.error?.message).toContain('An API error occurred');
      expect(component.error?.retryable).toBeTrue();
    }));
  });

  describe('Video Display', () => {
    beforeEach(() => {
      component.videos = mockVideos;
      fixture.detectChanges();
    });

    it('should display YouTube player for each video', () => {
      const videoItems = fixture.debugElement.queryAll(
        By.css('app-video-item')
      );
      expect(videoItems.length).toBe(2);

      videoItems.forEach((item, index) => {
        const player = item.query(By.css('youtube-player'));
        expect(player).toBeTruthy();
        expect(player.componentInstance.videoId).toBe(
          mockVideos[index].id.videoId
        );
      });
    });

    it('should display video title for each video', () => {
      const videoItems = fixture.debugElement.queryAll(
        By.css('app-video-item')
      );
      expect(videoItems.length).toBe(2);

      videoItems.forEach((item, index) => {
        const title = item.query(By.css('h3'));
        expect(title).toBeTruthy();
        expect(title.nativeElement.textContent).toBe(
          mockVideos[index].snippet.title
        );
      });
    });

    it('should display channel title with link for each video', () => {
      const videoItems = fixture.debugElement.queryAll(
        By.css('app-video-item')
      );
      expect(videoItems.length).toBe(2);

      videoItems.forEach((item, index) => {
        const channelLink = item.query(By.css('.channel-title a'));
        expect(channelLink).toBeTruthy();
        expect(channelLink.nativeElement.textContent.trim()).toBe(
          mockVideos[index].snippet.channelTitle
        );
        expect(channelLink.nativeElement.href).toBe(
          `https://www.youtube.com/@${mockVideos[
            index
          ].snippet.channelTitle.replaceAll(' ', '')}`
        );
      });
    });

    it('should display publish date for each video', () => {
      const videoItems = fixture.debugElement.queryAll(
        By.css('app-video-item')
      );
      expect(videoItems.length).toBe(2);

      videoItems.forEach((item, index) => {
        const publishDate = item.query(By.css('.publish-date'));
        expect(publishDate).toBeTruthy();
        const expectedDate = new Date(
          mockVideos[index].snippet.publishedAt
        ).getDate();
        expect(publishDate.nativeElement.textContent.trim()).toContain(
          expectedDate
        );
      });
    });
  });
});
