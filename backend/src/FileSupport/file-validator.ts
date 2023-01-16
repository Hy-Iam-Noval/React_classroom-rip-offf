import e from "express";
import path from 'path'
import fileUpload, { UploadedFile } from "express-fileupload";
import { validatorHaveErr } from "../Supports/validator";
import { Option, warpAsError, warpAsOk } from "../Supports/support";
import { ValidationError } from "express-validator";

type SizeFile = 
   {
      min?:number,
      max:number
   }

type FileValidatorFunc = ( file: (field:string | string[]) => FileValidate) =>void
type FileValidateMsg = Pick<ValidationError, 'msg' | 'param'>
type FileValidateResult = Option<e.Request, FileValidateMsg[]>

class FileValidate {
   private static msg:FileValidateMsg[] = []

   constructor(
      private req:e.Request,
      private fieldName: string | string[]
   ) {}

   
   extFileAllows(extFile:string[], msg?:string){
      return this.findOrSkip((field, files)=>{
         const fileNotAllows = 
            Array.isArray(files) ? 
               !files.every(file => this.fileAllows(extFile, file)) : 
               !this.fileAllows(extFile, files)

         if (fileNotAllows) 
            this.pushMsg(msg ?? `This field just collect file with extendtion ${extFile.join(', ')}`, field)
      })
   }

   size(setting:SizeFile, msg?:string) {
      return this.findOrSkip((field, files)=>{
         const fileNotValid = 
            Array.isArray(files) ? 
               files.every(file => this.checkFileSize(setting, file)) : 
               this.checkFileSize(setting,files)
         
         const minMsg = setting.min === null ? '' : `min ${setting.min} kb`

         if (fileNotValid) 
            this.pushMsg(msg ?? `Size to big or small, ${minMsg} and max ${setting.max} kb`, field)
      })     
   }
   

   required(msg?:string){
      this.getFieldName(name=>{
         if(this.req.files[name] === undefined) this.pushMsg(msg ?? 'This field cannot empty', name)
      })
      return this
   }

   maxFile(max:number){
      return this.findOrSkip((field, files)=>{
         const lengthFile = Array.isArray(files) ? 
            files.length : 
            1

         if (lengthFile > max) this.pushMsg(`File to muct maximum ${max}`, field)
      })
   }
   

   private pushMsg = (msg:string, param:string) => FileValidate.msg.push({msg, param})

   private checkFileSize = (setting:SizeFile, file:UploadedFile) => 
      (setting.min !== null && setting.min < file.size) || (setting.max > file.size)

   private fileAllows = (extFiles:string[], file:UploadedFile) =>
      extFiles.includes(path.extname(file.name).substring(1))

   private getFieldName = ( next:(name:string)=>void ) => 
      typeof this.fieldName === 'string' ? 
         next(this.fieldName):
         this.fieldName.forEach(next)
   
   private findOrSkip (next:(fieldName:string, files:UploadedFile | UploadedFile[])=>void) {
      this.getFieldName((name)=> {
         const files = this.req.files?.[name]
         if (files !== undefined) next(name, files)
      })
      return this
   }

   static finish() { 
      const msg = this.msg
      this.msg = []
      return msg
   }
}

export function getAllValidation(includeBodyValidatator:boolean, validatorFunc: FileValidatorFunc) {
   const validatorFile = (req:e.Request) => (field:string | string[]) => new FileValidate(req, field)
   return (req:e.Request) => {
      validatorFunc(validatorFile(req))
      const {type, data} = validatorHaveErr(req) as FileValidateResult
      const fileValidator = FileValidate.finish()
      
      if (type === 'Error' && includeBodyValidatator) 
         return warpAsError([...data, ...fileValidator])
      
      else if(fileValidator.length > 0)
         return warpAsError(fileValidator)
      
      return warpAsOk(req)
   }
}