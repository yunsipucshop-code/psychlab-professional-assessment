#!/bin/bash

# PSYCHLAB Professional Assessment - GitHub Pages Deployment Script
# Version 2.0.1
# Author: PSYCHLAB Professional Team

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Logo
echo -e "${PURPLE}"
echo "  ____  _ _   _     _   _               ____              _    _               "
echo " | __ )(_) |_| |__ | |_(_) ___  _ __   |  _ \  ___  _ __ | |_ | |__   ___ _ __ "
echo " |  _ \| | __| '_ \| __| |/ _ \| '_ \  | | | |/ _ \| '_ \| __|| '_ \ / _ \ '__|"
echo " | |_) | | |_| | | | |_| | (_) | | | | | |_| | (_) | | | | |_ | | | |  __/ |   "
echo " |____/|_|\__|_| |_|\__|_|\___/|_| |_| |____/ \___/|_| |_|\__||_| |_|\___|_|   "
echo -e "${NC}"
echo -e "${CYAN}Professional Psychology Assessment System v2.0.1${NC}"
echo -e "${CYAN}GitHub Pages Deployment Script${NC}"
echo ""

# 检查必要的工具
echo -e "${BLUE}[1/7]${NC} 检查部署环境..."

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}错误: Node.js 未安装。请先安装 Node.js 16.0 或更高版本。${NC}"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2)
echo -e "${GREEN}✓ Node.js 版本: $NODE_VERSION${NC}"

# 检查 npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}错误: npm 未安装。${NC}"
    exit 1
fi

NPM_VERSION=$(npm -v)
echo -e "${GREEN}✓ npm 版本: $NPM_VERSION${NC}"

# 检查 Git
if ! command -v git &> /dev/null; then
    echo -e "${RED}错误: Git 未安装。${NC}"
    exit 1
fi

# 检查 package.json
if [ ! -f "package.json" ]; then
    echo -e "${RED}错误: 未找到 package.json 文件。请确保在项目根目录运行此脚本。${NC}"
    exit 1
fi

echo -e "${GREEN}✓ 找到 package.json${NC}"

# 安装依赖
echo -e "${BLUE}[2/7]${NC} 安装项目依赖..."
npm install
echo -e "${GREEN}✓ 依赖安装完成${NC}"

# 检查是否已安装 gh-pages
if ! npm list gh-pages &> /dev/null; then
    echo -e "${YELLOW}gh-pages 未安装，正在安装...${NC}"
    npm install --save-dev gh-pages
    echo -e "${GREEN}✓ gh-pages 安装完成${NC}"
fi

# 检查 Git 仓库状态
echo -e "${BLUE}[3/7]${NC} 检查 Git 仓库状态..."

if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}错误: 当前目录不是 Git 仓库。${NC}"
    exit 1
fi

# 检查是否有未提交的更改
if ! git diff --quiet || ! git diff --cached --quiet; then
    echo -e "${YELLOW}警告: 检测到未提交的更改。${NC}"
    read -p "是否要在部署前提交这些更改？(y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${BLUE}正在添加并提交更改...${NC}"
        git add .
        git commit -m "Auto-commit before deployment - $(date)"
        echo -e "${GREEN}✓ 更改已提交${NC}"
    fi
fi

# 获取当前分支
CURRENT_BRANCH=$(git branch --show-current)
echo -e "${GREEN}✓ 当前分支: $CURRENT_BRANCH${NC}"

# 检查远程仓库
if ! git remote get-url origin > /dev/null 2>&1; then
    echo -e "${RED}错误: 未找到 Git 远程仓库 'origin'。${NC}"
    echo -e "${YELLOW}请先设置远程仓库：${NC}"
    echo "git remote add origin https://github.com/你的用户名/仓库名.git"
    exit 1
fi

REMOTE_URL=$(git remote get-url origin)
echo -e "${GREEN}✓ 远程仓库: $REMOTE_URL${NC}"

# 构建项目
echo -e "${BLUE}[4/7]${NC} 构建生产版本..."
npm run build

if [ ! -d "build" ]; then
    echo -e "${RED}错误: 构建失败，未找到 build 目录。${NC}"
    exit 1
fi

echo -e "${GREEN}✓ 构建完成${NC}"

# 检查构建结果
if [ ! -f "build/index.html" ]; then
    echo -e "${RED}错误: 构建结果不完整，缺少 index.html。${NC}"
    exit 1
fi

echo -e "${GREEN}✓ 构建文件验证通过${NC}"

# 部署到 GitHub Pages
echo -e "${BLUE}[5/7]${NC} 部署到 GitHub Pages..."

# 检查 package.json 中的 homepage 配置
HOMEPAGE=$(node -p "require('./package.json').homepage || ''")
if [ -z "$HOMEPAGE" ]; then
    echo -e "${YELLOW}警告: 未在 package.json 中找到 homepage 配置。${NC}"
    echo -e "${YELLOW}建议在 package.json 中添加: \"homepage\": \"https://你的用户名.github.io/仓库名\"${NC}"
fi

# 部署
npm run deploy

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ 部署成功${NC}"
else
    echo -e "${RED}错误: 部署失败。${NC}"
    exit 1
fi

# 获取部署信息
echo -e "${BLUE}[6/7]${NC} 获取部署信息..."

# 提取用户名和仓库名
if [[ $REMOTE_URL =~ github\.com[/:](.+)/(.+)\.git$ ]]; then
    USERNAME="${BASH_REMATCH[1]}"
    REPO_NAME="${BASH_REMATCH[2]}"
    DEPLOY_URL="https://$USERNAME.github.io/$REPO_NAME"

    echo -e "${GREEN}✓ 部署信息:${NC}"
    echo -e "  用户名: $USERNAME"
    echo -e "  仓库名: $REPO_NAME"
    echo -e "  部署地址: $DEPLOY_URL"
else
    echo -e "${YELLOW}无法自动提取部署地址，请手动检查 GitHub Pages 设置。${NC}"
fi

# 最终检查和清理
echo -e "${BLUE}[7/7]${NC} 完成部署..."

# 清理构建文件（可选）
read -p "是否删除构建文件 (build 目录)？(y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    rm -rf build
    echo -e "${GREEN}✓ 构建文件已清理${NC}"
fi

# 完成信息
echo ""
echo -e "${GREEN}🎉 部署完成！${NC}"
echo ""
echo -e "${CYAN}=== 部署总结 ===${NC}"
echo -e "项目: PSYCHLAB Professional Assessment v2.0.1"
echo -e "分支: $CURRENT_BRANCH"
echo -e "远程: $REMOTE_URL"
if [ ! -z "$DEPLOY_URL" ]; then
    echo -e "部署地址: $DEPLOY_URL"
fi
echo ""

echo -e "${BLUE}下一步操作:${NC}"
echo -e "1. 访问 GitHub 仓库的 Settings 页面"
echo -e "2. 进入 Pages 选项卡"
echo -e "3. 确保 Source 设置为 'Deploy from a branch'"
echo -e "4. Branch 选择 'gh-pages' 和 '/ (root)'"
echo -e "5. 等待几分钟让 GitHub 处理部署"
echo ""

if [ ! -z "$DEPLOY_URL" ]; then
    echo -e "${YELLOW}🌐 网站将在几分钟后可通过以下地址访问:${NC}"
    echo -e "${CYAN}$DEPLOY_URL${NC}"
    echo ""
fi

echo -e "${GREEN}感谢使用 PSYCHLAB Professional Assessment System!${NC}"
echo -e "${PURPLE}🧠 专业的心理测评，科学的自我认知${NC}"