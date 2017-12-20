import jsonp from 'common/js/jsonp'
import { commonParams, options } from './config'

export function getHotKey() {
    const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'

    var data = Object.assign({}, commonParams, {
        g_tk: 5381,
        uin: 0,
        platform: 'h5',
        needNewCode: 1,
        _: 1510805732956
    })

    return jsonp(url, data, options)
}

export function search(query, page, zhida, perpage) {
    const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'

    var data = Object.assign({}, commonParams, {
        perpage,
        n: perpage,
        p: page,
        catZhida: zhida ? 1 : 0,
        w: query,
        g_tk: 5381,
        platform: 'h5',
        needNewCode: 1,
        zhidaqu: 1,
        t: 0,
        flag: 1,
        ie: 'utf - 8',
        sem: 1,
        aggr: 0,
        remoteplace: 'txt.mqq.all',
        _: 1510817079674
    })

    return jsonp(url, data, options)
}