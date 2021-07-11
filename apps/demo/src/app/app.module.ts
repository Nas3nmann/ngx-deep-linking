import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {ExampleComponent} from './example/example.component';
import {Route, RouterModule} from '@angular/router';
import {NgxInputDeeplinkingModule, RouterInputWrapperComponent} from '@jdrks/ngx-input-deeplinking';

const routes: Route[] = [
  {
    path: 'example/:pathParam',
    component: RouterInputWrapperComponent,
    data: {
      ngxInputDeeplinkingConfig: {
        component: ExampleComponent,
        params: [
          'pathParam'
        ],
        queryParams: [
          'queryParam'
        ]
      }
    }
  }
];

@NgModule({
  declarations: [AppComponent, ExampleComponent],
  imports: [BrowserModule, NgxInputDeeplinkingModule, RouterModule.forRoot(routes)],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
