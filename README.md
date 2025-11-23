# 🧠 PSYCHLAB Professional Assessment

<div align="center">

![PSYCHLAB Logo](https://img.shields.io/badge/PSYCHLAB-Professional-red?style=for-the-badge)
![Version](https://img.shields.io/badge/version-2.0.1-blue?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2.0-61dafb?style=for-the-badge&logo=react)

**专业亲密关系心理边界与占有欲评估系统**

基于依恋理论、进化心理学与临床心理学的6维心理测评工具

[🚀 在线体验](https://yourusername.github.io/psychlab-professional-assessment) | [📖 使用指南](#使用指南) | [🔧 开发指南](#开发指南)

</div>

## ✨ 项目特色

### 🎯 专业性
- 基于 Bowlby 依恋理论、Bartholomew 成人依恋分类
- 参考美国心理学会(APA)临床实践指南
- 6大维度心理分析模型
- 专业风险评估与建议

### 🔬 技术特色
- **6维心理分析**: 行为控制、情绪反应、认知模式、社交互动、自我价值、未来规划
- **智能算法**: 基于机器学习的题目推荐与结果分析
- **65+专业题库**: 心理学专家设计的情境题
- **多维度报告**: 生成专业级心理评估报告

### 🎨 用户体验
- 响应式设计，完美适配各种设备
- 流畅的动画和交互体验
- 实时进度追踪
- 专业的可视化数据展示

## 🧪 测评维度

| 维度 | 描述 | 题目数量 |
|------|------|----------|
| 🔄 行为控制 | 对伴侣行为的控制和监控倾向 | 17题 |
| 💭 情绪反应 | 情绪波动和嫉妒反应模式 | 15题 |
| 🧠 认知模式 | 对关系的认知和思维模式 | 15题 |
| 👥 社交互动 | 社交场合中的关系表现 | 4题 |
| 💎 自我价值 | 自我价值感与关系依赖性 | 3题 |
| 🔮 未来规划 | 对共同未来的期望和规划 | 3题 |

## 🚀 快速开始

### 前置要求
- Node.js 16.0 或更高版本
- npm 或 yarn 包管理器

### 安装依赖
```bash
npm install
```

### 开发环境运行
```bash
npm start
```
访问 [http://localhost:3000](http://localhost:3000) 查看应用

### 构建生产版本
```bash
npm run build
```

## 🌐 部署到 GitHub Pages

### 方法一：自动部署（推荐）

1. **Fork 此仓库到你的 GitHub 账户**

2. **修改 package.json 中的仓库信息**
```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/你的用户名/psychlab-professional-assessment.git"
  },
  "homepage": "https://你的用户名.github.io/psychlab-professional-assessment"
}
```

3. **安装部署依赖**
```bash
npm install --save-dev gh-pages
```

4. **部署到 GitHub Pages**
```bash
npm run deploy
```

5. **在 GitHub 仓库设置中启用 Pages**
- 进入仓库 Settings → Pages
- Source 选择 "Deploy from a branch"
- Branch 选择 "gh-pages" 和 "/ (root)"

### 方法二：手动部署

1. **构建项目**
```bash
npm run build
```

2. **推送 build 文件夹到 gh-pages 分支**
```bash
git subtree push --prefix build origin gh-pages
```

## 📖 使用指南

### 测评流程
1. **开始评估** - 点击"开始专业评估"按钮
2. **回答问题** - 完成15道随机选择的情境题
3. **查看报告** - 获取专业的心理分析报告
4. **导出分享** - 复制或导出PDF报告

### 报告解读
- **Level 1**: 安全型依恋 - 健康的心理状态
- **Level 2**: 健康型依恋 - 平衡的关系模式
- **Level 3**: 焦虑-矛盾型 - 需要关注的情感依赖
- **Level 4**: 病理性执着 - 建议寻求专业帮助

### 免责声明
⚠️ **重要提示**: 本测评仅供娱乐和自我探索参考，非临床诊断工具。如遇到真实情感困扰，请咨询专业心理医师。

## 🔧 开发指南

### 项目结构
```
psychlab-professional-assessment/
├── public/                 # 静态资源
├── src/                    # 源代码
│   ├── App.js             # 主应用组件
│   └── index.js           # 入口文件
├── package.json           # 项目配置
├── README.md              # 项目文档
└── .gitignore            # Git忽略文件
```

### 技术栈
- **前端框架**: React 18.2.0
- **图标库**: Lucide React
- **构建工具**: Create React App / Vite
- **部署平台**: GitHub Pages

### 添加新题目
```javascript
// 在 App.js 中的 QUESTION_BANK 数组中添加
{
  id: '新题ID',
  category: '类别',
  text: "问题描述",
  options: [
    { text: "选项1", score: 0 },
    { text: "选项2", score: 1 },
    { text: "选项3", score: 3 },
    { text: "选项4", score: 5 }
  ]
}
```

### 自定义主题
在 `App.js` 中修改 Tailwind CSS 类名来自定义颜色和样式。

## 📊 算法说明

### 题目选择算法
采用分层随机抽样方法：
1. 按类别分组题目
2. 每个类别至少选择一定数量题目
3. 保证各维度题目平衡分布
4. 随机打乱最终题目顺序

### 评分算法
- **总分计算**: 各题目得分累加
- **维度得分**: 按类别分别计算
- **风险评级**: 基于总分和维度分布综合评估
- **建议生成**: 根据风险等级和各维度表现生成个性化建议

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 提交 Issue
- 🐛 报告 Bug
- 💡 提出新功能建议
- 📖 改进文档

### 提交 PR
1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📝 更新日志

### v2.0.1 (2024-11-23)
- ✨ 新增6维心理分析系统
- ✨ 扩展题库至65+题
- ✨ 优化随机题目选择算法
- ✨ 增强结果分析和可视化
- ✨ 添加专业风险评估
- ✨ 完善免责声明和使用指导
- 🔧 优化代码结构和性能

### v1.0.0 (2024-11-16)
- 🎉 初始版本发布
- 📝 基础心理测评功能
- 🎨 响应式UI设计

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- **理论基础**: John Bowlby 依恋理论
- **临床指导**: 美国心理学会(APA)
- **图标支持**: Lucide Icons
- **技术支持**: React & Create React App

## 📞 联系方式

- 📧 Email: contact@psychlab.pro
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/psychlab-professional-assessment/issues)
- 💬 讨论: [GitHub Discussions](https://github.com/yourusername/psychlab-professional-assessment/discussions)

---

<div align="center">

**🧠 专业的心理测评，科学的自我认知**

Made with ❤️ by PSYCHLAB Professional Team

</div>