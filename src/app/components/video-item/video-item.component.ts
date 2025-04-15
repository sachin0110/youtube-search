import { Component, Input } from '@angular/core';
import { YouTubePlayer } from '@angular/youtube-player';
import { DateCustomPipe } from '../../pipes/custom-date.pipe';

@Component({
  selector: 'app-video-item',
  templateUrl: './video-item.component.html',
  imports: [YouTubePlayer, DateCustomPipe],
  styleUrls: ['./video-item.component.css'],
})
export class VideoItemComponent {
  @Input() video: any;

  getChannelId(channelName: string) {
    return channelName ? channelName.replaceAll(' ', '') : '';
  }
}
