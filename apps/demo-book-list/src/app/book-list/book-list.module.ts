import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';

import { BookListRoutingModule } from './book-list-routing.module';
import { BookContentComponent } from './book-content/book-content.component';
import { BookListComponent } from './book-list.component';
import { NgxDeepLinkingModule } from '@jdrks/ngx-deep-linking';

@NgModule({
  imports: [
    BookListRoutingModule,
    CommonModule,
    FormsModule,
    MatTableModule,
    MatToolbarModule,
    MatInputModule,
    NgxDeepLinkingModule,
  ],
  declarations: [BookContentComponent, BookListComponent],
})
export class BookListModule {}
