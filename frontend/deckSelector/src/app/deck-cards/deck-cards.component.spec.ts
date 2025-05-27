import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckCardsComponent } from './deck-cards.component';

describe('DeckCardsComponent', () => {
  let component: DeckCardsComponent;
  let fixture: ComponentFixture<DeckCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeckCardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeckCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
