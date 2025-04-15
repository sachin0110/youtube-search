import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  private router = inject(Router);
  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }
  switchLang(lang: string) {
    this.translate.use(lang);
  }
  handleLogout() {
    sessionStorage.removeItem('access-token');
    this.router.navigate(['/login']);
  }
}
