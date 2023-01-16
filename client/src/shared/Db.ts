export namespace Db {
   export type User = {
      img: string | null
      id: number;
      name: string;
      email: string;
      password: string;
      createdAt: Date;
   };
   export type Member = {
      id: number;
      userId: number;
      classId: number;
      joinAt: Date;
   };
   export type Task = {
      id: number;
      name: string;
      comment?: string ;
      senderId: number;
      classId: number;
      file?: string ;
      createAt: Date;
   };
   export type Classes = {
      id: number;
      uuid: string;
      name: string;
      img?: string ;
      decstript?: string ;
      adminId: number;
      createdAt: Date;
      maximumMember: number;
   };
   export type TaskCompletes = {
      id: number;
      userId: number;
      taskId: number;
      comment?: string ;
      img: string;
      createAt: Date;
   }
}


export namespace DbWithObject {
   type SingleOrMany = 
      | 'single'
      | 'many'

   export type Task<T extends SingleOrMany> = T extends 'single' ? 
      {task: Db.Task} : 
      {task: Db.Task[]}

   export type Complete<T extends SingleOrMany> = T extends 'single' ? 
      {complete: Db.TaskCompletes} : 
      {complete: Db.TaskCompletes[]}

   export type Member<T extends SingleOrMany> = T extends 'single' ? 
      {members: Db.Member} : 
      {members: Db.Member[]}
      
   export type User<T extends SingleOrMany> = T extends 'single' ? 
      {user: Db.User} : 
      {user: Db.User[]}

   export type Classes<T extends SingleOrMany> = T extends 'single' ? 
      {user: Db.Classes} : 
      {user: Db.Classes[]}
   
}