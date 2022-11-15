import { uniqueId } from 'lodash'

export const getNextId = () => Number(uniqueId())
