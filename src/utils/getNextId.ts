import { uniqueId } from 'lodash'

export const getNextId = () => Date.now()

export const getNextStrId = () => Date.now().toString()
