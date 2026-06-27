const QRCode = require('qrcode')
const createOption = require('../util/option.js')
module.exports = async (query, request) => {
  const data = {
    verifyConfigId: query.vid,
    verifyType: query.type,
    token: query.token,
    params: JSON.stringify({
      event_id: query.evid,
      sign: query.sign,
    }),
    size: 150,
  }

  const res = await request(
    `/api/frontrisk/verify/getqrcode`,
    data,
    createOption(query, 'weapi'),
  )
  const result = `https://st.music.163.com/encrypt-pages?qrCode=${
    res.body.data.qrCode
  }&verifyToken=${query.token}&verifyId=${query.vid}&verifyType=${
    query.type
  }&params=${JSON.stringify({
    event_id: query.evid,
    sign: query.sign,
  })}`
  let qrimg = ''
  try {
    // 优先使用 PNG 格式（与文档/原版一致，兼容 PIL 等常见图片解码库）
    qrimg = await QRCode.toDataURL(result)
  } catch (e) {
    // Workers 等环境 pngjs 渲染不兼容时，回退到纯 JS 的 SVG 渲染
    try {
      const svg = await QRCode.toString(result, { type: 'svg' })
      qrimg = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
    } catch (e2) {}
  }

  return {
    status: 200,
    body: {
      code: 200,
      data: {
        qrCode: res.body.data.qrCode,
        qrurl: result,
        qrimg,
      },
    },
  }
}
