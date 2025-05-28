import { Component, inject, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgFor,NgIf } from '@angular/common';
import { GeneralService } from '../general.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-deck-cards',
  imports: [NgFor, NgIf],
  templateUrl: './deck-cards.component.html',
  styleUrl: './deck-cards.component.css'
})
export class DeckCardsComponent {
  @Input() deckName: string = '';
  private deckSubscription: Subscription = new Subscription();
  cards : any[] = [];

  constructor(private http: HttpClient, private generalService: GeneralService) {}
  
  ngOnInit() {
      this.deckSubscription = this.generalService.deckSelected$.subscribe(deckName => {
      this.onDeckSelected(deckName);
    });
  }

  ngOnDestroy() {
    if (this.deckSubscription) {
      this.deckSubscription.unsubscribe();
    }
  }

  onDeckSelected(deckName: string) {
    console.log("this is the deck selected it is woekinfg" + deckName);
    this.deckName = deckName;
    this.http.get<any[]>(`http://127.0.0.1:5001/deck/${deckName}`).subscribe({
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
