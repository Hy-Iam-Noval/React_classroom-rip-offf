import { centerDiv } from "src/shared/func-support"
import { Client } from "src/shared/util"

export default (props:{id?:string}) => 
   <div className={centerDiv + " w-full h-full"} id={props.id}>
      <img src={Client.loading} alt="Loading..." className="w-[5rem]"/>
   </div>