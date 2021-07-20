import {Type} from '@angular/core';

export interface DeepLinkingWrapperConfig {
  component: Type<any>;
  params: string[];
  queryParams: string[];
}
