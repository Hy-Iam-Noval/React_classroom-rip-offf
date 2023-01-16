import { PrismaClient } from "@prisma/client";
import { ClassesQuery } from "./ClassesQuery";
import { MembersQuery } from "./MembersQuery";
import { TaskComplete } from "./TaskComplete";
import { TaskQuery } from "./TaskQuery";
import { UserQuery } from "./UserQuery";

export const prisma = new PrismaClient();

export const init = {
   members: new MembersQuery(),
   user: new UserQuery(),
   classes: new ClassesQuery(),
   task: new TaskQuery(),
   taskComplete: new TaskComplete()
};
