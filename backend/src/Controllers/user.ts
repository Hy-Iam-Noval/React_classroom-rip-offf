import e from "express";

import { Users } from "@prisma/client";
import { compare } from "bcrypt";
import { ValidationError } from "express-validator";
import { LocalSession } from "../MIddleware/LocalSession";
import { init, prisma } from "../Model/BasicQuery/init";
import { hash, warpAsOk, warpAsError, binding, Tuple } from "../Supports/support";
import { getValidator, validatorHaveErr } from "../Supports/validator";
import { getAllValidation } from "../FileSupport/file-validator";
import { getImgNameAndStoreToBody, saveFile } from "../FileSupport/file-sistem";

type Request = e.Request
type Response = e.Response

namespace Ctrl {
   type LoginTuple = Tuple<Request, Users | null>;

   export async function login(req: Request, res: Response) {      
      const result = await binding<LoginTuple, string>(warpAsOk([req, null]), [userValid]);
      return await result({
         success([req, user]) {
            LocalSession.setUser(req, user);
            res.json(null)
         },

         failed(error) {
            res.json(error).status(300);
         },
      });
   }

   export async function infoUser(_:Request, res:Response){
      return res.json(LocalSession.getUser ?? null)
   }


   async function userValid(params: LoginTuple) {
      const [req, _] = params;
      const user = await init.user.getUser(req.body!.email);
      if (!user?.email || !(await compare(req.body!.password, user!.password))) {
         return warpAsError("Email or password wrong");
      }
      return warpAsOk([req, user] as LoginTuple);
   }

   export async function register(req: Request, res: Response) {
      const result = await binding(
         warpAsOk(req), 
         [
            getAllValidation(true, (file)=>{
               file('img').extFileAllows(['png', 'jpg', 'jpeg'])
            }),
            hashPassword,
            saveFile('users', ['img']),
            getImgNameAndStoreToBody('img')
         ]
      );

      return await result({
         async success(req) {
            delete req.body.password2
            await init.user.createUser(req.body);
            res.json("Register complete");
         },
         async failed(error) {
            const msg = getValidator(error)
            res.json(msg).status(300);
         },
      });
   }

   ///
   function hashPassword(req: Request) {
      req.body!.password = hash(req.body!.password);
      return warpAsOk(req);
   }
}

export default { Ctrl };
