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