# :rocket: ngx-deep-linking - Deep linking via configuration

A library for :sparkles:automatic synchronization:sparkles: of angular component fields with url path and query params.

## Why?

* Easily synchronize your component fields with the url by **simple route configuration**
* **Type safe** configuration
* Supports synchronizing fields of type **number**, **string** and even **complex types as json**
* Supports lazy loaded Angular modules
* Supports hash routing strategy

## How to use

1. Install

* with npm ``npm i @jdrks/ngx-deep-linking``
* with yarn ``yarn add @jdrks/ngx-deep-linking``

2. Import NgxDeepLinkingModule into your module
   ```
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

* Add the ``DeepLinkingWrapperComponent`` in the ``component`` field
* Add the component that should be rendered in the `wrappedComponent` field
* Add the names of all component fields that should be synced with the url in the `deepLinking.params`
  or `deepLinking.queryParams` fields.
  (In this example the _selectedBookId_ will be synced with the corresponding path parameter. The _searchString_ will be
  added as url search parameter of the same name once it has a value)
* You can provide string(`type: 'string'`) fields, number fields(`type: 'number'`) and also fields that contain complex
  objects (`type: 'json'`).

  ```
  import {DeepLinkingRoute, DeepLinkingWrapperComponent} from '@jdrks/ngx-deep-linking';

  const routes: DeepLinkingRoute[] = [
    {
      path: 'books/:selectedBookId',
      component: DeepLinkingWrapperComponent,
      wrappedComponent: BookListComponent,
      deepLinking: {
        params: [
          {name: 'selectedBookId', type: 'number'}
        ],
        queryParams: [
          {name: 'searchString', type: 'string'}
        ],
      },
    }
  ];
  ```

4. Your component

* **needs to have** `Input()` field declarations with **the same name as the provided param/queryParam** that should be
  automatically adjusted on url changes
* *may have* `Output()` declarations to adjust the url on changes inside the component (The output field name follows
  the naming convention for Angular's two way data binding and appends 'Change' to the outputs)

  ```
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
