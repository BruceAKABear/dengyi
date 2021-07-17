module.exports = {
    lang: 'zh',
    title: 'dengyi.pro',
    description: '知识还是得分享，越分享越增长',
    head: [
        ['link', { rel: 'shortcut icon', href: '/favicon.ico' }]
    ],
    plugins: ['@vuepress/back-to-top', '@vuepress/active-header-links'],
    themeConfig: {
        lastUpdated: '上次更新时间',
        smoothScroll: true,
        nav: [
            { text: '日常', link: '/normal/' },
            { text: '嵌入式', link: '/embedded/' },
            { text: '硬件', link: '/hardware/' },
            { text: '软件', link: '/software/' },
            { text: '开源组织', link: 'https://github.com/BearLaboratory' },
        ],
        // 侧边栏配置
        sidebar: {
            '/normal/': [
                {
                    title: '我如何搭建个人网站',
                    path: 'persoanlwebsite'
                },
                {
                    title: '如何搭建个人的工作室',
                    path: 'homestudio'
                }

            ],
            '/embedded/': [],
            '/hardware/': [
                {
                    title: '下载器',
                    path: 'downloader'
                },
                {
                    title: '无线温湿度检测器',
                    path: 'smarttemp'
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