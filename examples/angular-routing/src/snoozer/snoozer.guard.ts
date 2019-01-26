import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router'

const DEFAULT_DELAY = 5000

export class SnoozerGuard implements CanActivate {

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(resolve.bind(null, true), route.params.delay || DEFAULT_DELAY)
    })
  }

}
