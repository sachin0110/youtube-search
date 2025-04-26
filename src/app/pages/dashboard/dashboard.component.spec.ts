import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { YoutubeApiService } from '../../services/youtube-api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { VideoListComponent } from '../../components/video-list/video-list.component';
import { HeaderComponent } from '../../components/shared/header/header.component';
import { FooterComponent } from '../../components/shared/footer/footer.component';
import { TranslateModule } from '@ngx-translate/core';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let youtubeServiceMock: jasmine.SpyObj<YoutubeApiService>;

  beforeEach(async () => {
    youtubeServiceMock = jasmine.createSpyObj('YoutubeApiService', [
      'searchVideos',
    ]);
    youtubeServiceMock.searchVideos.and.returnValue(of({ items: [] }));

    await TestBed.configureTestingModule({
      imports: [
        DashboardComponent,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
      ],
      providers: [{ provide: YoutubeApiService, useValue: youtubeServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
