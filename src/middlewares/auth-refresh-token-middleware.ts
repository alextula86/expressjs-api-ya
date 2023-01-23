import { NextFunction, Request, Response } from 'express'
import * as dotenv from 'dotenv'
dotenv.config()
import { userService, authService, deviceService } from '../services'
import { HTTPStatuses } from '../types'

export const authRefreshTokenMiddleware = async (req: Request & any, res: Response, next: NextFunction) => {
  if (!req.cookies.refreshToken) {
    return res.status(HTTPStatuses.UNAUTHORIZED401).send()
  }

  // Верифицируем refresh токен и получаем идентификатор пользователя
  const refreshTokenData = await authService.checkRefreshToken(req.cookies.refreshToken)

  res.send('refreshTokenData ' + JSON.stringify(refreshTokenData))

  // Если идентификатор пользователя не определен, возвращаем статус 401
  if (!refreshTokenData) {
    return res.status(HTTPStatuses.UNAUTHORIZED401).send()
  }

  req.user = await userService.findUserById(refreshTokenData.userId) 
  req.device = await deviceService.findDeviceById(refreshTokenData.deviceId) 

  next()
}

/*
  > Homework 9  Devices  GET -> "/security/devices": login user 4 times from different browsers, then get device list; status 200; content: device list;  used additional methods: POST => /auth/login;



    Expected: ArrayContaining [{"deviceId": Any<String>, "ip": Any<String>, "lastActiveDate": StringMatching /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/, "title": Any<String>}]

    Received: "req.cookies.refreshToken eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxNjc0NDc2MjgyNzM3IiwiZGV2aWNlSWQiOiIxNjc0NDc2Mjk0MTk4IiwiaWF0IjoxNjc0NDc2Mjk0LCJleHAiOjE2NzQ0NzYzMTR9.7Yg89TwcJEq-q8mEqudW4fKBBpdRTPbU8zNbWeIFw5I"

    Wrong entity: "req.cookies.refreshToken eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxNjc0NDc2MjgyNzM3IiwiZGV2aWNlSWQiOiIxNjc0NDc2Mjk0MTk4IiwiaWF0IjoxNjc0NDc2Mjk0LCJleHAiOjE2NzQ0NzYzMTR9.7Yg89TwcJEq-q8mEqudW4fKBBpdRTPbU8zNbWeIFw5I"

      144 |
      145 |       expect(status).toBe(200);
    > 146 |       expect(devicesList).toBeStrictObjectsArray(securityDeviceSchema);
          |                           ^
      147 |
      148 |       expect(devicesList).toHaveLength(4);
      149 |       expect(devicesList).toStrictEqual(

      at Object.<anonymous> (src/tests/jest/back/describes/devices/devices-describe.ts:146:27)

  > Homework 9  Devices  DELETE -> "/security/devices/:deviceId": should return error if :id from uri param not found; status 404;  

    expect(received).not.toBeUndefined()

    Received: undefined

      74 |   getRefreshToken: (): string => {
      75 |     const refreshToken = expect.getState().refreshToken;
    > 76 |     expect(refreshToken).not.toBeUndefined();
         |                              ^
      77 |
      78 |     return refreshToken;
      79 |   },

      at Object.getRefreshToken (src/tests/jest/jestHelpers/jestState/usersState.ts:76:30)
      at Object.<anonymous> (src/tests/jest/back/describes/devices/devices-describe.ts:186:49)

  > Homework 9  Devices  GET -> "/security/devices", DELETE -> "/security/devices/:deviceId", DELETE -> "security/devices": should return error if auth credentials is incorrect; status 401;  

    expect(received).not.toBeUndefined()

    Received: undefined

      74 |   getRefreshToken: (): string => {
      75 |     const refreshToken = expect.getState().refreshToken;
    > 76 |     expect(refreshToken).not.toBeUndefined();
         |                              ^
      77 |
      78 |     return refreshToken;
      79 |   },

      at Object.getRefreshToken (src/tests/jest/jestHelpers/jestState/usersState.ts:76:30)
      at Object.<anonymous> (src/tests/jest/back/describes/devices/devices-describe.ts:216:49)

  > Homework 9  Devices  DELETE -> "/security/devices/:sessionId": should return error if access denied; status 403;  used additional methods: GET -> /security/devices, POST -> /users;

    expect(received).not.toBeUndefined()

    Received: undefined

      74 |   getRefreshToken: (): string => {
      75 |     const refreshToken = expect.getState().refreshToken;
    > 76 |     expect(refreshToken).not.toBeUndefined();
         |                              ^
      77 |
      78 |     return refreshToken;
      79 |   },

      at Object.getRefreshToken (src/tests/jest/jestHelpers/jestState/usersState.ts:76:30)
      at Object.<anonymous> (src/tests/jest/back/describes/devices/devices-describe.ts:258:49)

  > Homework 9  Devices  POST -> "/auth/refresh-token": should return new 'refresh' and 'access' tokens; status 200; content: new JWT 'access' token, new JWT 'refresh' token in cookie (http only, secure);  

    expect(received).not.toBeUndefined()

    Received: undefined

      74 |   getRefreshToken: (): string => {
      75 |     const refreshToken = expect.getState().refreshToken;
    > 76 |     expect(refreshToken).not.toBeUndefined();
         |                              ^
      77 |
      78 |     return refreshToken;
      79 |   },

      at Object.getRefreshToken (src/tests/jest/jestHelpers/jestState/usersState.ts:76:30)
      at Object.<anonymous> (src/tests/jest/back/describes/refreshToken/refreshToken-describe.ts:137:40)

  > Homework 9  Devices  GET -> "/security/devices": should not change device id after call /auth/refresh-token. LastActiveDate should be changed; status 200; content: device list;  

    expect(received).not.toBeUndefined()

    Received: undefined

      74 |   getRefreshToken: (): string => {
      75 |     const refreshToken = expect.getState().refreshToken;
    > 76 |     expect(refreshToken).not.toBeUndefined();
         |                              ^
      77 |
      78 |     return refreshToken;
      79 |   },

      at Object.getRefreshToken (src/tests/jest/jestHelpers/jestState/usersState.ts:76:30)
      at Object.<anonymous> (src/tests/jest/back/describes/devices/devices-describe.ts:307:49)

  > Homework 9  Devices  DELETE -> "/security/devices/deviceId": should delete device from device list by deviceId; status 204;  used additional methods: GET => /security/devices;

    expect(received).not.toBeUndefined()

    Received: undefined

      74 |   getRefreshToken: (): string => {
      75 |     const refreshToken = expect.getState().refreshToken;
    > 76 |     expect(refreshToken).not.toBeUndefined();
         |                              ^
      77 |
      78 |     return refreshToken;
      79 |   },

      at Object.getRefreshToken (src/tests/jest/jestHelpers/jestState/usersState.ts:76:30)
      at Object.<anonymous> (src/tests/jest/back/describes/devices/devices-describe.ts:343:49)

  > Homework 9  Devices  GET -> "/security/devices": should return device list without a device logged out; status 204;  used additional methods: POST => /auth/logout;

    expect(received).not.toBeUndefined()

    Received: undefined

      74 |   getRefreshToken: (): string => {
      75 |     const refreshToken = expect.getState().refreshToken;
    > 76 |     expect(refreshToken).not.toBeUndefined();
         |                              ^
      77 |
      78 |     return refreshToken;
      79 |   },

      at Object.getRefreshToken (src/tests/jest/jestHelpers/jestState/usersState.ts:76:30)
      at Object.<anonymous> (src/tests/jest/back/describes/devices/devices-describe.ts:384:49)

  > Homework 9  Devices  DELETE -> "/security/devices": should delete all other devices from device list; status 204;  used additional methods: GET => /security/devices;

    expect(received).not.toBeUndefined()

    Received: undefined

      74 |   getRefreshToken: (): string => {
      75 |     const refreshToken = expect.getState().refreshToken;
    > 76 |     expect(refreshToken).not.toBeUndefined();
         |                              ^
      77 |
      78 |     return refreshToken;
      79 |   },

      at Object.getRefreshToken (src/tests/jest/jestHelpers/jestState/usersState.ts:76:30)
      at Object.<anonymous> (src/tests/jest/back/describes/devices/devices-describe.ts:423:49)

*/