import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-complete-list',
  imports: [NgIf,NgFor, HttpClientModule],
  templateUrl: './complete-list.component.html',
  styleUrl: './complete-list.component.css'
})
export class CompleteListComponent {
  @Input() title: string = 'Complete Pokemon List';
  items: any[] = [];
  constructor(private http: HttpClient) {}
  ngOnInit() {
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
  
  // onItemClick(item: T) {
  //   this.itemClick.emit(item);
  // }
}
