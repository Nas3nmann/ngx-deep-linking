import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ContactFormComponent} from './contact-form/contact-form.component';
import {DeepLinkingRoute, DeepLinkingWrapperComponent} from '@jdrks/ngx-deep-linking';

const routes: DeepLinkingRoute[] = [{
  path: '',
  component: DeepLinkingWrapperComponent,
  wrappedComponent: ContactFormComponent,
  deepLinking: {
    queryParams: [
      {name: 'formContent', type: 'json'}
    ]
  },
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactFormRoutingModule {
}
