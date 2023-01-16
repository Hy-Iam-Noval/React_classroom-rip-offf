import e from "express";
import path from 'path'
import { UploadedFile } from "express-fileupload";
import { Tuple, warpAsOk } from "../Supports/support";

function hashFile(file: UploadedFile) {
   file.name = new Date().getTime() + " - " + file.name;
   return file;
}

function uploadFile(folderPath: string, file: UploadedFile) {
   file.mv(path.resolve(`./public/assets/${folderPath}/${file.name}`));
}

export function saveFile(pathFolder: string, fieldKey: string[]) {
   return (req:e.Request) =>{
      const { isArray } = Array;
      fieldKey.forEach(i=>{
         const files = req.files?.[i]
         if (files) {
            Object.assign(req.files[i], isArray(files) ? 
               files.map(file=>hashFile(file)) : 
               hashFile(files)
            )

            isArray(files) ? 
               files.forEach(file=>uploadFile(pathFolder, file)) : 
               uploadFile(pathFolder, files)
         }
      })

      return warpAsOk(req)
   }
}

/**
 *
 * @param fieldBody must be same with in files
 * @returns request
 */
export function getImgNameAndStoreToBody(fieldBody: string | string[]) {
   const store = (req:e.Request, field:string) =>{
      const files = req.files?.[field]
      if (files) {
         req.body[field] = Array.isArray(files) ? 
            JSON.stringify(files.map(i=>i.name)) : 
            JSON.stringify(files.name)
      }
   }

   return (req:e.Request) =>{
      typeof fieldBody === 'string' ? 
         store(req, fieldBody) : 
         fieldBody.forEach(field=> store(req, field))
   
      return warpAsOk(req);
   }
}

