import { genSaltSync, hashSync } from "bcrypt";

type Ok<T> = { type: "Ok"; data: T };
type Error<T> = { type: "Error"; data: T };
type TransformFunc<TCallBack, TResult> = (value: TCallBack) => TResult | Promise<TResult>;

export type Option<TResult, TError> = Ok<TResult> | Error<TError>;
export type Tuple<TFirst, TSecond> = [TFirst, TSecond];

export async function binding<T, E>(val: Ok<T>, nextFunc: TransformFunc<T, Option<T, E>>[]) {
   const bindingProsesing = await nextFunc.reduce<Promise<Option<T, E>>>(async (result, next) => {
      const previousVal = await result;
      if (previousVal.type == "Error") {
         return previousVal;
      }
      return await next(previousVal.data);
   }, Promise.resolve(val));

   return result<T, E>(bindingProsesing);
}

function result<T, E>(val: Option<T, E>) {
   return async <TSuccess, TFailed>(handler: { success: TransformFunc<T, TSuccess>; failed: TransformFunc<E, TFailed> }) => {
      if (val.type == "Ok") {
         return await handler.success(val.data);
      }
      return await handler.failed(val.data);
   };
}

export function hash(val: string) {
   const salt = genSaltSync(10);
   return hashSync(val, salt);
}

export const warpAsOk = <T>(val: T): Ok<T> => ({ type: "Ok", data: val });

export const warpAsError = <T>(val: T): Error<T> => ({ type: "Error", data: val });

export function eraser<T extends {}, K extends keyof T>(value: T, target: K){
   delete value[target]
   return value as Omit<T, K>
}
