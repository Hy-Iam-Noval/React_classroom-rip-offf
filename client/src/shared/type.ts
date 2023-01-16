
import {Db} from './Db'
import React from "react";

export type Dictionary = {[key:string]:string}
export type Refresh = [any, React.DispatchWithoutAction] | null
export type TErrContext = [string | undefined | null, React.Dispatch<React.SetStateAction<string | undefined | null>>] | null 

export type APIResport<T, E> = 
   | { type: "Ok"; data: T } 
   | { type: "Error"; data: E }

export type Submit = React.FormEvent<HTMLFormElement>;

export type OnClick = React.MouseEvent<HTMLButtonElement, MouseEvent>;

export type UseStateFunc<T> = React.Dispatch<React.SetStateAction<T>>

export namespace Class {
   type FormClassError = { name?: string; img?: string };

   export type ShowRes = Promise<Db.Classes & { members: Db.Member[]; task: Db.Task[] }>;
   export type InfoClassRes = Db.Classes;
   export type CreateRes = APIResport<string, FormClassError>;
}

export type CreateTaskRes = APIResport<string, string>;
export type FailOrSuccess<T, E, Output> = { success: (val: T) => Output; failed: (err: E) => Output };

export type RemoveReadonly<T> = 
   { -readonly [P in keyof T] : T[P] }

export type IsAdmin = {admin: boolean}