module.exports = {
    lang: 'zh',
    title: 'dengyi.pro',
    description: '知识还是得分享，越分享越增长',
    head: [
        ['link', { rel: 'shortcut icon', href: '/favicon.ico' }]
    ],
    plugins: ['@vuepress/back-to-top', '@vuepress/active-header-links', '@vuepress/medium-zoom'],
    markdown: {
        lineNumbers: true
    },
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
                    title: 'ESP芯片下载器',
                    path: 'downloader'
                },
                {
                    title: '无线温湿度检测器',
                    path: 'smarttemp'
                },
                {
                    title: 'WiFi通断器',
                    path: 'smartswitch'
                }
            ],
            '/software/': [
                {
                    title: 'Byte最小值为什么是-128？',
                    path: 'whyByte.md'
                }, {
                    title: '微服务网关增加swagger文档入口',
                    path: 'gatewayswagger.md'
                }
            ]
        }
    }
}