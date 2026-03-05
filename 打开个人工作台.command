#!/bin/zsh
cd "$(dirname "$0")"
echo "正在启动本地服务器..."
npx --yes serve -p 4173 . &
sleep 2
open "http://localhost:4173/个人工作台.html"
wait
