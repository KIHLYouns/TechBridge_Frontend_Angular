import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-contact-modal',
  standalone: false,
  templateUrl: './contact-modal.component.html',
  styleUrls: ['./contact-modal.component.scss']
})
export class ContactModalComponent {
  @Input() contactInfo: {
    name: string;
    email?: string;
    phone?: string;
    avatar?: string;
  } | null = null;
  
  @Output() close = new EventEmitter<void>();
  
  closeModal(): void {
    this.close.emit();
  }
}
