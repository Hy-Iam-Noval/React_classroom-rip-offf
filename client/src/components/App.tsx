import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import InfoClass from "./Class/InfoClass";
import Home from "./Home/Home";
import User from "./User/User";
import TaskDetail from "./Tasks/TaskDetail";
import CreateClass from "./Class/CreateClass";
import { useState, createContext, useReducer } from "react";
import { Db } from "src/shared/Db";
import { getApi } from "src/shared/func-support";
import { Server } from "src/shared/util";
import { Refresh, TErrContext } from "src/shared/type";

const homePage = (comp:React.ReactNode) => <Home>{comp}</Home>
export const RefreshContext = createContext<Refresh>(null)
export const ErrContext = createContext<TErrContext>(null)
export const AccountContext = createContext<Db.User|null>(null)

export const sessionkey = "sessionID"
export default function App() {
   const [user, setUser] = useState<Db.User|null>()
   const [state, dispatch] = useReducer((x)=>x+1, 0)
   const [err, setErr] = useState<string | null>()
   getApi
      .get<Db.User|null>(`${Server.URL}/account`)
      .then(i=>setUser(i.data))
   return (
      <BrowserRouter>
         <AccountContext.Provider value={user!}>
            <RefreshContext.Provider value={[state, dispatch]}>
               <ErrContext.Provider value={[err, setErr]}>
                  <Routes>
                     {user === null && 
                        <Route path="*" element={<User/>}/>}
                     {user && <>
                        <Route path="/" element={<Home/>} />
                        <Route path="/create-class" element={<CreateClass/>}/>
                        <Route path="/class/:uuid" element={homePage(<InfoClass/>)}/>
                        <Route path="/class/:uuid/task" element={homePage(<TaskDetail/>)}/>
                        <Route path="*" element={<>not found</>}/>
                     </>}
                  </Routes>
               </ErrContext.Provider>
            </RefreshContext.Provider>
         </AccountContext.Provider>
      </BrowserRouter>
   );
}