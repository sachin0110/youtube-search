import { Component, Input, OnInit, HostListener } from '@angular/core';
import { YoutubeApiService } from '../../services/youtube-api.service';
import { CommonModule } from '@angular/common';
import { VideoItemComponent } from '../video-item/video-item.component';
import { catchError, finalize, retry } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

interface ErrorState {
  message: string;
  type: 'network' | 'api' | 'quota' | 'generic' | 'rate-limit' | 'server';
  retryable: boolean;
}

@Component({
  selector: 'app-video-list',
  standalone: true, //  Standalone component
  imports: [CommonModule, VideoItemComponent], //  Import required modules
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.css']
})
export class VideoListComponent implements OnInit {
  @Input() searchTerm!: string;
  @Input() videos: any[] = [];
  nextPageToken: string = '';
  loading = false;
  error: ErrorState | null = null;
  hasMoreVideos = true;
  retryCount = 0;
  maxRetries = 3;

  constructor(private youtubeService: YoutubeApiService) {}

  ngOnChanges() {
    if (this.searchTerm) {
      this.resetState();
      this.loadVideos();
    }
  }

  ngOnInit() {
    if (this.searchTerm) {
      this.loadVideos();
    }

    // Use IntersectionObserver for modern browsers
    if (this.supportsIntersectionObserver()) {
      const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.loading && this.hasMoreVideos && !this.error) {
            this.loadVideos();
          }
        });
      }, options);

      // Observe the loading spinner element
      const target = document.querySelector('.loading-spinner');
      if (target) {
        observer.observe(target);
      }
    }
  }

  private resetState() {
    this.videos = [];
    this.nextPageToken = '';
    this.error = null;
    this.hasMoreVideos = true;
    this.loading = false;
    this.retryCount = 0;
  }

  private handleError(error: any): ErrorState {
    if (error instanceof ErrorEvent) {
      return {
        type: 'network',
        message: 'Unable to connect to the server. Please check your internet connection.',
        retryable: true
      };
    }

    // Handle quota exceeded error
    if (error?.error?.error?.message === 'quotaExceeded' || 
        error?.error?.message === 'quotaExceeded' ||
        error?.message === 'quotaExceeded') {
      return {
        type: 'quota',
        message: 'Daily API quota exceeded. Please try again tomorrow.',
        retryable: false
      };
    }

    // Handle rate limiting
    if (error?.status === 429) {
      return {
        type: 'rate-limit',
        message: 'Too many requests. Please wait a moment before trying again.',
        retryable: true
      };
    }

    // Handle API errors
    if (error?.status >= 400 && error?.status < 500) {
      return {
        type: 'api',
        message: error?.error?.message || 'An API error occurred. Please try again.',
        retryable: true
      };
    }

    // Handle server errors
    if (error?.status >= 500) {
      return {
        type: 'server',
        message: 'Server error. Please try again later.',
        retryable: true
      };
    }

    // Handle unexpected errors
    return {
      type: 'generic',
      message: 'An unexpected error occurred. Please try again.',
      retryable: true
    };
  }

  loadVideos() {
    if (!this.searchTerm || this.loading || !this.hasMoreVideos) return;
    
    this.loading = true;
    this.error = null;

    this.youtubeService.searchVideos(this.searchTerm, this.nextPageToken)
      .pipe(
        retry({
          count: this.maxRetries,
          delay: (error) => {
            // Only retry network errors or specific API errors
            if (error instanceof HttpErrorResponse) {
              if (error.status === 0 || error.status === 429) {
                this.retryCount++;
                return of(this.retryCount * 1000); // Exponential backoff
              }
            }
            return of(0);
          }
        }),
        catchError(error => {
          this.error = this.handleError(error);
          return of({ items: [], nextPageToken: '' });
        }),
        finalize(() => {
          this.loading = false;
          this.retryCount = 0;
        })
      )
      .subscribe(data => {
        if (data.error) {
          this.error = this.handleError(data.error);
          return;
        }
        
        this.videos = [...this.videos, ...data.items];
        this.nextPageToken = data.nextPageToken || '';
        this.hasMoreVideos = !!data.nextPageToken;
      });
  }

  @HostListener('window:scroll', [])
  onScroll() {
    // Cross-browser compatible way to detect scroll position
    const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );
    const windowBottom = windowHeight + window.pageYOffset;
    
    if ((windowBottom >= docHeight - 100) && 
        !this.loading && 
        this.hasMoreVideos && 
        !this.error) {
      this.loadVideos();
    }
  }

  onRetry() {
    this.error = null;
    this.retryCount = 0;
    this.loadVideos();
  }

  // Add a method to check if the browser supports IntersectionObserver
  private supportsIntersectionObserver(): boolean {
    return 'IntersectionObserver' in window &&
           'IntersectionObserverEntry' in window &&
           'intersectionRatio' in window.IntersectionObserverEntry.prototype;
  }
}