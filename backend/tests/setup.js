import '../env.init.js'
import User from '../models/user.model.js'
import { constUserData } from './fixtures/user.fixture.js'

// should always be available during testing and should not change
export let constUser = await User.findByPk(constUserData.id)
if (!constUser) constUser = await User.create(constUserData)