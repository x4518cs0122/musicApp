import Vue from 'vue'
import Router from 'vue-router'
import Singer from '@/components/singer/singer'
import Recommend from '@/components/recommend/recommend'
import Search from '@/components/search/search'
import Rank from '@/components/rank/rank'
import SingerDetail from '@/components/singer-detail/singer-detail'
import disc from '@/components/disc/disc'
import TopList from '@/components/top-list/top-list'
import User from '@/components/user-center/user-center'

Vue.use(Router)

export default new Router({
    routes: [{
            path: '/',
            redirect: '/recommend'
        },
        {
            path: '/singer',
            name: 'singer',
            component: Singer,
            children: [{
                path: ':id',
                component: SingerDetail
            }]
        },
        {
            path: '/recommend',
            name: 'Recommend',
            component: Recommend,
            children: [{
                path: ':id',
                component: disc
            }]
        },
        {
            path: '/search',
            name: 'Search',
            component: Search,
            children: [{
                path: ':id',
                components: {
                    searchResult: SingerDetail
                }
            }]
        },
        {
            path: '/rank',
            name: 'Rank',
            component: Rank,
            children: [{
                path: ':id',
                component: TopList
            }]
        },
        {
            path: '/user',
            name: 'User',
            component: User
        }
    ]
})