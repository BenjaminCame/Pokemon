import { Component, Input, Output, EventEmitter, inject} from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { GeneralService } from '../general.service';


@Component({
  selector: 'app-deck-list',
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './deck-list.component.html',
  styleUrl: './deck-list.component.css'
})
export class DeckListComponent {
  @Input() title: string = '';
  decks: any[] = [];
  selectedDeck: string = '';
  cards: any[] = [];
  generalService = inject(GeneralService);

  constructor(private http:HttpClient) {}

  ngOnInit() {
    this.generalService.decks$.subscribe(decks => this.decks = decks)
    this.generalService.cards$.subscribe(cards => this.cards = cards)

    this.http.get<any[]>(`http://127.0.1:5001/decks`).subscribe({
      next: (data) => {
        this.decks = data;
        console.log('Decks fetched successfully:', this.decks);
      }
      , error: (err) => {
        console.error('Error fetching decks:', err);
      }
    });
  }

  onDeckSelected(deckName: string) {
    this.selectedDeck = deckName;
    this.generalService.selectDeck(deckName);
    console.log("Deck selected: " + deckName);
    this.http.get<any[]>(`http://127.0.0.1:5001/deck/${this.selectedDeck}`)
      .subscribe({
        next: (data) => {
          this.cards = data;
          console.log('Items fetched successfully:', this.cards);
        },
        error: (err) => {
          console.error('Error fetching items:', err);
        }
      }
    );
  }

  addDeck() {
    if (!this.isDeckNameValid(this.title)) {
      alert('Deck name contains invalid characters. Only letters, numbers, spaces, underscores, and hyphens are allowed.');
      return;
    }
    this.http.post("http://127.0.0.1:5001/newdeck", { name: this.title })
      .subscribe({
        next: (data) => {
          console.log('Deck created successfully:', data);
          this.generalService.refreshDecks(this.title);
          this.title = ''; // Clear the input field after successful creation
        },
        error: (err) => {
          console.error('Error creating deck:', err);
        }
      });
  }

  removeCard(cardID: string) {
    if (!this.selectedDeck) {
      console.error('No deck selected!');
      return;
    }
    console.log(`Removing card with ID ${cardID} into deck ${this.selectedDeck}`)
    this.http.delete<any>(`http://127.0.0.1:5001/card/remove/${this.selectedDeck}`, {body: { card_id: cardID }})
      .subscribe({
        next: (data) => {
          console.log('Card  successfully:', data);
          this.generalService.refreshDecks(this.selectedDeck)
        },
        error: (err) => {
          console.error('Error removing card:', err);
        }
      }
    );
  }

  isDeckNameValid(deckName: string): boolean {
    // Allow only letters, numbers, spaces, underscores, and hyphens
    return /^[\w\- ]+$/.test(deckName);
  }

}
