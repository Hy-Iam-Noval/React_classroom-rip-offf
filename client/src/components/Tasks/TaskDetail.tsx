import { useState } from "react";
import TaskCompleteView from "./local-components/TaskCompleteView";
import { Params, useParams } from "react-router-dom";
import { Db } from "src/shared/Db";
import { getApi, useQuery } from "src/shared/func-support";
import {  RemoveReadonly } from "src/shared/type";
import FormSenderTask from "./local-components/FormSenderTask";
import ShowImg from "./local-components/ShowImg";
import ShowListImg from "./local-components/ShowListImg";
import { flexCenter } from "src/shared/util";

type Props = { id: number; uuid: string};

function TaskDetail(props:Props) {
   const [task, setTask] = useState<Db.Task|null>()
   getApi
      .get<Db.Task|null>(`/class/${props.uuid}/task&id=${props.id}`)
      .then(({data})=>setTask(data))

   const img = task?.file && JSON.parse(task!.file) as string | string[]
   if(!task) 
      return (
         <div className={flexCenter + ' h-full flex-col'}>
            <img src="" alt="Not found task logo" />   
            <p className="text-lg mt-3 font-medium">Task not found</p>
         </div>
      )
   return (
      <div className="bg-[#f3f3f3] p-2">
         <h1 className="font-semibold text-xl border-b border-black pb-1">{task.name}</h1>
         {Array.isArray(img) && <ShowListImg img={img}/>}
         {img && <ShowImg img={img as string}/>}
         <p>{(task?.comment?.length || 0) > 35 ? 
               task!.comment!.slice(0,34) + "..." : 
               task?.comment}
         </p>
         <TaskCompleteView uuid={props.uuid} id={props.id}/>
      </div>
   )
}

export default () => {
   const {uuid} = useParams() as RemoveReadonly<Params<string>>
   return <TaskDetail 
      id={parseInt(useQuery().get('id')!)}
      uuid={uuid!}/>
}
