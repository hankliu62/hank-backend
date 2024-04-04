const { Solar, Lunar } = require('lunar-javascript')
const fetch = require('node-fetch')

const BaseClass = require('../base/BaseClass')

const Keys = ['e1f7fff20b301745c64b655e0ef231d7', '26183f3f48d787b5541aa3d0e767b359']
/**
 * 获取星座运势
 * @param {*} consName
 */
async function getFortuneInfo (consName, keyIndex = 0) {
  const params = {
    key: Keys[keyIndex], //
    consName,
    type: 'today',
  }

  // https://www.juhe.cn/docs/api/id/58
  const url = `http://web.juhe.cn:8080/constellation/getAll?type=${params.type}&consName=${params.consName}&key=${params.key}`

  const res = await fetch(url, {
    method: 'GET',
  })
  const text = await res.text()
  const result = JSON.parse(text)

  if (result.error_code !== 0 && keyIndex < Keys.length - 1) {
    return getFortuneInfo(consName, keyIndex + 1)
  }

  return result
}
class LazyService extends BaseClass {
  /**
   * get current user info
   * @returns {Promise<string>}
   */
  async makeADecision (params) {
    // 时间分 时间越小，随机分越高
    const selected = params.selectList.sort((prev, next) => prev.selectTime - next.selectTime)[0].content
    const solar = Solar.fromDate(new Date(params.dateOfBirth))
    const lunar = Lunar.fromDate(new Date(params.dateOfBirth))
    const constellation = solar.getXingZuo() + '座'
    const result = await getFortuneInfo(constellation, 0)
    const fortunes = ['health', 'love', 'money', 'work'].sort((prev, next) => result[next] - result[prev])
    const MockResult = {
      result: selected,
      fortuneMax: fortunes[0],
      suitableThing: lunar.getDayYi().join(','),
      noSuitableThing: lunar.getDayJi().join(','),
      constellation: result.QFriend,
      movieInfo: {
        movieName: '猫和老鼠',
        movieMark: 8.5,
        moviePicUrl: 'https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2893270877.webp',
      },
      recommendedContent: '今天你会遇到一个人，他会带给你好运',
    }
    console.log(result, solar.getXingZuo(), MockResult)

    return MockResult
  }
}
module.exports = LazyService
