import { TestBed } from '@angular/core/testing';
import { YoutubeApiService } from './youtube-api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('YoutubeApiService', () => {
  let service: YoutubeApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [YoutubeApiService],
    });

    service = TestBed.inject(YoutubeApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call YouTube API and return search results', () => {
    const mockResponse = { items: [{ id: '1', snippet: { title: 'Test Video' } }] };
    const query = 'Angular';

    service.searchVideos(query).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne((req) => req.url.includes('https://www.googleapis.com/youtube/v3/search'));
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
