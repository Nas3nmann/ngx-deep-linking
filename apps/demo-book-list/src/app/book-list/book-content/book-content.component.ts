import { Component, Input } from '@angular/core';
import { Book } from '../book.model';

@Component({
  selector: 'jdrks-book-content',
  templateUrl: './book-content.component.html',
  styleUrls: ['./book-content.component.scss'],
})
export class BookContentComponent {
  @Input()
  book!: Book;
}
