import { centerDiv } from "src/shared/func-support";
import { Client } from "src/shared/util";

/**
 * @msg Massage will be show in view
 * @height Height div
 */
export default (arg: { msg:string, height?:string } ) => (
   <div style={{height: arg.height ?? "35rem" }} className={centerDiv}>
      <div className='text-center'>
         <img src={`${Client.PUBLIC}/assets/paper.png`} alt="empty logo" className="w-80 h-auto"/>
         <p className="text-xl mt-3 font-semibold">{ arg.msg }</p>
      </div>
   </div>
)