import * as Period from "../entities/Period"
import {DashboardPresenter} from '../presenters/DashboardPresenter'
import * as DashboardView from "../view/dashboard"

export const DashboardRouteType = Symbol()
export type DashboardRoute = {
    type: typeof DashboardRouteType
    periodId?: Period.ID
}

export const PeriodRouteType = Symbol()
export type PeriodRoute = {
    type: typeof PeriodRouteType
    periodId?: Period.ID
}

export const UnknownRouteType = Symbol()
export type UnknownRoute = {
    type: typeof UnknownRouteType
}


export type Route = PeriodRoute | DashboardRoute | UnknownRoute

export function urlToRoute(url: Location, noMatched: Route): Route {
    throw new Error("")
}

export function routeToString(route: Route): string {
    return ""
}

export interface Router {
    transitionTo(route: Route): void
    getRoute(): Route
    onChangeRoute(route: Route): void
}

export class RouterImpl implements Router {
    constructor(private window: Window, private dashboardPresenter: DashboardPresenter) {
        window.addEventListener('popstate', () => {
            const route = urlToRoute(window.location, {type: UnknownRouteType})
            this._route = route
            this.onChangeRoute(route)
        })
    }

    private _route: Route

    transitionTo(route: Route) {
        const url = routeToString(route)
        this.window.location.href = url
    }

    getRoute(): Route {
        return this._route
    }


    onChangeRoute(route: Route) {
        switch(route.type) {
            case DashboardRouteType: {
                this.dashboardPresenter.onChange(dto => {
                    this.render(DashboardView.view(dto, this.dashboardPresenter))
                })
                break
            }

            case PeriodRouteType: {

                break
            }
        }
    }

    render(element: JSX.Element) {
        ReactDom.render(element, document.body)
    }
}