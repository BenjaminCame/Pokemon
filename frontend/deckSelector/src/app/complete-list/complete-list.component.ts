import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { GeneralService } from '../general.service';

@Component({
  selector: 'app-complete-list',
  imports: [NgIf,NgFor, HttpClientModule],
  templateUrl: './complete-list.component.html',
  styleUrl: './complete-list.component.css'
})
export class CompleteListComponent {
  @Input() title: string = 'Complete Pokemon List';
  items: any[] = [];
  selectedDeck: string = '';
  constructor(private http: HttpClient, private generalService: GeneralService) {}
  ngOnInit() {
    this.generalService.deckSelected$.subscribe(deckName => {
      console.log("Deck selected in CompleteListComponent: " + deckName);
      this.selectedDeck = deckName;
    });
    this.http.get<any[]>("http://127.0.0.1:5001/cards")
      .subscribe({
        next: (data) => {
          this.items = data;
          console.log('Items fetched successfully:', this.items);
        },
        error: (err) => {
          console.error('Error fetching items:', err);
        }
      }
    );
  }

  insertCard(cardID: string) {
    if (!this.selectedDeck) {
      console.error('No deck selected!');
      return;
    }
    console.log(`Inserting card with ID ${cardID} into deck ${this.selectedDeck}`)
    this.http.post<any>(`http://127.0.0.1:5001/card/insert/${this.selectedDeck}`, { card_id: cardID })
      .subscribe({
        next: (data) => {
          console.log('Card inserted successfully:', data);
          this.generalService.refreshDecks(this.selectedDeck);
        },
        error: (err) => {
          console.error('Error inserting card:', err);
        }
      }
    );
  }
}
