import { Tasks } from "@prisma/client";
import e from "express";
import { LocalSession } from "../../MIddleware/LocalSession";
import { prisma } from "./init";

type TaskData = Omit<Tasks,'id' | 'createAt'|'senderId'>

export class TaskQuery {
   async addTask(newData: TaskData){
      const { id } = LocalSession.getUser;
      await prisma.tasks.create({
         data: { ...newData, senderId: id, classId: parseInt(newData.classId as unknown as string)},
      });
   }

   async deleteTask(id: number) {
      await prisma.$transaction([prisma.tasks.delete({ where: { id } }), prisma.taskCompletes.deleteMany({ where: { taskId: id } })]);
   }

   async allTaskInClass(uuid: string) {
      return await prisma.tasks.findMany({ where: { class: { uuid } } });
   }

   async allTaskByIdUser(uuid: string) {
      return await prisma.tasks.findMany({
         where: { class: { uuid } },
         include: { _count: { select: { complete: true } } },
      });
   }
}
