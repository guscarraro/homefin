import { Router } from 'express'
import { auth } from '../../middleware/auth.js'
import {
  getFixedCosts,
  createFixedCost,
  updateFixedCost,
  deleteFixedCost
} from './fixedCosts.controller.js'

const router = Router()

router.get('/', auth, getFixedCosts)
router.post('/', auth, createFixedCost)
router.put('/:id', auth, updateFixedCost)
router.delete('/:id', auth, deleteFixedCost)

export default router