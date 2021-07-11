import {Type} from '@angular/core';

export interface RouterInputWrapperConfig {
  component: Type<any>;
  params: string[];
  queryParams: string[];
}
