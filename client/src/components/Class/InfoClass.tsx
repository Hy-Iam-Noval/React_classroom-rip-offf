import React, { useContext, useEffect, useReducer, useState } from "react"
import { Db } from "src/shared/Db"
import { centerDiv, flashMsg, getApi, getFlash, waitOneSec } from "src/shared/func-support";
import { useParams} from 'react-router-dom'
import ViewTask from "./ViewTask"
import CreateTask from "../Tasks/CreateTask";
import { AccountContext, ErrContext } from "../App";
import { Client, Server, flexCenter } from ".././../shared/util";
import { APIResport } from "src/shared/type";
import Loading from "../mini-component/Loading";
import { RefreshContext } from "../App";

type ClassDatas = Db.Classes & {members: Db.Member[], admin: Db.User}
type PathernUrl = 'all' | 'done' | 'not-done'

function showMenu () {
   const element = document.getElementById('filtering-task')
   element!.style.display = (element!.style.display === 'block' ? 'none' : 'block')
}

function showForm(show: boolean){
   document.body!.style.overflow = show ? "hidden" : "visible"
   document.getElementById('create-task-form')!.style.display = show ? 'block' : 'none'
}



export default function InfoClass() {
   const user = useContext(AccountContext) as Db.User
   const uuid = useParams().uuid!

   const [respost, setRespost] = useContext(ErrContext)!
   const [datas, setDatas] = useState<ClassDatas|null>()
   const [filter, setFilter] = useState<PathernUrl>('all')
   const [loading, setLoading] = useState<boolean>(true)
   const [ignored, trigeredFunc] = useContext(RefreshContext)!

   const filterBoxTitle = filter.charAt(0).toUpperCase() + filter.substring(1)

   const exitClass = (uuid:string)=> {
      setLoading(true)
      getApi
         .delete<string|null>(`class/${uuid}/member/exit`)
         .then(({data})=>{
            !!data && setRespost(data)
            trigeredFunc()
         })
   }

   useEffect(() => {
      setLoading(true)
      getApi
         .get<ClassDatas>(`/class/${uuid}/`)
         .then(({data})=>{
            setDatas(data)
            setTimeout(()=>setLoading(false),1000)
         })
      waitOneSec(()=>setLoading(true))
   }, [ignored, uuid])
   
   // after exit class
   if(datas === null && respost === null) return (
      <div className={flexCenter + ' flex-col h-full'}>
         Exit completed
      </div>
   )

   // class not found
   if(datas === null) return (
      <div className={flexCenter + ' flex-col h-full'}>
         <img src="" alt="Class not found" />     
         <p className="text-xl text-center">
            Class with uuid :<br />
            <strong>{uuid}</strong><br /> 
            not found
         </p>
      </div>
   )
   
   // loading
   if (loading) return (
      <Loading /> 
   )
  
   // main comp
   return (
      <>
      <div className="relative h-full">
         {/* Img provile */}
         <div className={centerDiv + "bg-[#dcdcdc]"}>
            <img 
               src={`${Server.PUBLIC}/classes/${datas?.img ? JSON.parse(datas!.img) : 'default.png'}`}
               alt="Provile Photo Class"
               className="w-auto max-h-[40vh] min-h-[30vh]"/>
         </div>

         <div className="flex shadow p-3" >
            {/* Class info */}
            <div>
               <h1 className="text-xl font-semibold">{datas!.name}</h1>
               <div className="flex text-base">
                  <img src={`${process.env.PUBLIC_URL}/assets/people-fill.svg`} alt="" />
                  <p className="ml-2">{`${datas!.members!.length}/${datas!.maximumMember}`}</p>
                  <p>{datas!.decstript}</p>
               </div>
            </div>

            <div className="ml-auto mb-auto">
               {/* Copy uuid */}
               <button 
                  className="px-1 rounded border mr-3"
                  onClick={()=>{
                     navigator.clipboard.writeText(datas!.uuid)
                     alert("Copyed")
                  }}>
                  <i className="bi bi-paperclip"></i>
               </button>

               {/* Exit btn */}
               <button 
                  className="px-2 rounded bg-red-500 text-white" 
                  onClick={()=> exitClass(uuid)}>Exit</button>
            </div>

         </div>

         {/* Extra */}
         <div className={centerDiv}>
            <div className="w-full mt-4 flex justify-end relative mr-3">
               <div className="flex">
                  {/* Create task btn */}
                  {datas!.admin?.id === user.id &&
                     <button
                        onClick={()=>showForm(true)}
                        className="py-1 px-3 bg-slate-300 rounded-md mr-3"
                        >Create Task</button> 
                  }
                     
                  {/* Filter btn */}
                  <button 
                     onClick={()=>showMenu()}
                     className="py-1 px-3 bg-slate-300 rounded-md"
                  >{filterBoxTitle}</button>
               </div>

               {/* Filtering */}
               <div 
                  onMouseLeave={()=>showMenu()}
                  className="absolute top-10 hidden bg-gray-200 rounded-md text-left w-52" 
                  id="filtering-task">
                  <button 
                     onClick={()=>setFilter('all')}
                     className="border-b-2 border-white w-full text-left hover:text-white px-4 py-1"
                  >Show All Task</button>

                  <button 
                     onClick={()=>setFilter('done')}
                     className="border-b-2 border-white mt-1 w-full text-left hover:text-white px-4 py-1"
                  >Show Task Done</button>

                  <button 
                     onClick={()=>setFilter('not-done')}
                     className="mt-1 w-full text-left hover:text-white px-4 py-1"
                  >Show Task Not Done</button>
               </div>
            </div>               
         </div>
      
         {/* Form create task */}
         <div className="w-full h-full absolute hidden top-0 bg-black bg-opacity-60" id="create-task-form">
            <div className="flex flex-col" >
               <button 
                  className="text-white ml-auto p-4 text-xl cursor-pointer hover:text-gray-300"
                  onClick={()=>showForm(false)}>X</button>
               <CreateTask classId={datas!.id}/>
            </div>
         </div>

         {/* List task */}
         <ViewTask uuid={uuid} filtering={filter} />

      </div>
      </>
   )
} 
