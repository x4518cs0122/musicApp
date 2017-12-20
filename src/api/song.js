import axios from 'axios'
import jsonp from '../common/js/jsonp'
import { commonParams, options } from './config'

export function getLyric(mid) {
    const url = '/api/lyric'
        // const url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
    const data = Object.assign({}, commonParams, {
        pcachetime: +new Date(),
        songmid: mid,
        g_tk: 1844242791,
        loginUin: 0,
        hostUin: 0,
        platform: 'yqq',
        needNewCode: 0,
        nobase64: 1
    })

    // return jsonp(url, data, options)
    return axios.get(url, {
        params: data
    }).then((res) => {
        return Promise.resolve(res.data)
    })
}