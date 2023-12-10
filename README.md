# ANGULAR-TYPED-ROUTES

> Adding strict typing to your Angular routes.

## Installation

```sh
$ npm install angular-typed-routes
```

## Sample Usage:

### Inside a `route.ts` file:

```ts
import { Route } from '@angular/router';

import { generateRoutesFromPaths } from 'angular-typed-routes';

export const featureModulePath = 'feature';

export const featurePaths = {
  main: 'main',
  single: ':id',
  nested: ':id1/edit/:id2'
} as const;

export const featureRoutes: Route[] = [
  {
    path: '',
    component: FeatureComponent,
    children: [
      {
        path: featurePaths.main,
        loadComponent: () =>
          import('...').then(
            (mod) => mod.FeatureComponentLazy
          )
      },
      {
        path: featurePaths.single,
        component: FeatureSingleComponent
      },
      {
        path: featurePaths.nested,
        component: FeatureNestedComponent
      },
      {
        path: '**',
        redirectTo: featurePaths.main,
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

export const availableFeatureRoutes = generateRoutesFromPaths(featurePaths, featureModulePath);
```

### Inside a component or anywhere that you want to perform navigation:

```ts
const linkToMainFeature = availableFeatureRoutes.main; // "/feature/main"
const linkToSingleFeature = availableFeatureRoutes.single({id: '1'}) // "/feature/1"
const linkToNestedFeature = availableFeatureRoutes.nested({ id1: '1', id2: '2' }); // "/feature/1/edit/1"
```


## Built With

* Nothing but Typescript

## Authors

* **Nam Nguyen** - [namnguyen191](https://github.com/namnguyen191)

## License

[MIT License](https://andreasonny.mit-license.org/2019) © Andrea SonnY
