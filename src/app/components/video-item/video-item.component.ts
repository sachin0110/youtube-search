import { Component, Input } from '@angular/core';
import { YouTubePlayer } from '@angular/youtube-player';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-video-item',
  templateUrl: './video-item.component.html',
  imports: [YouTubePlayer, DatePipe],
  styleUrls: ['./video-item.component.css'],
})
export class VideoItemComponent {
  @Input() video: any;

  getChannelId(channelName: string) {
    return channelName ? channelName.replaceAll(' ', '') : '';
  }
}
