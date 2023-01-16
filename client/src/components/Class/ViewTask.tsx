import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Db } from "src/shared/Db";
import {  getApi } from "src/shared/func-support";
import { Client, flexCenter } from "src/shared/util";
import Loading from "../mini-component/Loading";
import { RefreshContext } from "../App";


type Filter = 'all' | 'not-done' | 'done'
export default (props:{uuid:string, filtering: Filter})=>{
   const [ignored] = useContext(RefreshContext)!
   const [list, setList] = useState<Db.Task[]>()
   const [loading, setLoading] = useState<boolean>(true)

   useEffect(()=>{
      setLoading(true)
      getApi
         .get<Db.Task[]>(`class/${props.uuid}/task/all`)
         .then(({data})=>setList(data))
      setTimeout(()=>setLoading(false), 2000)
   }, [ignored, props.uuid])
      
   if(list && list.length === 0) {
      return <div className="h-1/3">
         <div className={`${flexCenter} flex-col h-full mt-16`}>
            <img src={`${Client.PUBLIC}/assets/paper.png`} alt="Empty image" className="w-32"/>
            <p className="font-semibold text-xl mt-2">No Task</p>
         </div>
      </div>
   }
   if (loading) {
      return <div className="h-1/3">
         <Loading/>
      </div>
   }
   return <div className="grid gap-y-2 mt-4 mx-2">
      {list && list.map((i, key)=>
         <Link
            to={`/class/${props.uuid}/task?id=${i.id}`} 
            key={key}
            className="shadow hover:shadow-black transition-shadow flex w-full">
               <img 
                  src={process.env.PUBLIC_URL + '/assets/logo192.png'} 
                  alt="task type" 
                  className="w-20 h-20 p-2 bg-slate-800" />
               <div className="flex justify-between w-full py-1 px-3 bg-gray-300">
                  <div className="w-3/4 break-words">
                     <h2 className="font-semibold">{i.name}</h2>
                     <p>{
                        !i.comment ? 
                           "No comment" : 
                        i.comment.length > 80 ? 
                           i.comment.slice(0, 79) + "...": 
                           i.comment
                        }</p>
                  </div>
                  <p className="font-medium">
                     <u>{`${i.createAt}`}</u>
                  </p>
               </div>
         </Link>
      )}
   </div>
}