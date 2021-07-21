import {Route} from '@angular/router';
import {Type} from '@angular/core';

export interface DeepLinkingRoute extends Route {
  wrappedComponent?: Type<any>,
  deepLinking?: DeepLinkingWrapperConfig
}

export interface DeepLinkingWrapperConfig {
  params?: DeepLinkingPathParam[];
  queryParams?: DeepLinkingQueryParam[];
}

export interface DeepLinkingPathParam {
  name: string,
  type: 'string' | 'number'
}

export interface DeepLinkingQueryParam {
  name: string,
  type: 'string' | 'number' | 'json'
}
