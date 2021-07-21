import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {RouterModule} from '@angular/router';
import {DeepLinkingRoute, DeepLinkingWrapperComponent, NgxDeepLinkingModule,} from '@jdrks/ngx-deep-linking';
import {FormsModule} from '@angular/forms';
import {BookListComponent} from './book-list/book-list.component';
import {MatTableModule} from '@angular/material/table';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BookContentComponent} from './book-list/book-content/book-content.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatInputModule} from '@angular/material/input';

const routes: DeepLinkingRoute[] = [
  {
    path: 'books/:selectedBookId',
    component: DeepLinkingWrapperComponent,
    wrappedComponent: BookListComponent,
    deepLinking: {
      params: [{name: 'selectedBookId', type: 'number'}],
      queryParams: [{name: 'searchString', type: 'string'}],
    },
    children: [
      {
        path: 'content',
        component: BookContentComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/books/',
  },
];

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
