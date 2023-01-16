import e from "express";
import { LocalSession } from "../../MIddleware/LocalSession";
import { prisma } from "./init";
import { Classes } from "@prisma/client";

export class ClassesQuery {
   async getAllDataClassByUUID(uuid: string) {
      return await prisma.classes.findFirst({
         where: { uuid },
         include: { members: true, admin:true, task: {include:{complete:true}} }
      });
   }

   async getClassAndMembers(uuid: string) {
      return prisma.classes.findFirst({
         where: { uuid },
         include: { members: true },
      });
   }

   async getDataClassByUUID(uuid: string) {
      return await prisma.classes.findFirst({ where: { uuid } });
   }

   async createClass(dataClass: Omit<Classes, 'id' | 'createAt'>) {
      const { id } = LocalSession.getUser;
      await prisma.classes.create({
         data: {
            ...dataClass,
            adminId:id,
            members: {
               create: {
                  userId: id,
               },
            },
         },
      });
   }

   async deleteAllDataClassByIdClass(classId: number) {
      await prisma.$transaction([
         // delete class
         prisma.classes.delete({ where: { id: classId } }),
         // delete all task
         prisma.tasks.deleteMany({ where: { classId } }),
         // delete all task complete
         prisma.taskCompletes.deleteMany({ where: { task: { classId } } }),
         // delete member
         prisma.members.deleteMany({ where: { classId } }),
      ]);
   }
}
