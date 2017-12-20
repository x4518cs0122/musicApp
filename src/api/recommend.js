import jsonp from '../common/js/jsonp'
import axios from 'axios'
import { commonParams, options } from './config'
export function getRecommend() {
    const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
    const data = Object.assign({}, commonParams, {
            platform: 'h5',
            uin: 0,
            needNweCode: 1
        })
        // console
    return jsonp(url, data, options)
}

export function getDiscList() {
    const url = '/api/disclist'
    const data = Object.assign({}, commonParams, {
        platform: 'yqq',
        picmid: 1,
        // loginUin: 360436029,
        g_tk: 347060537,
        hostUin: 0,
        needNewCode: 0,
        categoryId: 10000000,
        sortId: 5,
        sin: 0,
        ein: 29,
        rnd: 0.1842957443631268
    })
    return axios.get(url, {
        params: data
    }).then((res) => {
        return Promise.resolve(res.data)
    })
}


export function getSongList(disstid) {
    const url = '/api/discDetail'
    const data = Object.assign({}, commonParams, {
            g_tk: 5381,
            disstid,
            type: 1,
            json: 1,
            utf8: 1,
            onlysong: 0,
            platform: 'yqq',
            hostUin: 0,
            needNewCode: 0
        })
        // return jsonp(url, data, options)
    return axios.get(url, {
        params: data
    }).then((res) => {
        return Promise.resolve(res.data)
    })
}