import { uniqueId } from 'lodash'

export const getNextId = () => Number(uniqueId())

export const getNextStrId = () => String(uniqueId())
