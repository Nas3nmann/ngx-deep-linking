import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  OnDestroy,
  OnInit,
  Type,
  ViewContainerRef,
} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {DeepLinkingParam, DeepLinkingRoute} from './deep-linking-route.model';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {EMPTY, Observable} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {replaceUrlPathParam, splitUrlAndQueryParams} from './url-helper';

@Component({
  templateUrl: './deep-linking-wrapper.component.html',
})
export class DeepLinkingWrapperComponent implements OnInit, OnDestroy {

  private route!: DeepLinkingRoute;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly componentFactoryResolver: ComponentFactoryResolver,
    private readonly viewContainerRef: ViewContainerRef
  ) {
  }

  ngOnInit(): void {
    this.route = this.readConfig();

    const componentRef = this.resolveAndRenderComponent(this.route.wrappedComponent!);

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
  }

  private readConfig(): DeepLinkingRoute {
    const route: DeepLinkingRoute = <DeepLinkingRoute>this.activatedRoute.snapshot.routeConfig;
    if (!route || !route.deepLinking || !route.wrappedComponent) {
      throw Error(
        'Configuration for ngx-deep-linking is missing in route definition'
      );
    }
    route.deepLinking.params = route.deepLinking.params || [];
    route.deepLinking.queryParams = route.deepLinking.queryParams || [];
    return route;
  }

  private resolveAndRenderComponent(component: Type<any>): ComponentRef<any> {
    const componentFactory =
      this.componentFactoryResolver.resolveComponentFactory(component);
    this.viewContainerRef.clear();
    return this.viewContainerRef.createComponent(componentFactory);
  }

  private populateAndSyncComponentInputsWithPathParams(
    componentInstance: any,
    params: DeepLinkingParam[]
  ): void {
    this.populateInputsFromParams(
      componentInstance,
      params,
      this.activatedRoute.snapshot.params
    );
    this.activatedRoute.params
      .pipe(untilDestroyed(this))
      .subscribe((changedParams) => {
        this.populateInputsFromParams(componentInstance, params, changedParams);
      });
  }

  private populateAndSyncComponentInputsWithQueryParams(
    componentInstance: any,
    params: DeepLinkingParam[]
  ): void {
    this.populateInputsFromParams(
      componentInstance,
      params,
      this.activatedRoute.snapshot.queryParams
    );
    this.activatedRoute.queryParams
      .pipe(untilDestroyed(this))
      .subscribe((changedParams) => {
        this.populateInputsFromParams(componentInstance, params, changedParams);
      });
  }

  private populateInputsFromParams(
    componentInstance: any,
    deepLinkingParams: DeepLinkingParam[],
    params: Params
  ) {
    for (let deepLinkingParam of deepLinkingParams) {
      const paramAsString = this.paramToString(componentInstance[deepLinkingParam.name]);
      if (paramAsString !== params[deepLinkingParam.name]) {
        componentInstance[deepLinkingParam.name] = this.getTypedParam(deepLinkingParam, params[deepLinkingParam.name]);
      }
    }
  }

  private getTypedParam(deepLinkingParam: DeepLinkingParam, param: string): any {
    if (param === undefined || param === null) {
      return deepLinkingParam.type === 'json' ? {} : param;
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
    instance: any,
    pathParams: DeepLinkingParam[]
  ) {
    pathParams.forEach((pathParam) => {
      const outputName = `${pathParam.name}Change`;
      const output: Observable<unknown> = instance[outputName];

      if (!!output) {
        output
          .pipe(
            untilDestroyed(this),
            switchMap((newValue) => {
              const routeConfig = this.activatedRoute.routeConfig;
              if (!routeConfig || !routeConfig.path) {
                return EMPTY;
              }

              const {urlWithoutParams, urlQueryParams} =
                splitUrlAndQueryParams(this.router.url);
              const pathDefinition = this.router.config
                .map((routeConfig) => routeConfig.path!)
                .filter((paths) => !!paths)
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
    instance: any,
    queryParams: DeepLinkingParam[]
  ) {
    queryParams.forEach((queryParam) => {
      const outputName = `${queryParam.name}Change`;
      const output: Observable<unknown> = instance[outputName];

      if (!!output) {
        output
          .pipe(
            untilDestroyed(this),
            switchMap((newValue) => {
              const {urlWithoutParams, urlQueryParams} =
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
    return newValue === undefined || newValue === null ? '' : JSON.stringify(newValue);
  }
}
