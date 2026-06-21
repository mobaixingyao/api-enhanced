const state = {
  anonymousToken: '',
  xeapiPublicKey: null,
}

function setAnonymousToken(token) {
  state.anonymousToken = token || ''
}

function getAnonymousToken() {
  return state.anonymousToken
}

function setXeapiPublicKey(publicKey) {
  state.xeapiPublicKey = publicKey || null
}

function getXeapiPublicKey() {
  return state.xeapiPublicKey
}

module.exports = {
  setAnonymousToken,
  getAnonymousToken,
  setXeapiPublicKey,
  getXeapiPublicKey,
}
