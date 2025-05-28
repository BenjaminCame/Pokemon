import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  private deckSelectedSource = new Subject<string>();
  deckSelected$ = this.deckSelectedSource.asObservable();

  selectDeck(deckName: string) {
    console.log("Deck selected: " + deckName);
    this.deckSelectedSource.next(deckName);
  }
}
