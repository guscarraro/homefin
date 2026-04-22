import { Router } from 'express'
import { auth } from '../../middleware/auth.js'
import {
  getSalaries,
  saveSalary
} from './salaries.controller.js'

const router = Router()

router.get('/', auth, getSalaries)
router.post('/', auth, saveSalary)

export default router