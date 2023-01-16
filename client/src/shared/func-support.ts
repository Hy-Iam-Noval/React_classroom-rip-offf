import axios from 'axios'
import React from 'react';
import { useLocation } from 'react-router-dom';
import { sessionkey } from 'src/components/App';
import {APIResport, FailOrSuccess} from './type'
import { flashKey, ServerUrl } from './util';

export const getApi = axios.create({ baseURL: ServerUrl });
export const centerDiv = "grid place-items-center "
export const PUBLIC_ASSETS = process.env.PUBLIC_URL + '/assets/'
const CONTENT_TYPE_JSON = { headers: { "Content-Type": "application/json" } };
const MULTIPART_FORM_DATA = { headers: { "Content-Type": "multipart/form-data" } };

function fondation<T, E>(val: APIResport<T, E>) {
   return <Output>(handle: FailOrSuccess<T, E, Output>) => (val.type === "Ok" ? handle.success(val.data) : handle.failed(val.data));
}

export function binding<T, E>(value: APIResport<T, E>, handeler: FailOrSuccess<T, E, void>) {
   const next = fondation(value);
   return next<void>(handeler);
}

function sendPostFondation<Output, T>(url: string, datas: T, headers: object) {
   return getApi.post<Output>(url, datas, headers);
}

export function sendJson<T>(url: string, datas: Object) {
   return sendPostFondation<T, string>(url, JSON.stringify(datas), CONTENT_TYPE_JSON);
}

export function sendFile<Out>(url: string, datas: object) {
   const formDatas = 
      Object.entries(datas).reduce((result, [key, value]) => {
         value instanceof FileList ? 
            Object.values(value).forEach(i=>result.append(key, i)) : 
            result.append(key, value)
            
         return result;
      }, new FormData());

   return sendPostFondation<Out, FormData>(url, formDatas, MULTIPART_FORM_DATA);
}

export function getNameAndSize(file: File) {
   return { name: file.name, size: file.size };
}

export function useQuery() {
   const {search} = useLocation()
   return React.useMemo(()=> new URLSearchParams(search), [search])
}

export function end<T>(arg: T[]): T {
   return arg.slice(-1)[0]
}

export function urlImg (path: string) { return `url(${path})` }

export function autoResize(elemet: HTMLElement, defaultHeight: string) {
   elemet!.style.height = defaultHeight
   elemet!.style.height = `${elemet.scrollHeight}px`
}

export const flashMsg =(msg:string) => {
   console.log(msg);
   
   localStorage.setItem(flashKey, msg)
}

export function getFlash (){
   const msg = localStorage.getItem(flashKey)
   localStorage.removeItem(flashKey)
   return msg
}

export function waitOneSec(next:()=>void) {
   setTimeout(() => {
      next()
   }, 1000);
}