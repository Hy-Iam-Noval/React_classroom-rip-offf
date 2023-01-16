import e from "express";
import { body, check, ValidationError } from "express-validator";
import { init } from "../Model/BasicQuery/init";
import { validationResult } from "express-validator";
import { warpAsOk, warpAsError, hash } from "./support";
import fileUpload, { FileArray, UploadedFile } from "express-fileupload";

const required = "This field cant empty";

export function registerValidator() {
   const maxLengthMsg = "This field minimum 10 letter and maximum 60 letter";

   return [
      body(["name", "email", "password"]).notEmpty().withMessage(required), 
      body(["name", "password"]).isLength({ min: 10, max: 60 }).withMessage(maxLengthMsg), 
      body("name").custom(onlyAlphabet), 
      body("email").isEmail().withMessage("Email not valid").custom(emailNotExist), 
      body("password").isLength({ min: 10, max: 60 }).withMessage(maxLengthMsg).custom(passowrdSame).custom(noSymbol)
   ];
}

export function createClassValidator() {
   return [
      body("name")
         .notEmpty()
         .withMessage(required)
         .isLength({ min: 10, max: 60 })
         .withMessage("Name class must be greates than 10 and less than 60")
         .custom(noSymbol)
   ];
}

export function createTaskValidator() {
   return [body("name").notEmpty().withMessage(required)];
}

export function taskCmpltValidator() {
   return body('comment').custom(noSymbol).withMessage('Not allows symbol')
}

export function validatorHaveErr(req: e.Request) {
   const error = validationResult(req);
   if (error.isEmpty()) return warpAsOk(req);
   return warpAsError(error.array({onlyFirstError:true}));
}

export function getValidator<T extends { param: string; msg: string }>(error: T[]) {
   return error.reduce<{ [key: string]: string }>((previousValue, i) => {
      previousValue[i.param] = i.msg
      return previousValue;
   }, {});
}

async function emailNotExist(email: string) {
   return !(await init.user.getUser(email ?? "")) || Promise.reject("Email has already used");
}

function passowrdSame(pass: string, { req }: any) {
   return pass == req.body?.password2 || Promise.reject("Password not same");
}

function noSymbol(val: string) {
   return /[a-zA-Z0-9\s]/g.test(val) || Promise.reject("This field cant contains symbol")
}

function onlyAlphabet(input: string) {
   return !(/\d/g.test(input)) || Promise.reject("This field cant have number")
}
