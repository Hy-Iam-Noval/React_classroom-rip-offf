import {Router} from 'express'
import classCtrl from '../Controllers/class'

const router = Router({mergeParams:true})

router.get('/', classCtrl.View.infoClass)
router.get('/list', classCtrl.View.listClass)
router.get('/update', classCtrl.Ctrl.update)

export default router