import { Db } from "src/shared/Db";
import { Server } from "src/shared/util";

type Props = {img: string, style?:string}

export default (props:Props)=> {
   return (
      <img 
         src={`${Server.PUBLIC}/task-complete/${props.img}`} 
         alt="Task image" 
         className={`${props.style || "w-10 h-10"} object-contain`}/>
   )
}