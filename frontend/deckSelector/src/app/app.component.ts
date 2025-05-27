import { Component } from '@angular/core';
import { Event } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: false
})
export class AppComponent {
  title = 'deckSelector';
  selectedDeck: string = '';
  onDeckSelected(deck: string) {
    this.selectedDeck = deck;
    console.log('Selected deck:', this.selectedDeck);
  }
}
