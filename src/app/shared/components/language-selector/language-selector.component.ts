import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../service/language.service';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule],
  template:'./langue-selector.html',
  styleUrls: ['./language-selector.component.css']
})
export class LanguageSelectorComponent {
  constructor(private languageService: LanguageService) {}

  changeLanguage(lang: string) {
    this.languageService.changeLanguage(lang);
  }
}
