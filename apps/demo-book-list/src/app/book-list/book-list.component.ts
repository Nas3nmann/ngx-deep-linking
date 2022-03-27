import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Book } from './book.model';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'jdrks-book-list',
  styleUrls: ['book-list.component.scss'],
  templateUrl: 'book-list.component.html',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class BookListComponent implements OnInit {
  books = new MatTableDataSource(BOOKS);
  columnsToDisplay = ['author', 'title'];

  @Output()
  searchStringChange: ReplaySubject<string> = new ReplaySubject<string>();

  @Output()
  private selectedBookIdChange: EventEmitter<number> = new EventEmitter<number>();

  private _selectedBook: Book | undefined;

  get selectedBook(): Book | undefined {
    return this._selectedBook;
  }

  set selectedBook(book: Book | undefined) {
    this._selectedBook = book;
    this.selectedBookIdChange.next(book?.id);
  }

  @Input()
  get selectedBookId(): number | undefined {
    return this.selectedBook?.id;
  }

  set selectedBookId(bookId: number | undefined) {
    this.selectedBook = this.books.data.find((book) => book.id === bookId);
  }

  private _searchString = '';

  @Input()
  get searchString(): string {
    return this._searchString;
  }

  set searchString(value: string) {
    this._searchString = value;
    this.searchStringChange.next(value);
  }

  ngOnInit(): void {
    this.searchStringChange.subscribe((searchString) => {
      this.books.filter = searchString;
    });
  }
}

const BOOKS: Book[] = [
  {
    id: 1,
    author: 'Mr. Jones',
    title: 'Deeplinking for dummies',
    pages: [
      { index: 1, content: 'This is page 1' },
      { index: 2, content: 'This is page 2' },
    ],
  },
  {
    id: 2,
    author: 'Janine Doyle',
    title: 'About books',
    pages: [{ index: 1, content: 'So many pages' }],
  },
  {
    id: 3,
    author: 'Donny Winslow',
    title: 'My life',
    pages: [
      { index: 1, content: 'Birth' },
      { index: 2, content: 'Life' },
      { index: 3, content: 'Death' },
    ],
  },
];
