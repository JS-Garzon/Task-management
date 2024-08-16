import { NgIf } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { createPopper } from '@popperjs/core';

@Component({
  selector: 'app-delete-button',
  standalone: true,
  imports: [NgIf],
  templateUrl: './delete-button.component.html',
  styleUrl: './delete-button.component.css'
})
export class DeleteButtonComponent {
  showPopover: boolean = false;
  @ViewChild('popover', { static: false }) popover!: ElementRef;
  private popperInstance: any;
  private deleteButton: HTMLElement | null = null;


  togglePopover(event: MouseEvent) {
    debugger
    this.deleteButton = event.currentTarget as HTMLElement;
    this.showPopover = !this.showPopover;
    if (this.showPopover) {
      this.createPopperInstance();
    } else {
      this.destroyPopperInstance();
    }
  }

  createPopperInstance() {
    if (this.deleteButton && this.popover) {
      const arrow = document.querySelector('#arrow');
      this.popperInstance = createPopper(this.deleteButton, this.popover.nativeElement, {
        placement: 'bottom', // Cambia a 'left', 'right', o 'bottom' según sea necesario
        modifiers: [
          {
            name: 'arrow',
            options: {
              element: arrow,
            },
          },
          {
            name: 'offset',
            options: {
              offset: [0, 8], // Adjust this value to control the distance between the button and the popover
            },
          },
          {
            name: 'preventOverflow',
            options: {
              boundary: 'viewport',
            },
          },
          {
            name: 'flip',
            options: {
              fallbackPlacements: ['bottom', 'right', 'left'],
            },
          },
        ],
      });
    }
  }

  destroyPopperInstance() {
    if (this.popperInstance) {
      this.popperInstance.destroy();
      this.popperInstance = null;
    }
  }

  confirmDelete() {
    // Lógica para eliminar el elemento
    console.log("Elemento eliminado");
    this.showPopover = false;
    this.destroyPopperInstance();
  }

  cancelDelete() {
    this.showPopover = false;
    this.destroyPopperInstance();
  }
}
