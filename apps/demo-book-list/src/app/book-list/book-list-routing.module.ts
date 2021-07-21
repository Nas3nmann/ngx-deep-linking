import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {DeepLinkingRoute, DeepLinkingWrapperComponent} from '@jdrks/ngx-deep-linking';
import {BookListComponent} from './book-list.component';
import {BookContentComponent} from './book-content/book-content.component';

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
    redirectTo: 'books/',
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookListRoutingModule {
}
