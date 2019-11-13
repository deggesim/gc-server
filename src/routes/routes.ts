import * as Router from "koa-router";
import Route from "../models/route";

export abstract class Routes {

  protected abstract getRoutes(): Route[];

  public register(freeRouter: Router, router: Router) {
    this.getRoutes().forEach((route) => {
      this.registerRoute(route, freeRouter, router);
    });
  }

  private registerRoute = (route: Route, freeRouter: Router, router: Router) => {
    switch (route.$method) {
      case ("get"):
        freeRouter.get(route.$path, route.$action);
        break;
      case ("post"):
        router.post(route.$path, route.$action);
        break;
      case ("put"):
        router.put(route.$path, route.$action);
        break;
      case ("patch"):
        router.patch(route.$path, route.$action);
        break;
      case ("delete"):
        router.delete(route.$path, route.$action);
        break;
    }
  }

}

export default Routes;
