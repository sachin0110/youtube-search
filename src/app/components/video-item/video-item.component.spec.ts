import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VideoItemComponent } from './video-item.component';
import { By } from '@angular/platform-browser';

describe('VideoItemComponent', () => {
  let component: VideoItemComponent;
  let fixture: ComponentFixture<VideoItemComponent>;

  const mockVideo = {
    id: { videoId: 'test123' },
    snippet: {
      title: 'Test Video Title',
      thumbnails: {
        medium: {
          url: 'https://example.com/thumbnail.jpg',
          width: 320,
          height: 180,
        },
      },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VideoItemComponent);
    component = fixture.componentInstance;
    component.video = mockVideo;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display video title', () => {
    const titleElement = fixture.debugElement.query(By.css('h3'));
    expect(titleElement.nativeElement.textContent).toContain(
      'Test Video Title'
    );
  });
});
