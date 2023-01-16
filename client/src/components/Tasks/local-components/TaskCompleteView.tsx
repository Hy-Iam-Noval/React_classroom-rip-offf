import React from "react";
import Empty from "src/components/mini-component/Empty";

import { Db } from "src/shared/Db";
import { Client, Server } from "src/shared/util";
import { centerDiv, getApi } from "src/shared/func-support";
import FormSenderTask from "./FormSenderTask";

type Props = {uuid:string, id:number}
type Complete = Db.TaskCompletes;
type Users = Db.User[]

type CompleteState = {complete: Complete | Complete[]}
type MemberState = {members: Users}


export default class TaskCompleteView extends React.Component {
   props: Readonly<Props>
   state: Readonly<CompleteState & MemberState>

   constructor(props: Props) {
      super(props)
      this.props = props
      this.state = {complete: [], members: []}
   }

   async componentDidMount() {
      const task = (await getApi.get<Complete | Complete[]>(`/class/${this.props.uuid}/task-complete?id=${this.props.id}`)).data
      if(Array.isArray(task)) {
         const members = (await getApi.get<Users>(`/class/${this.props.uuid}/member`)).data
         this.updateState({members})
      }
      this.updateState({complete: task})
   }

   updateState = (props:CompleteState | MemberState)=>this.setState(props)

   render(): React.ReactNode {
      const {state,props} = this
      const spareTask = () => {
         const task = state.complete as Complete[]
         const userId = task.map(i=>i.userId) // TODO: get user id from task
         return state.members.reduce<[Db.User[], Db.User[]]>(([done, notDone], i)=>
            i.id in userId ?
               [[...done, i], notDone] : 
               [done, [...notDone, i]] 
         ,[[], []])
      }
      const view = () =>{
         const isArray = Array.isArray(state)
         if(isArray && state.length > 0) {
            const [userDoneTask, userNotDoneTask] = spareTask()
            return <>
               <p className="font-semibold">Done</p>
               {userDoneTask.map(i=>
                  <div className="mt-2 rounded-sm border p-2 flex">
                     <img src={``} alt="user profile photo" className="w-5 h-5"/>
                     <p className="font-semibold">{i.name}</p>
                  </div>
               )}
               <p className="font-semibold">Not Done</p>
               {userNotDoneTask.map(i=>
                  <div className="mt-2 rounded-sm border p-2 flex">
                     <img src={``} alt="user profile photo" className="w-5 h-5"/>
                     <p className="font-semibold">{i.name}</p>
                  </div>
               )}
            </>
         }
         else if (isArray && state.length === 0) {
            return <>Empty</>
         }
         else if (state) {
            return <>Some Value</>
         }
         return <FormSenderTask id={props.id} uuid={props.uuid}/>
      }

      return <div className={centerDiv}>
         <div className="w-3/4">
            {view()}
         </div>
      </div>
   }
}