import { getLyric } from 'api/song'

const ERR_OK = 0

export default class Song {
    constructor({ id, mid, singer, name, album, duration, image, url }) {
        this.id = id,
            this.mid = mid,
            this.singer = singer,
            this.name = name,
            this.album = album,
            this.duration = duration,
            this.image = image,
            this.url = url
    }

    getLyric() {
        if (this.lyric) {
            return Promise.resolve(this.lyric)
        }

        return new Promise((resolve, reject) => {
            getLyric(this.mid).then((res) => {
                if (res.retcode === ERR_OK) {
                    this.lyric = res.lyric
                    resolve(this.lyric)
                } else {
                    reject('no lyric')
                }
            })
        })

    }
}

export function createSong(musicData) {
    return new Song({
        id: musicData.songid,
        mid: musicData.songmid,
        singer: fliterSinger(musicData.singer),
        name: musicData.songname,
        album: musicData.albumname,
        // 歌曲时间长度 秒
        duration: musicData.interval,
        image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
        url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=38`
    })
}

export function fliterSinger(singer) {
    let ret = []
    if (!singer) {
        return ''
    }
    singer.forEach((s) => {
        ret.push(s.name)
    })
    return ret.join('/')
}