import { Members } from "@prisma/client";
import { prisma } from "./init";

export class MembersQuery {
   async getMemberByUserId(userId: number, uuid: string) {
      return await prisma.members.findFirst({
         where: { userId, class: { uuid } },
      })
   }

   async getAllDataMember(userId: number, uuid: string) {
      return await prisma.members.findFirst({
         where: { userId, class: { uuid } },
         include: { user: true },
      });
   }

   async getMembers(uuid: string): Promise<Members[]> {
      return await prisma.members.findMany({ where: { class: { uuid } } });
   }

   async deleteMember(id: number) {
      await prisma.members.delete({ where: { id } });
   }

   async addMember(classId: number, userId: number) {
      await prisma.members.create({ data: { classId, userId } });
   }
}
