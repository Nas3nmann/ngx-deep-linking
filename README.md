# ngx-deep-linking

A library for :sparkles:automatic synchronization:sparkles: of angular component fields with url path and query params.

## How to use

1. Install
  * with npm ``npm i @jdrks/ngx-deep-linking``
  * with yarn ``yarn add @jdrks/ngx-deep-linking``
2. Import NgxDeepLinkingModule into your module
   ```
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
3. And add configuration to your routes
  * Configure the ``DeepLinkingWrapperComponent`` in the ``component`` field
  * Add *ngxDeepLinkinConfig* to the data property of your route
  * Add your Component that should be rendered in the `component` field of *ngxDeepLinkingConfig*
  * Add the names of all component fields that should be synced with the url in the `params` and `queryParams` fields.
    (In this example the _selectedBookId_ will be synced with the corresponding path parameter and the _searchString_
    will be synced with/added as a url search parameter of the same name)

  ```
  const routes: Route[] = [
  {
    path: 'books/:selectedBookId',
    component: DeepLinkingWrapperComponent,
    data: {
      ngxDeepLinkingConfig: {
        component: BookListComponent,
        params: ['selectedBookId'],
        queryParams: ['searchString'],
      },
    }
  }];
  ```

4. Your component
  * **needs to have** `Input()` field declarations with **the same name as the provided param/queryParam** that should
    be automatically adjusted on url changes
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
