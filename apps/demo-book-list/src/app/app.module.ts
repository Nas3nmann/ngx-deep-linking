import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {Route, RouterModule} from '@angular/router';
import {NgxDeepLinkingModule,} from '@jdrks/ngx-deep-linking';
import {FormsModule} from '@angular/forms';
import {BookListComponent} from './book-list/book-list.component';
import {MatTableModule} from '@angular/material/table';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BookContentComponent} from './book-list/book-content/book-content.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatInputModule} from '@angular/material/input';

const routes: Route[] = [
  {
    path: 'library/:location',
    loadChildren: () => import('./book-list/book-list.module').then(m => m.BookListModule)
  },
  {
    path: '**',
    redirectTo: 'library/berlin',
  }
]

@NgModule({
  declarations: [AppComponent, BookListComponent, BookContentComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgxDeepLinkingModule,
    RouterModule.forRoot(routes),
    FormsModule,
    MatTableModule,
    MatToolbarModule,
    MatInputModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
