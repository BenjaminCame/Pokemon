import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CompleteListComponent } from "./complete-list/complete-list.component";
import { DeckListComponent } from "./deck-list/deck-list.component";
import { DeckCardsComponent } from "./deck-cards/deck-cards.component";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CompleteListComponent,
    DeckListComponent,
    DeckCardsComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
