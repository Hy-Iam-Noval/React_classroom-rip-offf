import { Classes, Members } from "@prisma/client";
import e from "express";
import { LocalSession } from "../MIddleware/LocalSession";
import { prisma, init } from "../Model/BasicQuery/init";
import { binding, warpAsError, warpAsOk } from "../Supports/support";

namespace View {
   export async function detailMember(req: e.Request, res:e.Response) {
      const {members} = await prisma.classes.findFirst({where: {
         uuid: req.body!.uuid},
         include: {members: {include: {user: true}}}
      })
      
      return res.json(members.map(i=>i.user))
   }

   export async function all(req:e.Request, res: e.Response){
      return res.json(await init.members.getMembers(req.body.uuid!))
   }
}

namespace Ctrl {
   export async function exitFromClass(req: e.Request, res: e.Response) {
      const { uuid } = req.params;
      const getDataClassAndMember = await init.classes.getClassAndMembers(uuid);
      const result = await binding(warpAsOk(getDataClassAndMember), [getPession]);

      result({
         async success(data) {
            const { id } = LocalSession.getUser;
            const getIdMember = data.members.find((x) => x.userId == id)!.id;
     
            if (data.members.length == 1) 
               // if user just 1 class will be automatic delete including all data
               await init.classes.deleteAllDataClassByIdClass(data.id);
            else 
               // if not just delete user 
               await init.members.deleteMember(getIdMember);
            
            res.json(null);
         },

         async failed(error) {
            res.json(error);
         },
      });
   }

   /**
    * Checking user admin in that class and member greates than 1
    * @param data
    * @returns Option
    */
   async function getPession(data: Classes & { members: Members[] }) {
      const { id } = LocalSession.getUser;
      if (data.adminId == id && data.members.length > 1) {
         return warpAsError("You still admin and still have member");
      }
      return warpAsOk(data);
   }

   export async function join(req: e.Request, res: e.Response) {
      const { uuid } = req.params;
      const { id } = LocalSession.getUser;
      const classData = await init.classes.getClassAndMembers(uuid );

      if (classData.maximumMember === classData.members.length) 
         res.json("Class full");
      else {
         await init.members.addMember(classData.id, id);
         res.json(null);
      }
   }

   export async function kickUser(req: e.Request, res: e.Response) {
      const { id } = req.query;
      await init.members.deleteMember(parseInt(id as string));
      res.json(null);
   }
}

export default {View, Ctrl };
