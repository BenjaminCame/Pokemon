import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgFor,NgIf } from '@angular/common';
import { Event } from '@angular/router';

@Component({
  selector: 'app-deck-cards',
  imports: [NgFor, NgIf],
  templateUrl: './deck-cards.component.html',
  styleUrl: './deck-cards.component.css'
})
export class DeckCardsComponent {
  @Input() deckName: string = '';

  cards : any[] = [];

  constructor(private http: HttpClient) {}
  onDeckSelected(deckName: string) {
    this.deckName = deckName;
    this.http.get<any[]>(`http://127:0.0.1:5001/deck/${deckName}`).subscribe({
      next: (data) => {
        this.cards = data;
        console.log('Cards fetched successfully:', this.cards);
      }
      , error: (err) => {
        console.error('Error fetching cards:', err);
      }
    }); 
  }
}
