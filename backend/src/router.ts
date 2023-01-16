import { Router } from "express"

import userCtrl from './Controllers/user'
import classCtrl from './Controllers/class'

import _class from './Routes/class-router'
import _task from './Routes/task-router'
import _member from './Routes/member-router'
import _complete from "./Routes/task-complete-router"

import { LocalSession } from "./MIddleware/LocalSession"
import { createClassValidator, registerValidator } from "./Supports/validator"

const route = Router()
const routeClass = (url:string, routes:Router) => route.use(`/class/:uuid/${url}`, routes)

route.get('/', classCtrl.View.listClass)
route.get('/account', userCtrl.Ctrl.infoUser)
route.delete('/logout', (_, res)=>{
   LocalSession.end()
   res.end()
})

route.post('/login', userCtrl.Ctrl.login)
route.post('/register', registerValidator(),userCtrl.Ctrl.register)
route.post('/create-class',createClassValidator(), classCtrl.Ctrl.createClass)


routeClass('', _class)
routeClass('task', _task)
routeClass('member', _member)
routeClass('task-complete', _complete)

export default route