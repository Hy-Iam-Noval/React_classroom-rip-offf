import { Users } from "@prisma/client";
import e from "express";
import session from "express-session";

export class LocalSession {
   protected static userSession: session.Session & Partial<session.Session> & { [key: string]: any };

   static setUser(req: e.Request, user: Users) {
      this.userSession = req.session;
      this.userSession.user = user;
   }

   static get getUser(): Users {
      return this.userSession?.user as Users;
   }

   static get accessSession() {
      return this.userSession;
   }

   static end(){
      delete this.userSession
   }
}
