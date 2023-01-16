import React, { FormEvent, useContext, useEffect, useState } from "react";
import { Db } from "src/shared/Db";
import { flashMsg, getApi, getFlash, sendJson } from "src/shared/func-support";
import { Client } from "src/shared/util";
import { Link } from "react-router-dom";
import { AccountContext, ErrContext } from "../App";
import { RefreshContext } from "../App";

export function joinElemnt(show: boolean){
   const element = document.getElementById("join-form")
   element!.style.top = show ? "5rem" : "-5rem"
}

function logout() {
   getApi
      .delete('/logout')
      .then(()=>{
         window.location.href = "/"
      })
}

const flashElemt = (show:boolean) => {
   const elem = document.getElementById("flash-container")
   elem!.style.top = show ? "2.5rem" : "-10rem"
}

export default (props:{extra?:string}) => {
   const user = useContext(AccountContext)

   const [form, setForm] = useState('')
   const [err, setErr] = useState<string>()
   const [succcess, setSucccess] = useState<string | null>()
   const [flash, reset] = useContext(ErrContext)!
   const [_, refresh] = useContext(RefreshContext)!

   // Style
   const errorBorder = "border-red-600 outline-red-600 placeholder-red-400"

   // Func
   const join = (event:FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      sendJson<string | null>(`/class/${form}/member/join`, {})
         .then(({data})=>{
            if(data === null) {
               setForm('')
               setSucccess(data)
               setTimeout(() => setSucccess(undefined),3000);
            }
            else  {
               setErr(data) 
            }
            refresh()
         })
   }

   useEffect(()=>{
      flash && flashElemt(true)
   }, [flash])

   return (
      <>
         {/* Msg */}
         {flash && 
            <div 
               className="fixed w-[40vw] top-[-10rem] left-1/2 z-10 -translate-x-1/2 text-xl transition-all duration-500" 
               id="flash-container">
               <div className={`flex text-white bg-[#ff2929] p-2 rounded-t-md font-semibold`}>
                  <span className="ml-1"><i className="bi bi-exclamation-triangle"></i></span>
                  <p className="ml-2">Massage :</p>
                  <button 
                     className="font-semibold ml-auto mr-2" 
                     onClick={()=>{
                        flashElemt(false)  
                        setTimeout(()=>reset(undefined), 1000)
                     }}>
                     <i className="bi bi-x-circle text-white"></i>
                  </button>
               </div>
               <div className="rounded-b-md bg-white border">
                  <p className="text-lg p-3">{flash}</p>
               </div>
            </div>
         } 

         {/* Join form */}
         <div className="px-3 z-10 py-2 bg-white fixed right-1/2 -top-20 translate-x-1/2 border rounded-lg transition-all duration-500" id="join-form">
            <form onSubmit={join} className="flex">
               <button 
                  className="absolute right-0 top-0 translate-x-2/4 -translate-y-1/2 px-2 rounded-full bg-red-500 hover:bg-red-700 text-white"
                  type="button"
                  onClick={()=>joinElemnt(false)}
                  >X</button>
               <input 
                  type="text" 
                  onChange={(e)=>setForm(e.target.value)} 
                  className={`${err ? errorBorder : ''} text-base border py-2 px-2 w-96`} 
                  placeholder={err ?? "ID Class"}/>
               <button className="bg-[#3fe975] px-3 text-white font-semibold ml-1">
                  {!!succcess ? "Success" : "Join"}
               </button>
            </form>
         </div>

         {/* Menu */}
         <div className={"p-2 bg-green-400 shadow-sm font-medium " + props.extra} id="navbar">
            <menu className="flex text-center text-md">
               <div className="flex ml-2">
                  <img src={`${Client.PUBLIC}/assets/test.png`} alt="Photo provile" className="w-9 h-9 rounded-full bg-white p-1" />
                  <p className="my-auto ml-3 text-xl font-medium text-white">{user?.name}</p>
               </div>
               
               {/* Menu Bar*/}
               <div className="my-auto ml-auto mr-2 flex text-lg">
                  <Link to="/create-class" className="flex p-1 mr-2 text-white hover:opacity-75">
                     <i className="bi bi-plus-square-fill"/>
                     <p className="ml-2">Create</p>
                  </Link>

                  <button className="flex p-1 text-white mr-4  hover:opacity-75" onClick={()=>joinElemnt(true)}>
                     <i className="bi bi-box-arrow-in-down"/>
                     <p className="ml-2">Join</p>
                  </button>
                  <button className="p-1 text-[#ff0000] flex hover:text-red-400" onClick={()=>logout()}>
                     <i className="bi bi-box-arrow-right mr-1"></i>
                     <p>Logout</p>
                  </button>
               </div>
               {/* end */}
            </menu>
         </div>

      </>
   )
}