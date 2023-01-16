import {Router} from 'express'
import memberCtrl from '../Controllers/member'

const route = Router({mergeParams:true})

route.get('/', memberCtrl.View.all)
route.get('/detail', memberCtrl.View.detailMember)

route.delete('/exit', memberCtrl.Ctrl.exitFromClass)
route.delete('/kick', memberCtrl.Ctrl.kickUser)
route.post('/join', memberCtrl.Ctrl.join)

export default route