import { Component, Input, Output, EventEmitter, inject} from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
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
  generalService = inject(GeneralService);

  constructor(private http:HttpClient) {}

  ngOnInit() {
    this.http.get<any[]>("http://127.0.0.1:5001/decks")
      .subscribe({
        next: (data) => {
          this.decks = data;
          console.log('Items fetched successfully:', this.decks);
        },
        error: (err) => {
          console.error('Error fetching items:', err);
        }
      }
    );
  }

  addDeck(){
    this.http.post("http://127.0.0.1:5001/newdeck", { name: this.title })
      .subscribe({})
    this.ngOnInit()
  }

}
