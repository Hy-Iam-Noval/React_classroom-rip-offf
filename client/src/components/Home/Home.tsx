import React, { useContext, useEffect } from "react"
import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import { Db } from "src/shared/Db"
import { centerDiv, getApi } from "src/shared/func-support"
import { Client, Server } from "src/shared/util"
import Navbar , { joinElemnt  } from "../mini-component/NavBar"
import Loading from "../mini-component/Loading"
import { RefreshContext } from "../App"

type ListClass = Array<Db.Classes & {admin:Db.User}>


export default (props:{children?: React.ReactNode}) => {
   const location = useParams().uuid
   const [ignored] = useContext(RefreshContext)!
   const [listClass, setListClass] = useState<ListClass>()
   const [loading, setLoading] = useState<boolean>(true)

   useEffect(() => {
      getApi.get<ListClass>('/').then(({data})=>{
         setListClass(data)
         setLoading(false)
      })
   }, [ignored])
   
   return (
      <>
         <Navbar />         
         <div className={centerDiv}>
            <div className={`flex w-[75%] h-screen`}>
               <div className="p-2 w-[40%] border overflow-auto scroll-hide">
                  { (listClass && listClass.length > 0) && listClass.map(({uuid, name, admin, img}, key)=>
                     <Link className={(location === uuid && "ml-2") + " flex mb-2"} to={`/class/${uuid}`} key={key} >
                        <img src={`${Server.PUBLIC}/classes/${img ? JSON.parse(img) :  "default.png"}`} alt="Class profile" className="w-[3rem] h-[3rem] object-cover rounded-md border"/>
                        <div className="my-auto ml-3 border-b text-[0.9rem] border-black">
                           <h1 className="font-semibold">{name.length > 15 ? name.slice(0, 14)+ '...': name}</h1>
                           <p>{admin.name.length > 15 ? admin.name.slice(0, 14) + '...': admin.name}</p>
                        </div>
                     </Link>
                  ) }
                  {  (listClass && listClass.length === 0) &&
                     <div className={centerDiv}>
                        <div className={centerDiv}>
                           <button title="Add class" onClick={()=>joinElemnt(true)}>
                              <i className="bi bi-plus-circle text-[3rem] rounded-full"></i>
                           </button>
                           <p className="mt-2 text-xl font-semibold">Add class</p>
                        </div>
                     </div>
                  }
               </div>
               <div className="w-full border h-screen overflow-auto">
                     {  
                        loading ? 
                           <Loading/> : 
                        props.children ?
                           props.children :
                           <div className={`flex flex-col items-center justify-center w-full h-full text-[1.5rem]`}>
                              <img src={`${Client.PUBLIC}/assets/paper.png`} alt="Empty logo" className="w-32"/>     
                              <p className="font-semibold mt-3">Nothing see here</p>
                           </div>
                     }
               </div>
            </div>
         </div>
      </>
   )
}