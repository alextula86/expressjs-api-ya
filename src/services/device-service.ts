import { deviceRepository } from '../repositories/device/device-db-repository'
import { DeviceType, ServiceDeviceType } from '../types'
import { getNextStrId } from '../utils'

export const deviceService: ServiceDeviceType = {
  async findAllDevices(userId) {
    const foundAllDevices = await deviceRepository.findAllDevices(userId)

    return foundAllDevices
  },
  async findDeviceById(id) {
    const foundDeviceById = await deviceRepository.findDeviceById(id)

    return foundDeviceById
  },  
  async createdDevice({ ip, title, userId }) {
    const newDevice: DeviceType = {
      id: getNextStrId(),
      ip,
      title,
      userId,
      lastActiveDate: new Date().toISOString(),
      active: true,
    }

    const createdDevice = await deviceRepository.createdDevice(newDevice)

    return createdDevice
  },
  async deleteAllDevices(userId) {
    const isDeleteAllDevices = await deviceRepository.deleteAllDevices(userId)

    return isDeleteAllDevices
  },
  async deleteDeviceById(id) {
    const isDeletedDeviceById = await deviceRepository.deleteDeviceById(id)

    return isDeletedDeviceById
  },
}
