import { Router } from 'express'
import { auth } from '../../middleware/auth.js'
import {
  getGoals,
  createGoal,
  deleteGoal
} from './goals.controller.js'

const router = Router()

router.get('/', auth, getGoals)
router.post('/', auth, createGoal)
router.delete('/:id', auth, deleteGoal)

export default router