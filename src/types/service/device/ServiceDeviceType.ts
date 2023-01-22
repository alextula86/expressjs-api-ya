import { DeviceViewModel } from '../../models'
import { CreaetDeviceService } from '../../service'
import { DeviceType } from '../../schema'

export type ServiceDeviceType = {
  findAllDevices: (userId: string) => Promise<DeviceViewModel[]>
  findDeviceById: (id: string) => Promise<DeviceType | null>
  createdDevice: ({ ip, title, userId }: CreaetDeviceService) => Promise<DeviceType>
  deleteAllDevices: (userId: string) => Promise<boolean>
  deleteDeviceById: (id: string) => Promise<boolean>
}
