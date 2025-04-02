import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class YoutubeApiService {
  private API_KEY = 'AIzaSyClHD1LH1sz-JXhF1lgkry7DfqB-jlcn9E';
  private BASE_URL = 'https://www.googleapis.com/youtube/v3/search';
  constructor(private httpClient: HttpClient) {}

  searchVideos(query: string, nextPageToken: string = ''): Observable<any> {
    const params = {
      part: 'snippet',
      maxResults: 10,
      q: query,
      type: 'video',
      key: this.API_KEY,
      pageToken: nextPageToken,
    };
    console.log("in service");
    
    return this.httpClient.get(this.BASE_URL, { params });
  }
}
