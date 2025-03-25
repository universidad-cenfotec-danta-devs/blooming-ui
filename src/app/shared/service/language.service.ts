// language.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  constructor(
    private translate: TranslateService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.initLanguage();
  }

  private initLanguage() {
    let savedLanguage = 'en';
 
    if (isPlatformBrowser(this.platformId)) {
      savedLanguage = localStorage.getItem('language') || 'en';
    }
    this.translate.setDefaultLang('en');
    this.translate.use(savedLanguage);
  }

  changeLanguage(lang: string) {
    this.translate.use(lang);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('language', lang);
    }
  }

  getCurrentLanguage(): string {
    return this.translate.currentLang;
  }
}
