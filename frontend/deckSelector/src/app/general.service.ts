import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class GeneralService {
  selectedDeck: string = '';

  constructor(private http: HttpClient) {
    this.refreshDecks();
  }
  private deckSelectedSource = new Subject<string>();
  deckSelected$ = this.deckSelectedSource.asObservable();

  private decksSource = new Subject<any[]>();
  decks$ = this.decksSource.asObservable();

  private cardsSource = new Subject<any[]>();
  cards$ = this.cardsSource.asObservable();
  
  selectDeck(deckName: string) {
    console.log("Deck selected: " + deckName);
    this.deckSelectedSource.next(deckName);
  }

  setDecks(decks: any[]) {
    console.log("Decks updated:", decks);
    this.decksSource.next(decks);
  }

  setCards(cards: any[]) {
    console.log("Cards updated:", cards);
    this.cardsSource.next(cards);
  }

  refreshDecks(selectedDeck?: string) {
    this.http.get<any[]>(`http://127.0.0.1:5001/decks`).subscribe({
      next: (data) => this.setDecks(data),
      error: (err) => console.error('Error fetching decks:', err)
    });
    if (!selectedDeck) return;
    this.http.get<any[]>(`http://127.0.0.1:5001/deck/${selectedDeck}`).subscribe({
      next: (data) => this.setCards(data),
      error: (err) => console.error('Error fetching cards:', err)
    });
  }

}
