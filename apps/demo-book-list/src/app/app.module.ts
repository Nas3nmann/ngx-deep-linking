import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { Route, RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const routes: Route[] = [
  {
    path: 'library/:location',
    loadChildren: () =>
      import('./book-list/book-list.module').then((m) => m.BookListModule),
  },
  {
    path: '**',
    redirectTo: 'library/berlin',
  },
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes, { useHash: true }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
