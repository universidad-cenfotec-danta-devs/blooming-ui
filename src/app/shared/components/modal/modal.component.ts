import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  /**
   * Title to display in the modal header.
   */
  @Input() title: string = 'Default Title';

  /**
   * Main message or body text of the modal.
   */
  @Input() message: string = 'Default message';

  /**
   * Text for the confirm button.
   */
  @Input() confirmText: string = 'Confirm';

  /**
   * Text for the cancel button.
   */
  @Input() cancelText: string = 'Cancel';

  /**
   * Optional output event that emits when the confirm button is clicked.
   */
  @Output() confirm: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Optional output event that emits when the cancel button is clicked (or modal is closed).
   */
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Controls the visibility of the modal.
   */
  isOpen: boolean = false;

  /**
   * Opens the modal.
   */
  openModal(): void {
    this.isOpen = true;
  }

  /**
   * Closes the modal and emits the cancel event.
   */
  closeModal(): void {
    this.isOpen = false;
    this.cancel.emit();
  }

  /**
   * Emits the confirm event and then closes the modal.
   */
  onConfirm(): void {
    this.confirm.emit();
    this.closeModal();
  }
}
