import {Router} from 'express';
import completeCtrl from '../Controllers/task-complete';

const _complete = Router({mergeParams:true})

_complete
   .get('/', completeCtrl.View.get)
   .post('/', completeCtrl.Ctrl.taskDone)

export default _complete