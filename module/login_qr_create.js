const QRCode = require('qrcode')
const { generateChainId } = require('../util/index')

module.exports = async (query) => {
  const platform = query.platform || 'pc'
  const cookie = query.cookie || ''

  // 构建基础URL
  let url = `https://music.163.com/login?codekey=${query.key}`

  // 如果是web平台，则添加chainId参数
  if (platform === 'web') {
    const chainId = generateChainId(cookie)
    url += `&chainId=${chainId}`
  }

  let qrimg = ''
  if (query.qrimg) {
    try {
      // Workers 中 pngjs 流式 PNG 渲染不兼容（pack() 事件不触发导致挂起），
      // 改用纯 JS 的 SVG 渲染器生成 data URL
      const svg = await QRCode.toString(url, { type: 'svg' })
      qrimg = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
    } catch (e) {
      // SVG 渲染失败时返回空，客户端可使用 qrurl 自行生成二维码
      qrimg = ''
    }
  }

  return {
    code: 200,
    status: 200,
    body: {
      code: 200,
      data: {
        qrurl: url,
        qrimg,
      },
    },
  }
}
