import e, { NextFunction } from "express";
import { LocalSession } from "./LocalSession";
import { CostumAuth } from "./CostumAuth";

export namespace Middleware {
  function foundation(condition: () => boolean, ifFAiled: (res: e.Response) => void) {
    return (_: e.Request, res: e.Response, next: NextFunction) => {
      if (condition()) {
        return next();
      }
      return ifFAiled(res);
    };
  }

  export function auth() {
    return foundation(
      () => LocalSession.getUser != undefined,
      (res) => res.redirect("/login")
    );
  }

  export function guest() {
    return foundation(
      () => LocalSession.getUser == undefined,
      (res) => res.redirect("back")
    );
  }

  export function costum(name: string) {
    return foundation(
      () => CostumAuth.get(name),
      (res) => res.redirect("/error")
    );
  }
}
