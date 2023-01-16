import React, { useEffect, useState } from "react";
import {Link, Navigate,} from 'react-router-dom';
import {Client, Server} from '../../shared/util';
import { autoResize, centerDiv, sendFile, waitOneSec } from "src/shared/func-support";
import Navbar from "../mini-component/NavBar";
import ReadFile from "../mini-component/ReadFile";
import Loading from "../mini-component/Loading";
import Danger from "../mini-component/Danger";

type Datas<T, E> = 
   { 
      name: string
      img?: T
      decstript?: string
      maximumMember: E
   }

export default ()=>{
      const init = {maximumMember:50, name:""}
      const [form, setForm]  = useState<Datas<FileList, number>>(init)
      const [err, setErr] = useState<Omit<Datas<string, string>, "maximumMember">>(init) 
      const [success, setSuccess] = useState<string|null>()
      const [imgIncShow, setImgIncShow] = useState<boolean>(false)
      const btnStyle= "px-3 py-1 text-white rounded-md"
      const imgExtists = form?.img && form!.img.length > 0 
      
      const reset = () => {
         setForm(init)
         setErr(init)
      }

      const loadingElemt = (display: "none" | "grid") => {
         const element = document.getElementById("loading")
         element!.style.display  = display
      }

      const send = ()=>{  
         sendFile<Omit<Datas<string, null>, "maximumMember">|null>(`${Server.URL}/create-class`, form)
            .then(({data})=>
               waitOneSec(()=>{
                  if (data) setErr({...data}) 
                  else setSuccess("Success")
                  loadingElemt('none')
               })
            )
      }

      return( 
         <>
            {/* Loading */}
            <div className={centerDiv + "absolute h-full w-full z-10 bg-white opacity-75 hidden"} id="loading">
               <Loading />
            </div>

            <Navbar extra=""/>

            <div className={centerDiv} id="test">
               <div className="w-3/4 relative rounded-b-lg">
                  <div className="border">
                     <p className="w-full border-b border-black p-2 text-xl font-bold">Create Class</p>
                     <div className="p-4">
                        {/* input img */}
                        <>
                           <p className="text-md font-semibold">Image :</p>
                           <label htmlFor="file-upload" > 
                              <div 
                                 className={
                                    centerDiv + 
                                    `relative w-full border-2 py-4 border-dashed cursor-pointer mt-1 
                                    ${imgExtists ? 'h-auto' :'h-60'}`
                                 }
                                 onMouseEnter={()=>setImgIncShow(true)}
                                 onMouseLeave={()=>setImgIncShow(false)}>
                                 {/* Add or chage indicator */}
                                 {imgIncShow && <div 
                                    className={`${centerDiv} absolute text-center w-full h-full bg-black opacity-25 z-10`} >
                                    <p className="text-xl font-medium text-white">+</p>
                                 </div>}

                                 {/* Img showing */}
                                 {imgExtists && <ReadFile file={form.img!}/>}
                              </div>
                           </label>
                           <Danger datas={err.img}/>
                           
                           <input 
                              type="file" 
                              id="file-upload" 
                              className="hidden" 
                              accept="image/
                              *"
                              onChange={(e)=>setForm({...form, img: e.target.files!})}/>
                        </>
                        {/* Input data */}
                        <div className="flex mt-3">
                           {/* Input name*/}
                           <div className="w-1/2 pr-2">
                              <p className="text-md font-semibold">Name Class :</p>
                              <input 
                                 className="border p-2 w-full mt-1 outline-1 outline-neutral-500"
                                 type="text" 
                                 value={form.name}
                                 onChange={(e)=>setForm({...form, name: e.target.value})}/>
                              <Danger datas={err.name}/>
                           </div>
                           {/* input max member */}
                           <div className="w-1/2">
                              <p className="text-md font-semibold">Maximum Member :</p>
                              <div className="flex">
                                 <input 
                                    className="border p-2 mt-1 outline-1 outline-neutral-500 w-[2.3rem]"
                                    type="number" 
                                    value={form.maximumMember}
                                    onChange={(e)=>{
                                       const input = parseInt(e.target.value)
                                       const getMax = input > 50 ? 50 : input < 2 ? 2 : input
                                       setForm({...form,maximumMember: getMax} )}
                                    } />
                                 <p className="my-auto ml-2">/ 50</p>
                              </div>
                              
                           </div>
                        </div>
                        {/* comment form */}
                        <div className="mt-3">
                           <p className="text-md font-semibold">Description :</p>
                           <textarea 
                              className="border rounded-sm h-[5rem] resize-none w-full p-2 overflow-hidden mt-1 focus:outline-1 focus:outline-neutral-500"
                              id="descript"
                              value={form.decstript}
                              onChange={(e)=>{
                                 setForm({...form, decstript: e.target.value})
                                 autoResize(document.getElementById('descript')!, "5rem")
                              }}/>
                        </div>

                        {/* Submit */}
                        <div className="flex mt-3">
                           <Link to="/" children="< Back" className={`bg-red-500 mr-3 ${btnStyle}`}/>
                           <div className="ml-auto">
                              <button className={`bg-yellow-400 ${btnStyle}`} onClick={reset}>Reset</button>
                              <button className={`bg-green-400 ${btnStyle} ml-3`} onClick={()=>{
                                 loadingElemt('grid')
                                 send()
                              }}
                              >Create</button>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </>
      )
}