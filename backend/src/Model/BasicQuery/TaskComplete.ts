import { TaskCompletes } from "@prisma/client";
import { prisma } from "./init";

type DataResult = 
   {
      userId: number;
      taskId: number;
      comment: string;
      img: string;
   }

export class TaskComplete {
   async collectResult<T extends DataResult>(datas: T){
      await prisma.taskCompletes.create({
         data: datas
      })
   }

   async getByIdUser(userId:number) {
      return prisma.taskCompletes.findMany({where:{ userId }})
   }
   
   async getByUUID(uuid:string, userId?:number) {
      return prisma.taskCompletes.findMany({ where: {task:{ class:{uuid}}, userId} })
   }

   async getByTaskId(taskId:number){
      return prisma.taskCompletes.findMany({ where:{ taskId } })
   }
}