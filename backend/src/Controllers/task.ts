import e from "express";
import { init, prisma } from "../Model/BasicQuery/init";
import { LocalSession } from "../MIddleware/LocalSession";
import { binding, eraser, warpAsError, warpAsOk } from "../Supports/support";
import { getValidator, validatorHaveErr } from "../Supports/validator";
import { getImgNameAndStoreToBody, saveFile } from "../FileSupport/file-sistem";
import { getAllValidation } from "../FileSupport/file-validator";
import { Members, TaskCompletes, Tasks } from "@prisma/client";

type FilteringTask<T>= 
   (
      task: Array<Tasks & {complete: TaskCompletes[] }>,
      members?: Members[]
   ) => T[]

type FilteringTaskFunc<T, K> = {forAdmin: FilteringTask<T> , forUser: FilteringTask<K>}

namespace View {
   async function getAllClassData<T, K>(uuid:string, filteringFunc:FilteringTaskFunc<T, K>){
      const {task, adminId, members} = await init.classes.getAllDataClassByUUID(uuid)
      return LocalSession.getUser.id === adminId ? 
         filteringFunc.forAdmin(task, members) :
         filteringFunc.forUser(task)
   }

   export async function getTaskNotDone(req: e.Request, res: e.Response) {      
      return res.json(getAllClassData<Tasks, Tasks>(req.body!.uuid, {
         forAdmin(task, members){
            return task
               .filter(i=>i.complete.length !== members.length)
               .map(i=>{
                  delete i.complete
                  return i as Tasks
               })
         },
         forUser(task){
            return task
               .filter(i=>i.complete.some(j=>j.userId !== LocalSession.getUser.id))
         }
      }))
   }

   export async function allTask(req:e.Request, res:e.Response) {
      return res.json(await prisma.tasks.findMany({
         where:{class:{ uuid: req.params!.uuid} } , 
         include:{complete:true}
      }))
   }

   export async function getTaskDone(req:e.Request, res:e.Response) {
      return res.json(getAllClassData(req.body!.uuid, {
         forAdmin(task, members){
            return task
               .filter(i=>i.complete.length === members.length)
               .map(i=>{
                  delete i.complete
                  return i as Tasks
               })
         },
         forUser(task){
            return task
               .filter(i=>i.complete.some(j=>j.userId === LocalSession.getUser.id))
         }
      }))
   }

   export async function detailTask(req:e.Request, res:e.Response) {
      const id = req.query?.id ?? null 
      const task = id && await prisma.tasks.findFirst({
         where:{id: parseInt(id as string)},
      })
      return res.json(task)
   }
}

namespace Ctrl {
   export async function addTask(req: e.Request, res: e.Response) {
      const result = await binding(warpAsOk(req), [
         getAllValidation(true, (file)=>{
            file('file')
               .size({max: 300000})
               .extFileAllows(['png', 'jpeg', 'jpg', 'txt', 'zip', 'gpg', 'gpeg'])
               .maxFile(10)
         }), 
         saveFile('task', ['file']),
         getImgNameAndStoreToBody('file')
      ]);
      return await result({
         async success(req) {
            await init.task.addTask(req.body);
            res.json(null);
         },
         failed(err) {
            res.json(getValidator(err));
         },
      });
   }

   export async function deleteTask(req:e.Request, res:e.Response) {
      await init.task.deleteTask(parseInt(req.query!.id as string))
      res.end()
   }
}

export default { View, Ctrl };
