import e from "express";
import { v4 } from "uuid";
import { LocalSession } from "../MIddleware/LocalSession";
import { init, prisma } from "../Model/BasicQuery/init";
import { binding, warpAsError, warpAsOk } from "../Supports/support";
import { getValidator, validatorHaveErr } from "../Supports/validator";
import { getImgNameAndStoreToBody, saveFile } from "../FileSupport/file-sistem";

namespace View {
   export async function infoClass(req: e.Request, res: e.Response) {
      const dataClass = await prisma.classes.findFirst({
         where: { uuid: req.params.uuid! },
         include: {admin:true, members:true}
      });
   
      return res.json(dataClass);
   }
   export async function listClass(_: e.Request, res: e.Response){
      const user = LocalSession.getUser;
      const listClass = await prisma.classes.findMany({
         where: { members: { some: { userId: user.id } } },
         include: {admin:true}
      });

      res.json(listClass);
   }
}

namespace Ctrl {
   export async function update(req: e.Request, res: e.Response) {
      const result = await binding(warpAsOk(req), [validatorHaveErr]);
      await result({
         success(req) {
            const { id, img, name, decstript } = req.body;
            prisma.classes.update({ where: { id }, data: { img, name, decstript } });
            res.json(warpAsOk("Update success"));
         },
         failed(err) {
            res.json(warpAsError(getValidator(err)));
         },
      });
   }

   export async function createClass(req: e.Request, res: e.Response) {
      const result = await binding(warpAsOk(req), [
         validatorHaveErr, 
         createUUID, 
         saveFile("classes", ['img']),
         getImgNameAndStoreToBody("img"), 
      ]);
      return await result({
         async success(value) {
            value.body.maximumMember = parseInt(value.body.maximumMember!)
            await init.classes.createClass(value.body);
            res.json(null);
         },
         async failed(error) {
            res.json(getValidator(error));
         },
      });
   }

   function createUUID(req: e.Request) {
      req.body.uuid = v4();
      return warpAsOk(req);
   }
}

export default { Ctrl, View };
