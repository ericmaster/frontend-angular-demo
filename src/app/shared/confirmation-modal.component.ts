import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" *ngIf="show" (click)="onCancel()">
      <div class="modal-container" (click)="$event.stopPropagation()">
        <div class="modal-content">
          <h2 class="modal-title">{{ title }}</h2>
          
          <div class="modal-actions">
            <button class="cancel-btn" (click)="onCancel()">Cancelar</button>
            <button class="confirm-btn" (click)="onConfirm()">Confirmar</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      animation: fadeIn 0.2s ease-out;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    .modal-container {
      background: white;
      border-radius: 8px;
      width: 90%;
      max-width: 500px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      overflow: hidden;
      animation: slideIn 0.3s ease-out;
    }
    
    @keyframes slideIn {
      from { transform: translateY(-20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    
    .modal-content {
      padding: 32px 40px;
    }
    
    .modal-title {
      font-size: 1.5rem;
      font-weight: 500;
      margin-bottom: 40px;
      color: #222;
    }
    
    .modal-actions {
      display: flex;
      justify-content: space-between;
      gap: 24px;
    }
    
    .cancel-btn, .confirm-btn {
      padding: 14px 32px;
      border-radius: 6px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      border: none;
      flex: 1;
      text-align: center;
      transition: background-color 0.2s, transform 0.1s;
    }
    
    .cancel-btn {
      background: #f0f0f0;
      color: #1a2340;
    }
    
    .confirm-btn {
      background: #ffe066;
      color: #1a2340;
    }
    
    .cancel-btn:hover {
      background: #e0e0e0;
    }
    
    .confirm-btn:hover {
      background: #ffe599;
    }
    
    .cancel-btn:active, .confirm-btn:active {
      transform: translateY(1px);
    }
  `]
})
export class ConfirmationModalComponent {
  @Input() show = false;
  @Input() title = '¿Estás seguro de eliminar este producto?';
  @Input() productName = '';

  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  onCancel(): void {
    this.cancel.emit();
  }

  onConfirm(): void {
    this.confirm.emit();
  }
}
