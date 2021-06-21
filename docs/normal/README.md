# 如何使用[vuepress](https://vuepress.vuejs.org/zh/)搭建自己的个人网站

> 我一直的认为作为一个程序员也好，作为一个极客也好拥有自己的个人网站其实是一件必须的事情，在这过程中我试过自己写网站（前端加后端），也试过使用开发的个人网站系统比如wordpress等。
> 但是最后，我还是回归到了使用vuepress来搭建个人网站。

## 1. 我为什么要自己的个人网站？

&nbsp;&nbsp;在这个信息化时代，个人网站更多的是个人的宣传中心吧，个人的各种信息应该有个官方的渠道发布。同时作为程序员的自己也需要不断学习相关知识，那个人网站其实是一个很好的方式去实践整个开发的过程。个人网站涉及到服务器的购买域名的备案、服务的开发、相关服务的购买最终将网站上线，这其实就是一个完整的流程。我并不是单纯的达到上线个人网站的目的，主要目的是整个流程！

&nbsp;&nbsp;同时，我个人需要一个自己的官方渠道。既然是官方，那么从头到尾都是自己的才能叫做是官方，这么说的话个人网站是最好的选择。

## 2. 我的个人网站使用了一些什么技术？

&nbsp;&nbsp;目前我的个人网站使用的技术主要有这么几个。第一个是[vuepress](https://vuepress.vuejs.org/zh/)，vuepress是vue官方的文档框架，通过markdown的格式书写文档，然后编译成web的框架。第二个是[github](https://github.com/BruceAKABear/dengyi)，github托管了我个人的所有项目或者文档。第三个是持续集成[Jenkins](https://www.jenkins.io/)工具，我前面说了利用vuepress将我们自己写的markdown格式文件编译成了html的web。这个过程当然我们是可以手动敲命令的形式来生成，但是太麻烦也太慢，最终我使用了持续集成工具，此外这个工具也在一直持续集成我开源的[myhome开源智能家居系统](https://myhome.dengyi.pro)那顺带持续集成一下我的个人网站也说得过去吧。最后一个当然是[nginx](http://nginx.org/)啦，前端的资源没nginx怎么访问呢。

&nbsp;&nbsp;所以，我的个人网站的持续集成流程是这样的。写文档--->提交到github--->触发持续集成--->jenkins运行我已经写好的脚本--->编译项目将生成的网站复制到nginx访问目录--->完成整个过程。

## 3. 我个人网站主要有哪些内容？

&nbsp;&nbsp;作为一个伪“全栈”工程师，我写的文章将会很乱有前端、有后端、有软件、也有硬件。我会尽力将文章分的规范一些，但是我真的不能说文章的分类就一定准确，文章大致会分为日常、嵌入式、硬件、软件。他们是怎么区分的呢？
+ 日常分类：在日常分类中国主要是一个我觉得没有明确归属的文档，比如《如何利用vuepress搭建自己的个人网站》这篇文章。
+ 嵌入式分类：这个分类其实主要写一些文章关于嵌入式开发，比如Arduino、esp8266的开发等等等等。
+ 硬件分类：主要将我在折腾硬件过程中的文档，比如硬件选型、电路板怎么画的为什么这么画等等。
+ 软件分类：这其实和我的工程息息相关，因为平时自己在工作中会遇到各种各样的问题，怎么去解决的、技术框架的选型等等我都会罗列在这里。有前端、后端、数据库、框架等等，比较多也会比较杂乱。

## 4. 那么如何利用现成的vuepress搭建自己的个人网站呢？

&nbsp;&nbsp;服务器的购买、域名的购买解析、nginx的配置我通通不会将了。主要是记录一下vuepress的搭建过程和目录结构吧。

1. 搭建vuepress的开发环境，敬请参考官网吧，说太多也没意义根据官网是最合适的。地址：https://vuepress.vuejs.org/zh/
2. 在.vuepress这级目录下新增config.js作为配置的入口，我直接贴源码。在这里其实主要就是配置菜单或者网站的基本信息。
```js
module.exports = {
    title: 'dengyi.pro',
    description: '知识还是得分享，越分享越增长',
    head: [
        ['link', { rel: 'shortcut icon', href: '/favicon.ico' }]
    ],
    themeConfig: {
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
                    title: '通讯协议',
                    path: 'protocol'
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

```
3. 在指定的目录利用markdown格式文件写文章就行了，如果在某一级目录下直接写的README.md指的是某个菜单下的主页。这个应该很好理解吧，目录结构为：
```

.
├── docs
│   ├── .vuepress (可选的)
│   │   ├── components (可选的)
│   │   ├── theme (可选的)
│   │   │   └── Layout.vue
│   │   ├── public (可选的)
│   │   ├── styles (可选的)
│   │   │   ├── index.styl
│   │   │   └── palette.styl
│   │   ├── templates (可选的, 谨慎配置)
│   │   │   ├── dev.html
│   │   │   └── ssr.html
│   │   ├── config.js (可选的)
│   │   └── enhanceApp.js (可选的)
│   │ 
│   ├── README.md
│   ├── guide
│   │   └── README.md
│   └── config.md
│ 
└── package.json


```

4. 当我们写完文章其实就可以通过编译命令来编译了，有前端开发经验的小伙伴应该能非常好理解。命令如下：

```
npm run docs:dev //开发环境
npm run docs:build //打正式包
```

5. 最后我还是把我的jenkins自动部署执行的shell脚本放一份吧。
```
#!/bin/bash


echo 'start to build static html page !'

npm install -D vuepress

npm run install
# 生成静态文件
npm run docs:build

echo 'build success start to deploy'
# 进入生成的文件夹
cd docs/.vuepress

cp dist/ /usr/local/nginx/html/dengyi/ -r

echo 'deploy static website finished!'
```


总结起来就是：利用markdown来写文章，真的很简单！