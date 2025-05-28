import { Component } from '@angular/core';
import { Event } from '@angular/router';
import { DeckListComponent } from './deck-list/deck-list.component';
import { DeckCardsComponent } from './deck-cards/deck-cards.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: false
})
export class AppComponent {
  title = 'deckSelector';
  selectedDeck: string = '';
}
