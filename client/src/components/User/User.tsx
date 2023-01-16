import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { centerDiv,  getApi,  sendJson } from "src/shared/func-support";
import { Db } from "src/shared/Db";
import { Client, Server, flexCenter } from "src/shared/util";

type Form<T> = Pick<Db.User, 'name'| 'email' | 'password'> & {img:T|null, password2:string}
type FormData = Form<File>;

export function logout() {
   getApi.get(`${Server.URL}/logout`).then(()=>window.location.href = "/")
}


export default () => {
   const init = {email:'', img:null, name:'', password:'', password2:''}
   

   const [form, setForm] = useState<FormData>(init)
   const [errLogin, setErrLogin] = useState<string>()
   const [errRegis, setErrRegis] = useState<Form<string>>()
   const [success, setSuccess] = useState<string>()
   const [method, setMethod] = useState<'Login'|'Register'>('Login')
   const [loading, setLoading] = useState<boolean>(false)

   const setLoadingWithTiming = (next:()=>void) => setTimeout(()=>{
      next()
      setLoading(false)
   }, 1000)
   
   const login = async() => {
      const {data} = await sendJson<string| null>(`${Server.URL}/login`, form)      
      data ?
         setLoadingWithTiming(()=>setErrLogin(data)) :
         window.location.href = "/"
   }
   
   const register = async() => {
      const {data} = await sendJson<Form<string>|string>(`${Server.URL}/register`, form)
      setLoadingWithTiming(()=>{
         if(typeof data === 'string'){
            switchMethod()
            setSuccess(data) 
         } 
         else {
            setErrRegis(data)
         }
      })
   }
   
   const flashMsg = () => {
      const box = "px-1 py-2 font-semibold text-center mb-3 text-white rounded"
      if (success) {
         return <div className={`${box} bg-[#45e545]`}>
            {success}
         </div>
      } 
      else if(errLogin) {
         return (
            <div className={`${box} bg-[#f75229]`}>
               {errLogin}
            </div>
         )
      }
   }

   const borderClass = (otherState:boolean) => 
      `w-full p-2 rounded-sm border outline-none ${(errLogin || otherState) && "border-red-400 border-2"}`

   const switchMethod = () => {
      setMethod(isRegister ? 'Login' : 'Register')
      setForm(init)
      setErrLogin(undefined)
      setErrRegis(undefined)
      setSuccess(undefined)
   }


   
   const isRegister = method === 'Register';
   return (
      <>
         <div className={`grid place-items-center h-screen`}>
            <div className="w-72 p-4 border-2 rounded-lg">
               {flashMsg()}

               {/* Form img */}
               {isRegister && <div className="mb-3 mt-2">
                  <div className={`${centerDiv}`}>
                     <label 
                        htmlFor="img" 
                        className={`
                           ${borderClass(!!errRegis?.img)} 
                           ${centerDiv} 
                           border-2 rounded-full w-40 h-40 font-bold text-3xl cursor-pointer`}
                        >+
                     </label>
                     </div>
                     <input
                        disabled={loading} 
                        type="file" 
                        id="img" 
                        className="hidden" 
                        onChange={ (e) => setForm({ ...form, img: e.target.files?.[0]!}) } />
                     <p className="text-red-600 text-sm">{errRegis?.img}</p>
               </div>}
      
               {/* Input name */}
               {isRegister && <div className="mb-3 relative">
                  <input
                     disabled={loading} 
                     type="text" 
                     placeholder="Your name" 
                     className={borderClass(!!errRegis?.name)}
                     value={form.name} 
                     onChange={ (e) => setForm({ ...form, name:e.target.value}) } />
                  <p className="text-red-600 text-sm">{errRegis?.name}</p>
               </div>}
   
               {/* Input email */}
               <div className="mb-3">
                  <input
                     disabled={loading} 
                     type="email" 
                     placeholder="Email" 
                     className={borderClass(!!errRegis?.email)}
                     value={form.email} 
                     onChange={ (e) => setForm({ ...form,email: e.target.value}) } />
                  <p className="text-red-600 text-sm">{errRegis?.email}</p>
               </div>
   
               {/* Input password */}
               <div className="mb-3">
                  <input
                     disabled={loading} 
                     type="password" 
                     placeholder="Password" 
                     className={borderClass(!!errRegis?.password)}
                     value={form.password} 
                     onChange={ (e) => setForm({...form,password: e.target.value}) }/>
                  <p className="text-red-600 text-sm">{errRegis?.password}</p>
               </div>
   
               {/* Input password2 */}
               {isRegister && <div className="mb-3">
                  <input
                     disabled={loading} 
                     type="password" 
                     placeholder="Confirm Password" 
                     className={borderClass(!!errRegis?.password)}
                     value={form.password2} 
                     onChange={ (e) => setForm({...form,password2: e.target.value}) } />
                  <p className="text-red-600 text-sm">{errRegis?.password}</p>
               </div>}

               {/* Button */}
               <div className="mt-3">
                  {/* Submit */}
                  <button 
                     disabled={loading}
                     className={`${centerDiv} ${loading ? "bg-blue-400" : "bg-blue-600"} w-full rounded-lg px-3 py-1 text-white`}
                     onClick={()=> {
                        setLoading(true)
                        isRegister ? register() : login()
                     } }
                     >{
                        loading ? 
                           <img src={`${Client.PUBLIC}/assets/loading.gif`} className="h-[1.5rem]"/>:
                           <p>{method}</p>
                     }</button>
                     
                  {/* Change method */}
                  <button 
                     disabled={loading}
                     className="text-blue-500 mt-2" 
                     type="button"
                     onClick={()=>switchMethod()}
                  ><u>{isRegister ? '< Back' : 'Create new account'}</u></button>
               </div>
            </div>
         </div>
      </>
   )
}
