import {Router} from 'express'
import { createTaskValidator, taskCmpltValidator } from '../Supports/validator'

import taskCtrl from '../Controllers/task'
import taskCmpltCtrl from '../Controllers/task-complete';


const router = Router({mergeParams:true})

router.route('/')
   .get(taskCtrl.View.detailTask)
   .post(taskCmpltValidator(), taskCmpltCtrl.Ctrl.taskDone)

router
   .get('/all',taskCtrl.View.allTask)
   
router
   .get('/done',taskCtrl.View.getTaskDone)
   
router
   .get("/not-done",taskCtrl.View.getTaskNotDone)

router
   .post('/create', createTaskValidator() ,taskCtrl.Ctrl.addTask)

router
   .delete('/delete', taskCtrl.Ctrl.deleteTask)

export default router