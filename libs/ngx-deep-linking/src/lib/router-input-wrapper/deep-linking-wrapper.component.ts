import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  OnDestroy,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  DeepLinkingPathParam,
  DeepLinkingQueryParam,
  DeepLinkingRoute,
} from './deep-linking-route.model';
import { EMPTY, Observable, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { replaceUrlPathParam, splitUrlAndQueryParams } from './url-helper';
import { ComponentType } from '@angular/cdk/overlay';

type UnknownComponent = Record<string, any>;

@Component({
  templateUrl: './deep-linking-wrapper.component.html',
})
export class DeepLinkingWrapperComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  private route!: DeepLinkingRoute;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly componentFactoryResolver: ComponentFactoryResolver,
    private readonly viewContainerRef: ViewContainerRef
  ) {}

  ngOnInit(): void {
    this.route = this.readConfig();

    const componentRef = this.resolveAndRenderComponent(
      this.route.wrappedComponent!
    );

    this.populateAndSyncComponentInputsWithPathParams(
      componentRef.instance,
      this.route.deepLinking!.params!
    );
    this.populateAndSyncComponentInputsWithQueryParams(
      componentRef.instance,
      this.route.deepLinking!.queryParams!
    );

    this.subscribeToComponentOutputsToSyncPathParams(
      componentRef.instance,
      this.route.deepLinking!.params!
    );
    this.subscribeToComponentOutputsToSyncQueryParams(
      componentRef.instance,
      this.route.deepLinking!.queryParams!
    );
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private readConfig(): DeepLinkingRoute {
    const route: DeepLinkingRoute = this.activatedRoute.snapshot
      .routeConfig as DeepLinkingRoute;
    if (!route || !route.deepLinking || !route.wrappedComponent) {
      throw Error(
        'Configuration for ngx-deep-linking is missing in route definition'
      );
    }
    route.deepLinking.params = route.deepLinking.params || [];
    route.deepLinking.queryParams = route.deepLinking.queryParams || [];
    return route;
  }

  private resolveAndRenderComponent(
    component: ComponentType<UnknownComponent>
  ): ComponentRef<UnknownComponent> {
    const componentFactory =
      this.componentFactoryResolver.resolveComponentFactory(component);
    this.viewContainerRef.clear();
    return this.viewContainerRef.createComponent(componentFactory);
  }

  private populateAndSyncComponentInputsWithPathParams(
    componentInstance: UnknownComponent,
    params: DeepLinkingPathParam[]
  ): void {
    this.populateInputsFromPathParams(
      componentInstance,
      params,
      this.activatedRoute.snapshot.params
    );
    this.activatedRoute.params
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((changedParams: any) => {
        this.populateInputsFromPathParams(
          componentInstance,
          params,
          changedParams
        );
      });
  }

  private populateInputsFromPathParams(
    componentInstance: UnknownComponent,
    deepLinkingParams: DeepLinkingPathParam[],
    params: Params
  ) {
    for (const deepLinkingParam of deepLinkingParams) {
      const paramAsString = this.paramToString(
        componentInstance[deepLinkingParam.name]
      );
      if (paramAsString !== params[deepLinkingParam.name]) {
        componentInstance[deepLinkingParam.name] = this.getTypedPathParam(
          deepLinkingParam,
          params[deepLinkingParam.name]
        );
      }
    }
  }

  private getTypedPathParam(
    deepLinkingParam: DeepLinkingPathParam,
    param: string
  ): string | number {
    switch (deepLinkingParam.type) {
      case 'string':
        return param;
      case 'number':
        return Number(param);
      default:
        return param;
    }
  }

  private populateAndSyncComponentInputsWithQueryParams(
    componentInstance: UnknownComponent,
    params: DeepLinkingQueryParam[]
  ): void {
    this.populateInputsFromQueryParams(
      componentInstance,
      params,
      this.activatedRoute.snapshot.queryParams
    );
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((changedParams: any) => {
        this.populateInputsFromQueryParams(
          componentInstance,
          params,
          changedParams
        );
      });
  }

  private populateInputsFromQueryParams(
    componentInstance: UnknownComponent,
    deepLinkingParams: DeepLinkingQueryParam[],
    params: Params
  ) {
    for (const deepLinkingParam of deepLinkingParams) {
      const paramAsString = this.paramToString(
        componentInstance[deepLinkingParam.name]
      );
      if (paramAsString !== params[deepLinkingParam.name]) {
        componentInstance[deepLinkingParam.name] = this.getTypedQueryParam(
          deepLinkingParam,
          params[deepLinkingParam.name]
        );
      }
    }
  }

  private getTypedQueryParam(
    deepLinkingParam: DeepLinkingQueryParam,
    param: string
  ): string | number | Record<string, unknown> {
    if (param === undefined || param === null) {
      return param;
    }

    switch (deepLinkingParam.type) {
      case 'string':
        return param;
      case 'number':
        return Number(param);
      case 'json':
        return JSON.parse(param);
    }
  }

  private subscribeToComponentOutputsToSyncPathParams(
    instance: UnknownComponent,
    pathParams: DeepLinkingQueryParam[]
  ) {
    pathParams.forEach((pathParam) => {
      const outputName = `${pathParam.name}Change`;
      const output: Observable<unknown> = instance[outputName];

      if (!!output) {
        output
          .pipe(
            takeUntil(this.ngUnsubscribe),
            switchMap((newValue) => {
              const routeConfig = this.activatedRoute.routeConfig;
              if (!routeConfig || !routeConfig.path) {
                return EMPTY;
              }

              const { urlWithoutParams, urlQueryParams } =
                splitUrlAndQueryParams(this.router.url);
              const pathDefinition = this.activatedRoute.snapshot.pathFromRoot
                .map((activatedRoute) => activatedRoute.routeConfig)
                .filter((routeConfig) => !!routeConfig)
                .map((routeConfig) => routeConfig!.path)
                .filter((path) => !!path)
                .join('/');

              const newUrl = replaceUrlPathParam(
                urlWithoutParams,
                pathDefinition,
                pathParam.name,
                this.paramToString(newValue)
              );
              return this.router.navigateByUrl(newUrl + '?' + urlQueryParams);
            })
          )
          .subscribe();
      }
    });
  }

  private subscribeToComponentOutputsToSyncQueryParams(
    instance: UnknownComponent,
    queryParams: DeepLinkingQueryParam[]
  ) {
    queryParams.forEach((queryParam) => {
      const outputName = `${queryParam.name}Change`;
      const output: Observable<unknown> = instance[outputName];

      if (!!output) {
        output
          .pipe(
            takeUntil(this.ngUnsubscribe),
            switchMap((newValue) => {
              const { urlWithoutParams, urlQueryParams } =
                splitUrlAndQueryParams(this.router.url);
              if (!!newValue) {
                urlQueryParams.set(
                  queryParam.name,
                  this.paramToString(newValue)
                );
              } else {
                urlQueryParams.delete(queryParam.name);
              }

              const newUrl = `${urlWithoutParams}?${urlQueryParams}`;
              return this.router.navigateByUrl(newUrl);
            })
          )
          .subscribe();
      }
    });
  }

  private paramToString(newValue: unknown) {
    if (newValue === undefined || newValue === null) {
      return '';
    } else if (typeof newValue === 'string') {
      return newValue;
    } else {
      return JSON.stringify(newValue);
    }
  }
}
