import { Router } from "express"

const router = Router()

router.get('/non-operational-error', (req, res) => {throw new Error('Intentional Error')})

export default router