/**
 * 时间过滤器
 */
export function filter_hs (kssj, jssj) {
  if (jssj && kssj) {
    kssj = new Date(kssj.replace(new RegExp('-', 'gm'), '/')).getTime()
    jssj = new Date(jssj.replace(new RegExp('-', 'gm'), '/')).getTime()
    let diff = jssj - kssj
    var days = diff / 1000 / 60 / 60 / 24
    var daysRound = Math.floor(days)
    var hours = diff / 1000 / 60 / 60 - 24 * daysRound
    var hoursRound = Math.floor(hours)
    var minutes = diff / 1000 / 60 - 24 * 60 * daysRound - 60 * hoursRound
    var minutesRound = Math.floor(minutes)
    var seconds = parseInt(
      diff / 1000 -
        24 * 60 * 60 * daysRound -
        60 * 60 * hoursRound -
        60 * minutesRound
    )
    if (daysRound > 0) {
      return (
        daysRound +
        '天' +
        hoursRound +
        '时' +
        minutesRound +
        '分' +
        seconds +
        '秒'
      )
    } else {
      if (hoursRound > 0) {
        return hoursRound + '时' + minutesRound + '分' + seconds + '秒';
      } else {
        if (minutesRound > 0) {
          return minutesRound + '分' + seconds + '秒';
        } else {
          return seconds + '秒';
        }
      }
    }
  } else {
    return '-';
  }
}
