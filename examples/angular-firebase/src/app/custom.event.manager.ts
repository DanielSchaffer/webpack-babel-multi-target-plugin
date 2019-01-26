import { HostListener, Inject, Injectable, NgZone } from '@angular/core'
import { EVENT_MANAGER_PLUGINS, EventManager }      from '@angular/platform-browser'

export const NO_NG_ZONE_SUFFIX = '.noNgZone'

@Injectable()
export class CustomEventManager extends EventManager {
  constructor(
    @Inject(EVENT_MANAGER_PLUGINS) plugins: any[],
    private zone: NgZone,
  ) {
    super(plugins, zone)
  }

  addGlobalEventListener(target: string, eventName: string, handler: Function): Function {
    if(!target.endsWith(NO_NG_ZONE_SUFFIX)) {
      return super.addGlobalEventListener(target, eventName, handler)
    }

    target = target.substring(0, target.indexOf(NO_NG_ZONE_SUFFIX))
    return this.zone.runOutsideAngular(() =>
      super.addGlobalEventListener(target, eventName, handler),
    )
  }
}

export interface HostListenerNoNgZoneDecorator {
  (eventName: string, args?: string[]): any;

  new(eventName: string, args?: string[]): any;
}

export interface HostListenerNoNgZone extends HostListener {}

export function HostListenerNoNgZone(eventName: string, args?: string[]): HostListener {
  /* eslint-disable no-magic-numbers */
  const parts = eventName.split(':')
  const target = parts.length === 2 ? parts[0] : 'window'
  const actualEventName = parts.length === 2 ? parts[1]: parts[0]
  return HostListener(`${target}${NO_NG_ZONE_SUFFIX}:${actualEventName}`, args)
}
