import { Router } from 'express'
import { auth } from '../../middleware/auth.js'
import {
  getEntries,
  createEntry,
  updateEntry,
  deleteEntry
} from './entries.controller.js'

const router = Router()

router.get('/', auth, getEntries)
router.post('/', auth, createEntry)
router.put('/:id', auth, updateEntry)
router.delete('/:id', auth, deleteEntry)

export default router