module.exports = {
    title: 'dengyi.pro',
    description: '知识还是得分享，越分享越增长',
    head: [
        ['link', { rel: 'shortcut icon', href: '/favicon.ico' }]
    ],
    plugins: ['@vuepress/back-to-top','@vuepress/active-header-links'],
    themeConfig: {
        lastUpdated: 'Last Updated',
        nav: [
            { text: '日常', link: '/normal/' },
            { text: '嵌入式', link: '/embedded/' },
            { text: '硬件', link: '/hardware/' },
            { text: '软件', link: '/software/' },
            { text: '开源组织', link: 'https://github.com/BearLaboratory' },
        ],
        // 侧边栏配置
        sidebar: {
            '/hardware/': [
                {
                    title: '下载器',
                    path: 'downloader'
                },
                {
                    title: '智能开关',
                    path: 'smartswitch'
                }
            ],
            '/software/': [
                {
                    title: '数据库模型',
                    path: 'databasemodel'
                }
            ]
        }
    }
}