import { prisma } from "./init";
import e from "express";
import { Users } from "@prisma/client";

export class UserQuery {
   async getUser(email: string) {
      return await prisma.users.findFirst({ where: { email } });
   }

   async createUser(userAccepted: Omit<Users, 'id'| 'createdAt'>) {
      await prisma.users.create({ data: userAccepted });
   }

   async deleteUser(id:number) {
      return await prisma.users.delete({ where: { id } });
   }
}
