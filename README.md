# :rocket: ngx-deep-linking

A library for :sparkles:automatic synchronization:sparkles: of angular component fields with url path and query params.

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![semantic-release: angular](https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)

## Why?

- Easily synchronize your component fields with the url by **simple route configuration**
- **Type safe** configuration
- Supports synchronizing fields of type **number**, **string** and even **complex types as json**
- Supports **lazy loading** for Angular modules
- Supports **hash routing** strategy

## Demo

![Demo booklist](https://raw.githubusercontent.com/Nas3nmann/ngx-input-deep-linking/main/apps/demo-book-list/src/assets/demo.gif)

[Or view live demo on github pages](https://nas3nmann.github.io/ngx-deep-linking/)

![Demo form](https://raw.githubusercontent.com/Nas3nmann/ngx-input-deep-linking/main/apps/demo-form/src/assets/demo.gif)

## How to use

1. Install

- with npm `npm i @jdrks/ngx-deep-linking`
- with yarn `yarn add @jdrks/ngx-deep-linking`

2. Import NgxDeepLinkingModule into your module

   ```ts
   import {NgxDeepLinkingModule} from '@jdrks/ngx-deep-linking';

   @NgModule({
      declarations: [AppComponent, BookListComponent, BookContentComponent],
      imports: [
        ...
        NgxDeepLinkingModule,
        RouterModule.forRoot(routes),
        ...
      ],
      bootstrap: [AppComponent],
   })
   export class AppModule {
   }
   ```

3. And add configuration to your routes (You can use the provided interface `DeepLinkingRoute`)

- Add the `DeepLinkingWrapperComponent` in the `component` field
- Add the component that should be rendered in the `wrappedComponent` field
- Add the names of all component fields that should be synced with the url in the `deepLinking.params`
  or `deepLinking.queryParams` fields.
  (In this example the _selectedBookId_ will be synced with the corresponding path parameter. The _searchString_ will
  be added as url search parameter of the same name once it has a value)
- You can provide string(`type: 'string'`) fields, number fields(`type: 'number'`) and also fields that contain
  complex objects (`type: 'json'`).

  ```ts
  import {
    DeepLinkingRoute,
    DeepLinkingWrapperComponent,
  } from '@jdrks/ngx-deep-linking';

  const routes: DeepLinkingRoute[] = [
    {
      path: 'books/:selectedBookId',
      component: DeepLinkingWrapperComponent,
      wrappedComponent: BookListComponent,
      deepLinking: {
        params: [{ name: 'selectedBookId', type: 'number' }],
        queryParams: [{ name: 'searchString', type: 'string' }],
      },
    },
  ];
  ```

4. Your component

- **needs to have** `Input()` field declarations with **the same name as the provided param/queryParam** that should
  be automatically adjusted on url changes
- _may have_ `Output()` declarations to adjust the url on changes inside the component (The output field name follows
  the naming convention for Angular's two way data binding and appends 'Change' to the outputs)

  ```ts
  export class BookListComponent {
    @Input()
    private selectedBookId: number;

    @Output()
    private selectedBookIdChange: EventEmitter<number> = new EventEmitter<number>();

    @Input()
    private searchString: string;

    @Output()
    private searchStringChange: EventEmitter<string> = new EventEmitter<string>();
  }
  ```
