import React, { HtmlHTMLAttributes, TextareaHTMLAttributes } from "react";
import ReadFile from "src/components/mini-component/ReadFile";
import { autoResize, centerDiv, end, sendFile } from "src/shared/func-support"
import { Client, IMG } from "src/shared/util";
import { TextChangeRange } from "typescript";
import { fileURLToPath } from "url";

type UrlDatas = {id: number, uuid: string}

type DataSender<T> = Partial<{comment:string, file: T}>
type Datas = {data: DataSender<FileList>}
type Error = {error: DataSender<string>}
type SetState = 
   | Datas
   | Error

export default class  extends React.Component{
   state: Readonly<Datas & Error>;
   props: Readonly<UrlDatas>

   constructor(props: UrlDatas){
      super(props)
      this.state = {error:{}, data:{}}
      this.props = props

      this.updateState = this.updateState.bind(this)
      this.send = this.send.bind(this)

   }

   updateState = (props:SetState)=>this.setState({...props})

   changeImg(opacity: '1' | '0'){
      if(this.state.data?.file) 
         document.getElementById('change-img-button')!.style.opacity = opacity
   }

   showChageBtn= () => this.changeImg('1')
   
   hideChangeBtn = () => this.changeImg('0')

   
   async send(){
      const {id, uuid} = this.props
      const {data} = await sendFile<DataSender<string>>(`/class/${uuid}/task-complete&id=${id}`, this.state.data)
      this.setState({error: {...data}})
   }

   render(): React.ReactNode {
      const {error, data} = this.state
      const listName = data?.file ? 
         Object.values(data.file)
            .map(({name})=>name)
            .map(i=>{
               const extFile = end(i.split('.'))
               return i.length > 15 ? i.slice(0, 14) + '***.' +  extFile : i
            }) : 
         []
      
      return <div className="px-3 py-2 text-base">
         <p className="mb-2">Add Image</p>
         <label htmlFor="insert-file" className="cursor-pointer block">

         </label>

         <input 
            type="file"  
            id="insert-file"
            className="hidden"
            multiple
            onChange={(e)=> this.updateState({data: {...data, file: e.target.files!} })} 
         />
         <p className="text-red-600">{error.file}</p>
         
         <div className="mt-2">
            <p>Comment</p>
            <div className="bg-white px-2 py-1 border">
               <textarea 
                  onChange={(e)=>{ 
                     this.updateState({data: {...data, comment: e.target.value, }})
                     autoResize(document.getElementById('comment-form')!, '4rem')
                  }} 
                  id="comment-form"
                  rows={1}
                  className="outline-none resize-none w-full h-16" />
            </div>
            <p className="text-red-600">{error.comment}</p>
         </div>
      </div>
   }
}
