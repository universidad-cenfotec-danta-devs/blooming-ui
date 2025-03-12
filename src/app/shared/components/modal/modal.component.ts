import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-modal',
  standalone:true,
  imports: [TranslateModule,CommonModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  /**
   * i18n key for the main message inside the modal.
   * For example, "AUTH.MODAL.MESSAGE_SUCCESS".
   */
  @Input() messageKey: string = 'AUTH.MODAL.DEFAULT_MESSAGE';

  /**
   * Whether the modal is currently open.
   */
  isOpen = false;

  /**
   * Opens the modal.
   */
  openModal(): void {
    this.isOpen = true;
  }

  /**
   * Closes the modal.
   */
  closeModal(): void {
    this.isOpen = false;
  }
}
