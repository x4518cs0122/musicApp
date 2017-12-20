import jsonp from 'common/js/jsonp'
import axios from 'axios'
import { commonParams, options } from './config'

export function getTopList() {
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'
    var data = Object.assign({}, commonParams, {
        g_tk: 5381,
        uin: 0,
        platform: 'h5',
        needNewCode: 1,
        _: 1510655344750
    })

    return jsonp(url, data, options)
}

export function getMusicList(topid) {
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'
    var data = Object.assign({}, commonParams, {
        g_tk: 5381,
        uin: 0,
        platform: 'h5',
        needNewCode: 1,
        tpl: 3,
        page: 'detail',
        type: 'top',
        topid,
        _: 1510658720949
    })
    return jsonp(url, data, options)
}