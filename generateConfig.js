const fs = require('fs')
const path = require('path')
const registerAnonimous = require('./module/register_anonimous')
const request = require('./util/request')
const { cookieToJson, generateRandomChineseIP } = require('./util/index')
const { getXeapiPublicKey } = require('./util/xeapiKey')
const runtimeState = require('./util/runtime-state')
const tmpPath = require('os').tmpdir()

async function generateConfig() {
  global.cnIp = generateRandomChineseIP()
  let hasAnonymousToken = false
  try {
    const res = await registerAnonimous({}, request)
    const cookie = res.body.cookie
    if (cookie) {
      const cookieObj = cookieToJson(cookie)
      runtimeState.setAnonymousToken(cookieObj.MUSIC_A)
      hasAnonymousToken = !!cookieObj.MUSIC_A
      try {
        fs.writeFileSync(
          path.resolve(tmpPath, 'anonymous_token'),
          cookieObj.MUSIC_A,
          'utf-8',
        )
      } catch (_) {}
    }
  } catch (error) {}
  try {
    let currentPublicKey = runtimeState.getXeapiPublicKey() || {}
    try {
      currentPublicKey = JSON.parse(
        fs.readFileSync(path.resolve(tmpPath, 'xeapi_public_key'), 'utf-8'),
      )
    } catch (_) {}
    const publicKey = await getXeapiPublicKey(currentPublicKey, global.deviceId)
    runtimeState.setXeapiPublicKey(publicKey)
    try {
      fs.writeFileSync(
        path.resolve(tmpPath, 'xeapi_public_key'),
        JSON.stringify(publicKey),
        'utf-8',
      )
    } catch (_) {}
  } catch (error) {}
  if (!hasAnonymousToken) {
    try {
      const res = await registerAnonimous({}, request)
      const cookie = res.body.cookie
      if (cookie) {
        const cookieObj = cookieToJson(cookie)
        runtimeState.setAnonymousToken(cookieObj.MUSIC_A)
        try {
          fs.writeFileSync(
            path.resolve(tmpPath, 'anonymous_token'),
            cookieObj.MUSIC_A,
            'utf-8',
          )
        } catch (_) {}
      }
    } catch (error) {}
  }
}
module.exports = generateConfig
