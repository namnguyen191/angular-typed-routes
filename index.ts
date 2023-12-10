import { S } from 'ts-toolbelt';

export type ExtractParamsFromRoute<
  TRoute extends string,
  TParamVal extends string
> = {
  [K in S.Split<TRoute, '/'>[number] as K extends `:${infer TParam}`
    ? TParam
    : never]: TParamVal;
};

export type RouteFromParamsMap<
  TRoute extends string,
  TParams extends Record<string, string>
> = TRoute extends `${string}:${infer TParam}/${string}`
  ? RouteFromParamsMap<
      S.Replace<TRoute, `:${TParam}`, TParams[TParam]>,
      TParams
    >
  : TRoute extends `${string}:${infer TParam}`
  ? S.Replace<TRoute, `:${TParam}`, TParams[TParam]>
  : TRoute;

export type RoutesFromPath<
  TPaths extends Record<string, string>,
  TModulePath extends string
> = {
  [k in keyof TPaths]: TPaths[k] extends `${string}:${string}`
    ? <
        TParamsValue extends string,
        TParams extends ExtractParamsFromRoute<TPaths[k], TParamsValue>
      >(
        params: TParams
      ) => `${TModulePath extends ''
        ? ''
        : `/${TModulePath}`}/${RouteFromParamsMap<TPaths[k], TParams>}`
    : `${TModulePath extends '' ? '' : `/${TModulePath}`}/${TPaths[k]}`;
};

export const generateRoutesFromPaths = <
  TPaths extends Record<string, string>,
  TModulePath extends string
>(
  paths: TPaths,
  modulePath: TModulePath
): RoutesFromPath<TPaths, TModulePath> => {
  return Object.entries(paths).reduce((acc, [key, val]) => {
    if (val.includes(':')) {
      const routeFn = (params: Record<string, string>) => {
        let constructedPath = val;
        for (const [paramKey, paramVal] of Object.entries(params)) {
          constructedPath = constructedPath.replace(`:${paramKey}`, paramVal);
        }

        return `${modulePath ? '/' + modulePath : ''}/${constructedPath}`;
      };
      return { ...acc, [key]: routeFn };
    }
    return { ...acc, [key]: `${modulePath ? '/' + modulePath : ''}/${val}` };
  }, {}) as RoutesFromPath<TPaths, TModulePath>;
};
