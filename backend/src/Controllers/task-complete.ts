
import e from "express";
import { getImgNameAndStoreToBody, saveFile } from "../FileSupport/file-sistem";
import { getAllValidation } from "../FileSupport/file-validator";
import { init, prisma } from "../Model/BasicQuery/init";
import {LocalSession} from '../MIddleware/LocalSession';
import { binding, warpAsOk } from "../Supports/support";
import { getValidator } from "../Supports/validator";

namespace View {
   export async function get(req: e.Request, res:e.Response){
      const {adminId, uuid} = await prisma.classes.findFirst({where: {uuid: req.body!.uuid}})
      const taskId = parseInt(req.query.id as string)
      const complete = adminId === LocalSession.getUser.id ?
         prisma.taskCompletes.findMany({
            where: { taskId }
         }) :
         prisma.taskCompletes.findFirst({where: {
            id: parseInt(req.query!.id as string),
            userId: LocalSession.getUser.id
         }})

      return res.json(await complete)
   }
}

namespace Ctrl {
   export async function taskDone(req:e.Request, res:e.Response) {
      const result = await binding(warpAsOk(req), [
         getAllValidation(false, (file)=>{
            file('img')
               .extFileAllows(['txt', 'png', 'jpg', 'jpeg'], 'Just allows txt, png, jpg, jpeg')
               .size({max: 300000}, 'Maximum file just 2mb')
               .required('Cannot empty')
         }),
         saveFile('task', ['file']),
         getImgNameAndStoreToBody('file')
      ])

      result({
         success(value) {
            init.taskComplete.collectResult({
               userId: LocalSession.getUser.id,
               ...value.body
            })
            res.json(null)
         },
         failed(value) {
            res.json(getValidator(value))
         },
      })
   }         
}

export default {View, Ctrl}