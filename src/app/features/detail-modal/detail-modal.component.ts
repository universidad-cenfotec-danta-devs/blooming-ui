import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IUser } from '../../interfaces/user.interface';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './detail-modal.component.html',
  styleUrls: ['./detail-modal.component.scss']
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

  animationClass = '';

  /**
   * Opens the modal.
   */
  openModal() {
    this.isOpen = true;
    this.animationClass = 'showing';
  }

  /**
   * Closes the modal and emits the cancel event.
   */
  closeModal() {
    console.log('Closing modal...');
    this.animationClass = 'closing';
  
    setTimeout(() => {
      this.isOpen = false;
      console.log('Modal closed, isOpen:', this.isOpen);
      this.animationClass = '';
      this.cancel.emit();
    }, 300); // Match animation duration
  }
  

  /**
   * Emits the confirm event and then closes the modal.
   */
  onConfirm(): void {
    this.confirm.emit();
  }
}
