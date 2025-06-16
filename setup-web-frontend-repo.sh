#!/bin/bash

# 《重启人生》Web前端仓库独立化脚本
# 使用说明：请先在GitHub上创建restart-life-web仓库，然后运行此脚本

echo "🌐 《重启人生》Web前端仓库独立化脚本"
echo "=================================================="

# 检查Web前端目录是否存在
WEB_DIR="/Users/xucheng/go_learning/restart_life_web"
if [ ! -d "$WEB_DIR" ]; then
    echo "❌ 错误：Web前端目录不存在: $WEB_DIR"
    exit 1
fi

# 获取GitHub用户名
read -p "请输入您的GitHub用户名: " GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ 错误：GitHub用户名不能为空"
    exit 1
fi

echo ""
echo "🔧 配置Web前端仓库..."

# 进入Web前端目录
cd "$WEB_DIR"

# 检查是否已经配置了远程仓库
if git remote | grep -q "origin"; then
    echo "📝 检测到已有远程仓库，移除旧配置..."
    git remote remove origin
fi

# 添加新的远程仓库
REPO_URL="https://github.com/$GITHUB_USERNAME/restart-life-web.git"
echo "🔗 添加远程仓库: $REPO_URL"
git remote add origin "$REPO_URL"

# 设置主分支
echo "🌿 设置主分支..."
git branch -M main

# 推送代码
echo "🚀 推送代码到远程仓库..."
if git push -u origin main; then
    echo "✅ Web前端代码推送成功！"
else
    echo "❌ 推送失败，请检查："
    echo "   1. GitHub仓库是否已创建"
    echo "   2. 网络连接是否正常"
    echo "   3. GitHub认证是否配置正确"
    exit 1
fi

echo ""
echo "🎉 Web前端仓库独立化完成！"
echo "=================================================="
echo "📋 后续步骤："
echo "   1. 访问 https://github.com/$GITHUB_USERNAME/restart-life-web"
echo "   2. 配置分支保护规则"
echo "   3. 设置GitHub Pages（可选）"
echo "   4. 邀请团队成员"
echo ""
echo "🔧 本地开发："
echo "   cd $WEB_DIR"
echo "   npm install"
echo "   npm run dev"
echo ""
echo "📦 部署："
echo "   npm run build"
echo "   npm run preview" 