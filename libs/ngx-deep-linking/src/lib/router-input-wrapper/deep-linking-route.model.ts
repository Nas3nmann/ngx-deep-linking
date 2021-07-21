import {Route} from '@angular/router';
import {Type} from '@angular/core';

export interface DeepLinkingRoute extends Route {
  wrappedComponent?: Type<any>,
  deepLinking?: DeepLinkingWrapperConfig
}

export interface DeepLinkingWrapperConfig {
  params: DeepLinkingParam[];
  queryParams: DeepLinkingParam[];
}

export interface DeepLinkingParam {
  name: string,
  type: 'string' | 'number' | 'json'
}
