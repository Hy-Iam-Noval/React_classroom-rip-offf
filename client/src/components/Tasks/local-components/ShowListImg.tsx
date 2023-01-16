import { Db } from "src/shared/Db";
import { centerDiv } from "src/shared/func-support";
import { Server } from "src/shared/util";
import ShowImg from "./ShowImg";

type Props = {img: string[]}

export default (props: Props) => {
   const moreThen4 = props.img.length > 4
   const sliceImg = moreThen4 ? 
      props.img.slice(0, 3)  : 
      props.img

   return (
      <div className="grid grid-cols-4 relative">
         {sliceImg.map(i=>
            <ShowImg img={i} style="w-6 h-6"/>
         )}
         {moreThen4 && 
            <div className={centerDiv + "absolute w-full h-full top-0 bg-black opticity-75"}>
               <p>+{props.img.length - 4}</p>
            </div>   
         }  
      </div>
   )
}