import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { autoResize, centerDiv, sendFile } from "src/shared/func-support";
import { Client } from "src/shared/util";
import { AccountContext } from "../App";
import Danger from "../mini-component/Danger";
import { RefreshContext } from "../App";

type Datas<T> = {comment?: string, file?: T, name: string, classId:number}
type Error = Partial<Datas<string>>
type Form = Datas<FileList>

export default (props:{classId:number}) => {
   const uuid = useParams().uuid!
   const [_, refresh] = useContext(RefreshContext)!
   const [form, setForm] = useState<Form>({classId: props.classId, name:''})
   const [error, setErr] = useState<Error>()
   const [loading, setLoading] = useState<boolean>(false)
   const [success, setSuccess] = useState<string>()

   
   const listName = form?.file ? 
      Object.values(form.file)
         .map(i=>i.name)
         .map(i=>{
            const ext = i.split('.').at(-1)
            return i.length > 19 ? `${i.slice(0, 19)}***.${ext}` : i
         }) : []
   const send = () => {
      setLoading(true)
      sendFile<null|Error>(`class/${uuid}/task/create`, form!)
         .then(({data})=>{
            setTimeout(()=>{
               if(!data) { 
                  setSuccess("Success")
                  refresh() 
               }
               else setErr(data)
               setLoading(false)
            }, 1000)
         })
   }
   const buttonStyle = "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
   const whenErr = "border-red-400 border-2"

   return <>
      <div className="mx-auto bg-white w-5/6 rounded-md">
         <p className="border-b-2 border-black p-2 text-xl font-300">Create Task</p>
         <div className="py-2 px-3 text-[1.1rem]">
            {/* Input Name */}
            <>
               <p>Name :</p>
                  <input 
                  type="text" 
                  className={`border outline-none px-2 py-1 w-full ${error?.name && whenErr}`}
                  onChange={(e)=>setForm({...form, name: e.target.value} )} />
               <Danger datas={error?.name}/>
            </>
      
            {/* Input File */}
            <div className="mt-4">
               <p>File: </p>
               <label htmlFor="file-input" className="block w-full cursor-pointer">
                  <div className="flex shadow" style={{minHeight: '3rem'}}>
                     {/* File */}
                     <div className={centerDiv + "w-[10%] text-lg font-semibold bg-gray-200"}>
                        {form?.file ? 
                           <div className={centerDiv}>
                              <img src={`${Client.PUBLIC}/assets/logo192.png`} className='w-8' />
                              <p className="absolute">{form.file.length}</p>
                           </div> : 
                           '+'
                        }
                     </div>
      
                     {/* List file name */}
                     <div className={centerDiv + 'justify-items-start w-full bg-white px-4 py-2'}>
                        {listName.map(i=>{
                           return <p><strong>- </strong>{i}</p>
                        })}
                     </div>
                  </div>
               </label>
               <p>{error?.file}</p>
      
               <input 
                  type="file" multiple 
                  id="file-input"
                  accept="image/*, .txt, video/*, .doc, .docx"
                  onChange={(e)=>setForm({...form, file: e.target.files!})} 
                  className="hidden"/>
            </div>
      
            {/* Input Comment */}
            <div className="mt-4">
               <p>Note :</p>
               <div className="py-1 px-2 border">
                  <textarea 
                     className="resize-none w-full h-[4rem] outline-none"
                     id="note-form"
                     onChange={(e)=>{
                        setForm( {...form,comment: e.target.value} )
                        autoResize(document.getElementById('note-form')!, '4rem')
                     }}
                  />
               </div>
               <p>{error?.comment}</p>
            </div>

            {/* Success msg*/}
      
            {/* Submit */}
            <div className="flex justify-end mt-2">
               {success && 
                  <p className="text-green-500 font-medium mr-3 my-auto">{success}</p>}
               <button 
                  className="relative w-20 h-9 rounded-md text-white font-semibold bg-emerald-500" 
                  disabled={loading}
                  onClick={send}>
                  {loading ? 
                     <img src={Client.loading} alt="Loadng..." className={buttonStyle + " h-5/6"} />: 
                     <p className={buttonStyle}>Create</p>}
               </button>
            </div>
         </div>
      
      </div>
      
   </>       
}  
