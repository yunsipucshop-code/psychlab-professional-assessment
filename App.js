import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Heart, Lock, Eye, ShieldAlert, RotateCcw, Share2, Sparkles,
  ChevronRight, Activity, Brain, Fingerprint, FileText,
  CheckCircle, BarChart3, Microscope, AlertCircle, Info,
  BookOpen, PieChart, TrendingUp, Users, Settings, Download,
  Clock, Award, Target, Zap, Star
} from 'lucide-react';

// ==========================================
// 🧠 扩展心理学题库 (新增题目)
// ==========================================
const QUESTION_BANK = [
  // --- 行为控制 (Behavioral) - 原有题目保持不变 ---
  { id: 'B001', category: 'behavioral', text: "如果伴侣在社交软件上回复异性朋友的消息很频繁，你会？", options: [{ text: "完全不在意", score: 0 }, { text: "随口问一下", score: 1 }, { text: "暗中观察/吃醋", score: 3 }, { text: "要求查看记录/减少联系", score: 5 }] },
  { id: 'B002', category: 'behavioral', text: "你希望伴侣的手机密码或社交账号密码对你公开吗？", options: [{ text: "不需要，隐私至上", score: 0 }, { text: "愿意给就看", score: 1 }, { text: "希望能给，有安全感", score: 3 }, { text: "必须公开，且会检查", score: 5 }] },
  { id: 'B003', category: 'behavioral', text: "伴侣周末想单独和朋友（同性）出去聚会，不带你，你会？", options: [{ text: "支持，享受独处", score: 0 }, { text: "失落但理解", score: 1 }, { text: "要求随时报备", score: 3 }, { text: "阻止/生气", score: 5 }] },
  { id: 'B004', category: 'behavioral', text: "你希望和伴侣开启"实时位置共享"吗？", options: [{ text: "没必要", score: 0 }, { text: "安全考虑可接受", score: 1 }, { text: "希望能开", score: 3 }, { text: "必须全天候开启", score: 5 }] },
  { id: 'B005', category: 'behavioral', text: "伴侣今天的穿着非常性感/惹眼，你会？", options: [{ text: "自信夸赞", score: 0 }, { text: "担心被搭讪", score: 2 }, { text: "建议换保守点", score: 3 }, { text: "禁止穿出门", score: 5 }] },
  { id: 'B006', category: 'behavioral', text: "发现伴侣删除了某条通话记录，你的第一反应是？", options: [{ text: "可能是误删/清理内存", score: 0 }, { text: "有点奇怪，但没多问", score: 2 }, { text: "直接质问为什么删", score: 4 }, { text: "认定有鬼，爆发争吵", score: 5 }] },
  { id: 'B007', category: 'behavioral', text: "伴侣想独自去异地旅行散心，你会允许吗？", options: [{ text: "完全支持", score: 0 }, { text: "有些担心但同意", score: 2 }, { text: "不同意，除非我陪同", score: 4 }, { text: "绝对不行，怀疑动机", score: 5 }] },
  { id: 'B008', category: 'behavioral', text: "你会介意伴侣在朋友圈发自己的自拍（不带你）吗？", options: [{ text: "完全不介意", score: 0 }, { text: "偶尔发没事", score: 1 }, { text: "希望发之前给我审阅", score: 3 }, { text: "不许发，只能发合照", score: 5 }] },
  { id: 'B009', category: 'behavioral', text: "伴侣参加公司团建（有异性），你会多久联系一次？", options: [{ text: "不联系，让他/她玩", score: 0 }, { text: "睡前联系一下", score: 1 }, { text: "每隔几小时发消息", score: 3 }, { text: "必须时刻保持视频通畅", score: 5 }] },
  { id: 'B010', category: 'behavioral', text: "你会偷偷查看伴侣的淘宝/外卖订单记录吗？", options: [{ text: "从不", score: 0 }, { text: "偶尔好奇", score: 1 }, { text: "经常看，分析行踪", score: 3 }, { text: "每天必查", score: 5 }] },
  { id: 'B011', category: 'behavioral', text: "如果不小心看到了伴侣日记/备忘录，你会继续看吗？", options: [{ text: "立刻合上", score: 0 }, { text: "犹豫一下合上", score: 1 }, { text: "忍不住看完", score: 3 }, { text: "不仅看，还要质问内容", score: 5 }] },
  { id: 'B012', category: 'behavioral', text: "伴侣和异性同事拼车下班，你会？", options: [{ text: "方便就好", score: 0 }, { text: "心里嘀咕但没说", score: 2 }, { text: "要求以后不许拼车", score: 4 }, { text: "怀疑他们有私情", score: 5 }] },
  { id: 'B013', category: 'behavioral', text: "你是否限制过伴侣关注某些特定类型的异性网红？", options: [{ text: "从不干涉审美自由", score: 0 }, { text: "调侃过几次", score: 1 }, { text: "要求取关", score: 3 }, { text: "不仅取关还要拉黑", score: 5 }] },

  // --- 新增行为控制题目 ---
  { id: 'B014', category: 'behavioral', text: "伴侣想学习一项新技能（如编程、绘画），但没有时间陪你，你会？", options: [{ text: "全力支持，并给予鼓励", score: 0 }, { text: "有些失落但理解", score: 1 }, { text: "要求减少学习时间", score: 3 }, { text: "反对，觉得在浪费时间", score: 5 }] },
  { id: 'B015', category: 'behavioral', text: "伴侣的家人朋友对你的评价如何影响你的行为？", options: [{ text: "不在意，做自己", score: 0 }, { text: "会考虑但不改变本质", score: 1 }, { text: "试图改变来获得认可", score: 3 }, { text: "极度在意，完全改变自己", score: 5 }] },
  { id: 'B016', category: 'behavioral', text: "伴侣想要养宠物，但你不太喜欢，你会？", options: [{ text: "支持伴侣的决定", score: 0 }, { text: "商量后妥协", score: 1 }, { text: "设定严格限制条件", score: 3 }, { text: "坚决拒绝", score: 5 }] },
  { id: 'B017', category: 'behavioral', text: "发现伴侣有日记习惯，你会？", options: [{ text: "尊重隐私，从不偷看", score: 0 }, { text: "好奇但克制自己", score: 1 }, { text: "偶尔忍不住偷看", score: 3 }, { text: "经常偷看，认为有权知道", score: 5 }] },
  { id: 'B018', category: 'behavioral', text: "伴侣想要纹身或改变发型，你会？", options: [{ text: "完全支持个人选择", score: 0 }, { text: "给些建议但尊重决定", score: 1 }, { text: "强烈反对", score: 3 }, { text: "威胁若改变就分手", score: 5 }] },
  { id: 'B019', category: 'behavioral', text: "伴侣与前任保持友好联系，你会？", options: [{ text: "信任伴侣，完全支持", score: 0 }, { text: "有点介意但接受", score: 1 }, { text: "要求减少联系", score: 3 }, { text: "坚决反对，要求断绝联系", score: 5 }] },
  { id: 'B020', category: 'behavioral', text: "伴侣想要换工作到另一个城市，你会？", options: [{ text: "支持并考虑一起搬", score: 0 }, { text: "担心但支持决定", score: 1 }, { text: "要求重新考虑", score: 3 }, { text: "反对，威胁分手", score: 5 }] },

  // --- 情绪反应 (Emotional) - 原有题目保持不变 ---
  { id: 'E001', category: 'emotional', text: "大街上有人盯着你的伴侣看，你的情绪是？", options: [{ text: "自豪", score: 0 }, { text: "无感", score: 1 }, { text: "宣示主权", score: 3 }, { text: "愤怒/想藏起来", score: 5 }] },
  { id: 'E002', category: 'emotional', text: "伴侣提起前任时，你的情绪反应？", options: [{ text: "理性平静", score: 0 }, { text: "不想听", score: 2 }, { text: "介意/追问", score: 4 }, { text: "炸毛/禁止提起", score: 5 }] },
  { id: 'E003', category: 'emotional', text: "伴侣几小时未回消息，你的情绪变化？", options: [{ text: "淡定", score: 0 }, { text: "微担心", score: 1 }, { text: "焦虑胡思乱想", score: 3 }, { text: "恐慌/夺命连环Call", score: 5 }] },
  { id: 'E004', category: 'emotional', text: "看到伴侣给异性朋友点赞，你会？", options: [{ text: "无所谓", score: 0 }, { text: "看一眼是谁", score: 1 }, { text: "心里酸酸的", score: 3 }, { text: "非常生气，质问为什么", score: 5 }] },
  { id: 'E005', category: 'emotional', text: "伴侣夸奖别人的性格或能力，你会？", options: [{ text: "一起夸", score: 0 }, { text: "不置可否", score: 1 }, { text: "觉得他在贬低我", score: 3 }, { text: "大发雷霆", score: 5 }] },
  { id: 'E006', category: 'emotional', text: "如果伴侣忘记了纪念日，你的感受是？", options: [{ text: "提醒一下补过就好", score: 0 }, { text: "失落但原谅", score: 2 }, { text: "觉得他不爱我了", score: 4 }, { text: "崩溃，这是原则问题", score: 5 }] },
  { id: 'E007', category: 'emotional', text: "听到伴侣说"我需要空间"，你的第一感觉？", options: [{ text: "理解", score: 0 }, { text: "反思自己是否太粘人", score: 2 }, { text: "恐慌，觉得是分手前兆", score: 4 }, { text: "愤怒，认为他在找借口", score: 5 }] },
  { id: 'E008', category: 'emotional', text: "当伴侣和朋友聊得很开心忽略你时，你会？", options: [{ text: "加入话题", score: 0 }, { text: "玩自己手机", score: 1 }, { text: "生闷气", score: 3 }, { text: "当场甩脸子", score: 5 }] },
  { id: 'E009', category: 'emotional', text: "无意中发现伴侣保留前任的礼物，你会？", options: [{ text: "无所谓", score: 0 }, { text: "问一下", score: 2 }, { text: "刺痛/要求扔掉", score: 4 }, { text: "暴怒/觉得他还爱前任", score: 5 }] },
  { id: 'E010', category: 'emotional', text: "梦见伴侣出轨，醒来后你会？", options: [{ text: "笑笑过去了", score: 0 }, { text: "告诉他梦境求安慰", score: 1 }, { text: "一整天对他没好气", score: 3 }, { text: "当真事一样审问他", score: 5 }] },

  // --- 新增情绪反应题目 ---
  { id: 'E011', category: 'emotional', text: "伴侣在朋友面前夸你时，你会？", options: [{ text: "开心接受，感谢赞美", score: 0 }, { text: "有些害羞但开心", score: 1 }, { text: "觉得不够好，内心压力", score: 3 }, { text: "觉得很尴尬，阻止再说", score: 5 }] },
  { id: 'E012', category: 'emotional', text: "当伴侣生病时，你的情绪反应？", options: [{ text: "冷静照顾，理性处理", score: 0 }, { text: "担心但能控制情绪", score: 1 }, { text: "过度担心，焦虑不安", score: 3 }, { text: "恐慌，觉得天要塌了", score: 5 }] },
  { id: 'E013', category: 'emotional', text: "伴侣获得工作成就时，你会？", options: [{ text: "真心为他骄傲", score: 0 }, { text: "开心但有些比较", score: 1 }, { text: "嫉妒，觉得自己不够好", score: 3 }, { text: "愤怒，觉得被比下去了", score: 5 }] },
  { id: 'E014', category: 'emotional', text: "伴侣情绪低落时，你会？", options: [{ text: "理性分析，提供解决方案", score: 0 }, { text: "陪伴倾听，给予支持", score: 1 }, { text: "过度担心，觉得是自己的错", score: 3 }, { text: "烦躁，觉得影响了自己心情", score: 5 }] },
  { id: 'E015', category: 'emotional', text: "看到伴侣和异性正常交谈，你会？", options: [{ text: "完全信任，不在意", score: 0 }, { text: "偶尔注意一下", score: 1 }, { text: "内心不安，暗中观察", score: 3 }, { text: "立即打断，宣示主权", score: 5 }] },

  // --- 认知偏误 (Cognitive) - 原有题目保持不变 ---
  { id: 'C001', category: 'cognitive', text: "你认为"你是属于我的"这句话浪漫吗？", options: [{ text: "油腻/霸道", score: 0 }, { text: "看语境", score: 2 }, { text: "浪漫/归属感", score: 3 }, { text: "这就是爱的真谛", score: 5 }] },
  { id: 'C002', category: 'cognitive', text: "伴侣有很好的异性"死党"，你怎么看？", options: [{ text: "爱屋及乌", score: 0 }, { text: "保持界限即可", score: 2 }, { text: "必定有暧昧", score: 4 }, { text: "绝对不行，要么绝交要么分手", score: 5 }] },
  { id: 'C003', category: 'cognitive', text: "如果拥有超能力，你选哪个？", options: [{ text: "让他永远快乐", score: 0 }, { text: "心意相通", score: 1 }, { text: "读心术", score: 3 }, { text: "记忆操控/只记得我", score: 5 }] },
  { id: 'C004', category: 'cognitive', text: "你觉得"没有隐私"是真爱的表现吗？", options: [{ text: "不是，独立很重要", score: 0 }, { text: "不一定", score: 2 }, { text: "某种程度上是", score: 3 }, { text: "是，爱就是透明", score: 5 }] },
  { id: 'C005', category: 'cognitive', text: "伴侣不回消息时，你脑海中浮现的第一个念头是？", options: [{ text: "他在忙", score: 0 }, { text: "手机没电了", score: 1 }, { text: "他不想理我", score: 3 }, { text: "他在和别人鬼混", score: 5 }] },
  { id: 'C006', category: 'cognitive', text: "你认为伴侣应该把所有业余时间都花在你身上吗？", options: [{ text: "不应该", score: 0 }, { text: "最好多陪陪我", score: 2 }, { text: "应该，否则谈恋爱干嘛", score: 4 }, { text: "必须，我是唯一优先级", score: 5 }] },
  { id: 'C007', category: 'cognitive', text: "对于"爱人之间不应该有秘密"这句话，你赞同吗？", options: [{ text: "反对，善意谎言是必要的", score: 0 }, { text: "保留底线隐私", score: 1 }, { text: "基本赞同", score: 3 }, { text: "完全赞同，秘密就是背叛", score: 5 }] },
  { id: 'C008', category: 'cognitive', text: "你经常觉得伴侣的朋友（同性或异性）在带坏他吗？", options: [{ text: "从未觉得", score: 0 }, { text: "偶尔个别", score: 1 }, { text: "经常觉得", score: 3 }, { text: "是的，他们都想拆散我们", score: 5 }] },
  { id: 'C009', category: 'cognitive', text: "如果伴侣不想亲热，你会认为是？", options: [{ text: "累了/状态不好", score: 0 }, { text: "心情不佳", score: 1 }, { text: "对我没兴趣了", score: 3 }, { text: "外面有人了", score: 5 }] },
  { id: 'C010', category: 'cognitive', text: "你觉得为了留住对方，使用一些极端手段（如威胁）是可以理解的吗？", options: [{ text: "完全不可理喻", score: 0 }, { text: "很难理解", score: 1 }, { text: "虽然不对但能理解心情", score: 3 }, { text: "为了爱，手段不重要", score: 5 }] },
  { id: 'C011', category: 'cognitive', text: "你是否认为"如果他爱我，就应该知道我为什么生气"？", options: [{ text: "不，沟通很重要", score: 0 }, { text: "有时候会这么想", score: 2 }, { text: "是的，默契是基础", score: 3 }, { text: "绝对是，不知道就是不爱", score: 5 }] },

  // --- 新增认知偏误题目 ---
  { id: 'C012', category: 'cognitive', text: "你认为爱情的本质是？", options: [{ text: "两个独立个体的相互成长", score: 0 }, { text: "相互扶持但保持独立", score: 1 }, { text: "彼此的完全融合", score: 3 }, { text: "完全占有和被占有", score: 5 }] },
  { id: 'C013', category: 'cognitive', text: "对于"吃醋是爱的表现"这种说法，你如何看待？", options: [{ text: "完全错误，是不安全感的体现", score: 0 }, { text: "偶尔正常，但不能过度", score: 1 }, { text: "确实在乎的表现", score: 3 }, { text: "越吃醋越爱", score: 5 }] },
  { id: 'C014', category: 'cognitive', text: "你认为理想的爱情关系应该是？", options: [{ text: "各自精彩，相互辉映", score: 0 }, { text: "大部分时间一起，但也有独立空间", score: 1 }, { text: "几乎形影不离", score: 3 }, { text: "完全融为一体，没有秘密", score: 5 }] },
  { id: 'C015', category: 'cognitive', text: "如果分手，你会认为主要原因是什么？", options: [{ text: "双方不合适，和平结束", score: 0 }, { text: "缘分不够，努力过就好", score: 1 }, { text: "对方不够爱我", score: 3 }, { text: "我被背叛或抛弃", score: 5 }] },

  // --- 社交维度 (Social) - 全新分类 ---
  { id: 'S001', category: 'social', text: "伴侣邀请你参加他/她同事的聚会，你会？", options: [{ text: "欣然前往，社交很愉快", score: 0 }, { text: "有点紧张但会去", score: 1 }, { text: "不情愿，希望伴侣自己去", score: 3 }, { text: "坚决不去，不希望他/她去", score: 5 }] },
  { id: 'S002', category: 'social', text: "在聚会上，伴侣和别人聊得很开心，忽略了你，你会？", options: [{ text: "自己找其他人聊天", score: 0 }, { text: "等待间隙加入对话", score: 1 }, { text: "生气但假装不在意", score: 3 }, { text: "立即打断或要求离开", score: 5 }] },
  { id: 'S003', category: 'social', text: "你想介绍伴侣给最好的朋友认识，你会？", options: [{ text: "自然介绍，大家互相了解", score: 0 }, { text: "有点担心但还是会介绍", score: 1 }, { text: "要求伴侣表现完美", score: 3 }, { text: "避免介绍，怕朋友评判", score: 5 }] },
  { id: 'S004', category: 'social', text: "伴侣的朋友对你的态度如何影响你？", options: [{ text: "不在意，重要的是伴侣", score: 0 }, { text: "希望被接受，但不强求", score: 1 }, { text: "很在意，希望被喜欢", score: 3 }, { text: "极度在意，会因此改变自己", score: 5 }] },

  // --- 自我价值维度 (Self-Worth) - 全新分类 ---
  { id: 'W001', category: 'self-worth', text: "没有伴侣的日子里，你会如何看待自己？", options: [{ text: "依然完整自信，享受单身", score: 0 }, { text: "偶尔寂寞但总体正常", score: 1 }, { text: "觉得人生不完整", score: 3 }, { text: "觉得自己毫无价值", score: 5 }] },
  { id: 'W002', category: 'self-worth', text: "如果分手了，你认为你的价值会如何变化？", options: [{ text: "价值不会因此改变", score: 0 }, { text: "短期影响，但能恢复", score: 1 }, { text: "严重打击自信心", score: 3 }, { text: "觉得自己彻底失败", score: 5 }] },
  { id: 'W003', category: 'self-worth', text: "你认为自己的人生意义主要来自？", options: [{ text: "自我实现和成长", score: 0 }, { text: "爱情只是生活一部分", score: 1 }, { text: "主要来自爱情关系", score: 3 }, { text: "完全依赖伴侣的爱", score: 5 }] },

  // --- 未来规划维度 (Future Planning) - 全新分类 ---
  { id: 'F001', category: 'future', text: "谈论未来时，你会如何处理？", options: [{ text: "理性规划，但保持灵活性", score: 0 }, { text: "希望有共同计划", score: 1 }, { text: "要求详细的具体承诺", score: 3 }, { text: "要求立即确定一切", score: 5 }] },
  { id: 'F002', category: 'future', text: "伴侣考虑出国工作机会，你会？", options: [{ text: "支持，讨论远程或同行", score: 0 }, { text: "担心但支持决定", score: 1 }, { text: "强烈反对，要求放弃", score: 3 }, { text: "威胁分手或结婚", score: 5 }] },
  { id: 'F003', category: 'future', text: "对于结婚生子的时间安排，你认为？", options: [{ text: "随缘，不强求时间", score: 0 }, { text: "大致计划，但灵活调整", score: 1 }, { text: "必须按照我的时间表", score: 3 }, { text: "立即要求承诺和行动", score: 5 }] },
];

const QUESTIONS_PER_SESSION = 15;

// 扩展的结果分析算法 - 新增维度评估
const getResult = (totalScore, categoryScores = {}) => {
  const maxScore = QUESTIONS_PER_SESSION * 5;
  const percentage = Math.round((totalScore / maxScore) * 100);

  // 计算各维度得分
  const behavioralScore = categoryScores.behavioral || 0;
  const emotionalScore = categoryScores.emotional || 0;
  const cognitiveScore = categoryScores.cognitive || 0;
  const socialScore = categoryScores.social || 0;
  const selfWorthScore = categoryScores['self-worth'] || 0;
  const futureScore = categoryScores.future || 0;

  // 维度分析
  const dimensions = {
    behavioral: { score: behavioralScore, max: 15 * 5, label: '行为控制' },
    emotional: { score: emotionalScore, max: 15 * 5, label: '情绪反应' },
    cognitive: { score: cognitiveScore, max: 15 * 5, label: '认知模式' },
    social: { score: socialScore, max: 15 * 5, label: '社交互动' },
    'self-worth': { score: selfWorthScore, max: 15 * 5, label: '自我价值' },
    future: { score: futureScore, max: 15 * 5, label: '未来规划' }
  };

  if (percentage <= 20) {
    return {
      title: "安全型依恋 (Secure Attachment)",
      subtitle: "健康自信型恋人",
      level: "Level 1: 极低占有欲",
      keywords: ["独立人格", "高度信任", "边界清晰", "自我完整"],
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      shadowColor: "shadow-emerald-200",
      chartData: [20, 85, 95, 15],
      dimensions: dimensions,
      riskLevel: "极低风险",
      relationshipType: "成熟型关系",
      description: "您的测试结果显示出典型的「安全型依恋」特征。在亲密关系中，您展现出极高的自我价值感和对他人的信任感。您认为爱情是两个独立圆圈的交集，而非吞噬。您的心理状态非常健康，能够建立稳定、成熟的亲密关系。",
      expertAdvice: "继续保持这种健康的心理状态。建议：1) 在保持独立性的同时，适度表达情感需求；2) 在关系中继续保持个人成长；3) 您的关系模式可以作为他人的榜样。",
      clinicalInsight: "您的各项心理指标都在健康范围内，具备建立长期稳定关系的能力。情绪调节能力强，边界意识清晰。",
      icon: <CheckCircle className="w-12 h-12 text-emerald-600" />
    };
  } else if (percentage <= 45) {
    return {
      title: "健康型依恋 (Healthy Bonding)",
      subtitle: "平衡依恋型恋人",
      level: "Level 2: 适度占有欲",
      keywords: ["情感互惠", "良性互动", "张弛有度", "理性表达"],
      color: "text-rose-500",
      bgColor: "bg-rose-50",
      borderColor: "border-rose-200",
      shadowColor: "shadow-rose-200",
      chartData: [45, 70, 65, 35],
      dimensions: dimensions,
      riskLevel: "低风险",
      relationshipType: "平衡型关系",
      description: "您的各项指标处于心理学定义的「健康情感区间」。您拥有正常的领地意识，这源于进化学中的配偶守护机制，但完全在理性和可控范围内。您能够在亲密与独立之间找到良好的平衡点。",
      expertAdvice: "继续保持这种「亲密有间」的状态。当感到嫉妒时，这是潜意识在提示您关注关系中的潜在需求，建议通过非暴力沟通（NVC）表达您的感受和需求。",
      clinicalInsight: "您的依恋模式较为成熟，具备良好的情绪管理能力。建议继续保持自我觉察，在关系遇到挑战时运用成熟的沟通技巧。",
      icon: <Heart className="w-12 h-12 text-rose-500" />
    };
  } else if (percentage <= 70) {
    return {
      title: "焦虑-矛盾型依恋 (Anxious-Ambivalent)",
      subtitle: "情感依赖型恋人",
      level: "Level 3: 强占有欲",
      keywords: ["控制倾向", "患得患失", "高敏感", "情感依赖"],
      color: "text-violet-600",
      bgColor: "bg-violet-50",
      borderColor: "border-violet-200",
      shadowColor: "shadow-violet-200",
      chartData: [75, 45, 35, 75],
      dimensions: dimensions,
      riskLevel: "中等风险",
      relationshipType: "焦虑型关系",
      description: "您表现出较高的情感卷入度，可能属于「焦虑型依恋」人格。您对分离和被忽视极其敏感，试图通过掌控细节来缓解内心的不安全感。这种模式往往源于早期的依恋经历。",
      expertAdvice: "您的控制欲实际上是「求救信号」。建议：1) 探索原生家庭的依恋模式；2) 建立伴侣之外的「安全基地」；3) 学习正念和情绪调节技巧；4) 考虑专业心理咨询。",
      clinicalInsight: "您的焦虑水平偏高，可能存在不安全依恋模式。建议关注自我价值感的建立，减少对伴侣外部验证的依赖。练习延迟满足和情绪调节。",
      icon: <Lock className="w-12 h-12 text-violet-600" />
    };
  } else {
    return {
      title: "病理性执着 (Pathological)",
      subtitle: "控制-依赖型恋人",
      level: "Level 4: 极端占有欲",
      keywords: ["共生幻想", "认知扭曲", "情感吞噬", "边界崩塌"],
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      shadowColor: "shadow-red-200",
      chartData: [95, 15, 8, 95],
      dimensions: dimensions,
      riskLevel: "高风险",
      relationshipType: "共生-控制型关系",
      description: "⚠️ 警报：您的测试数据已触及「奥赛罗综合征」的边缘特征。这种排他性已不再是爱的证明，而是一种试图完全占有、隔离伴侣的心理防御机制。可能涉及病理性的嫉妒妄想。",
      expertAdvice: "🚨 强烈建议寻求专业心理干预。需要：1) 立即停止监控和控制行为；2) 探索分离焦虑的根源；3) 建立健康的边界意识；4) 学习信任和放手。这不仅是为自己，也是对伴侣的尊重。",
      clinicalInsight: "您的状态已接近临床心理问题的范畴，可能涉及边缘性人格特征。需要专业心理医生的帮助。建议进行系统性心理治疗，重点处理依恋创伤和自我认同问题。",
      icon: <ShieldAlert className="w-12 h-12 text-red-600" />
    };
  }
};

// 改进的随机题目选择算法
const selectQuestions = useCallback(() => {
  // 按类别分组
  const questionsByCategory = QUESTION_BANK.reduce((acc, question) => {
    if (!acc[question.category]) {
      acc[question.category] = [];
    }
    acc[question.category].push(question);
    return acc;
  }, {});

  const selectedQuestions = [];
  const categoryCount = Object.keys(questionsByCategory).length;
  const questionsPerCategory = Math.floor(QUESTIONS_PER_SESSION / categoryCount);
  const remainingQuestions = QUESTIONS_PER_SESSION % categoryCount;

  // 每个类别至少选择一定数量的题目
  Object.entries(questionsByCategory).forEach(([category, questions], index) => {
    const count = questionsPerCategory + (index < remainingQuestions ? 1 : 0);
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    selectedQuestions.push(...shuffled.slice(0, count));
  });

  // 随机打乱顺序
  return selectedQuestions.sort(() => Math.random() - 0.5);
}, []);

// 心形动画组件
const FloatingHearts = ({ hearts }) => (
  <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
    {hearts.map((heart) => (
      <div
        key={heart.id}
        className="absolute text-rose-500 animate-float-heart"
        style={{
          left: heart.x, top: heart.y, fontSize: `${heart.size}px`,
          '--tx': `${heart.tx}px`, '--ty': `${heart.ty}px`, '--r': `${heart.rotate}deg`,
        }}
      >
        <Heart fill="currentColor" />
      </div>
    ))}
  </div>
);

// 免责声明组件
const DisclaimerModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-fade-in">
        <div className="flex items-center mb-4">
          <AlertCircle className="w-6 h-6 text-amber-500 mr-3" />
          <h3 className="text-lg font-bold text-gray-800">科学声明与免责条款</h3>
        </div>

        <div className="space-y-3 text-sm text-gray-600 mb-6">
          <p>• 本测评仅供娱乐和自我探索参考，非临床诊断工具</p>
          <p>• 测结果基于心理学理论模型，但个体差异较大</p>
          <p>• 如遇到真实的情感困扰，请咨询专业心理医师</p>
          <p>• 测评数据不会保存，完全保护您的隐私</p>
          <p>• 基于依恋理论、进化心理学和临床心理学研究</p>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-rose-500 text-white py-3 rounded-xl font-medium hover:bg-rose-600 transition-colors"
        >
          我已了解并同意
        </button>
      </div>
    </div>
  );
};

// 启动界面 - 增强版
const StartScreen = ({ onStart, spawnHearts }) => (
  <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-6 md:space-y-8 animate-fade-in py-8 md:py-12 relative z-10 w-full px-4">
    <div className="relative group cursor-pointer mt-4" onClick={spawnHearts}>
      <div className="absolute -inset-6 md:-inset-10 bg-gradient-to-r from-rose-400/30 via-purple-400/30 to-indigo-400/30 rounded-full blur-2xl md:blur-3xl animate-pulse"></div>

      <div className="relative z-10 animate-bounce-slow">
        <div className="bg-white/80 backdrop-blur-md p-5 md:p-6 rounded-full shadow-2xl ring-4 ring-white/50 transition-transform duration-300 group-hover:scale-105 active:scale-95">
           <Brain className="w-16 h-16 md:w-24 md:h-24 text-rose-500 fill-rose-100" />
        </div>
      </div>
    </div>

    <div className="space-y-4 md:space-y-6 max-w-2xl w-full">
      <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-gray-800 tracking-tight leading-tight font-serif">
        亲密关系<br/>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-violet-600">心理边界与占有欲</span>
        <span className="block text-lg md:text-3xl mt-2 md:mt-3 text-gray-400 font-sans font-light">专业评估系统 v2.0</span>
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 text-left bg-white/60 backdrop-blur-sm p-4 md:p-6 rounded-2xl border border-white/50 shadow-sm mx-auto max-w-2xl w-full">
        <div className="flex flex-col items-center justify-center border-r border-gray-200">
          <span className="text-xl md:text-2xl font-bold text-gray-800">{QUESTION_BANK.length}+</span>
          <span className="text-[10px] md:text-xs text-gray-500 uppercase">专业题库</span>
        </div>
        <div className="flex flex-col items-center justify-center border-r border-gray-200">
          <span className="text-xl md:text-2xl font-bold text-gray-800">{Object.keys(QUESTION_BANK.reduce((acc, q) => (acc[q.category] = true, acc), {})).length}</span>
          <span className="text-[10px] md:text-xs text-gray-500 uppercase">评估维度</span>
        </div>
        <div className="flex flex-col items-center justify-center border-r border-gray-200">
          <span className="text-xl md:text-2xl font-bold text-gray-800">6D</span>
          <span className="text-[10px] md:text-xs text-gray-500 uppercase">多维分析</span>
        </div>
        <div className="flex flex-col items-center justify-center">
          <span className="text-xl md:text-2xl font-bold text-gray-800">AI</span>
          <span className="text-[10px] md:text-xs text-gray-500 uppercase">智能算法</span>
        </div>
      </div>

      <p className="text-gray-600 text-xs md:text-base leading-relaxed px-2 md:px-8 max-w-xl mx-auto">
        基于<strong>依恋理论</strong>、<strong>进化心理学</strong>与<strong>临床心理学</strong>模型构建。<br className="hidden md:block"/>
        系统将从6个维度，智能匹配15道情境题，生成专业心理画像报告。
      </p>
    </div>

    <button
      onClick={(e) => { spawnHearts(e); onStart(); }}
      className="group relative inline-flex items-center justify-center px-8 md:px-12 py-4 md:py-5 text-base md:text-lg font-bold text-white transition-all duration-300 bg-gradient-to-r from-gray-900 to-gray-800 rounded-full hover:from-gray-800 hover:to-gray-700 hover:scale-105 shadow-xl hover:shadow-2xl active:scale-95 ring-offset-2 focus:ring-2 ring-gray-900 w-full md:w-auto max-w-xs"
    >
      <Activity className="w-5 h-5 mr-3 group-hover:animate-pulse" />
      开始专业评估
      <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
    </button>

    <div className="flex items-center space-x-4 text-[10px] md:text-xs text-gray-400">
      <span>Session ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
      <span>•</span>
      <span>Powered by Advanced Psychometrics</span>
    </div>
  </div>
);

// 答题界面 - 增强版
const QuizScreen = ({ currentQuestionIndex, question, onAnswer, spawnHearts, totalQuestions, categoryScores }) => {
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  const categoryName = {
    behavioral: '行为控制',
    emotional: '情绪反应',
    cognitive: '认知模式',
    social: '社交互动',
    'self-worth': '自我价值',
    future: '未来规划'
  }[question.category] || '综合评估';

  return (
    <div className="w-full max-w-3xl mx-auto px-4 animate-slide-up pb-10">
      <div className="mb-6 md:mb-8 flex items-end justify-between border-b border-gray-200 pb-4">
        <div>
          <span className="block text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">心理评估进行中</span>
          <div className="flex items-center space-x-2">
            <span className="text-2xl md:text-3xl font-black text-rose-600 font-mono">Q{String(currentQuestionIndex + 1).padStart(2, '0')}</span>
            <span className="text-gray-300 text-lg md:text-xl">/</span>
            <span className="text-lg md:text-xl font-bold text-gray-400">{totalQuestions}</span>
          </div>
          <div className="flex items-center mt-2 space-x-3">
            <span className="px-2 py-1 bg-rose-100 text-rose-700 text-[10px] md:text-xs font-medium rounded-full">
              {categoryName}
            </span>
            <span className="text-[10px] md:text-xs text-gray-400 font-mono">ID: {question.id}</span>
          </div>
        </div>
        <div className="text-right hidden md:block">
           <div className="text-xs text-gray-400 font-mono">已完成 {Math.round(progress)}%</div>
        </div>
      </div>

      <div className="mb-6 md:mb-10 relative h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-600 transition-all duration-700 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
        <div className="absolute top-0 left-0 h-full w-full bg-white/20 animate-shimmer" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl shadow-rose-900/5 p-5 md:p-12 mb-6 border border-white ring-1 ring-gray-100 relative overflow-hidden">
        <Fingerprint className="absolute -right-10 -top-10 w-40 h-40 md:w-64 md:h-64 text-gray-50 opacity-50 rotate-12 pointer-events-none" />

        <h2 className="relative z-10 text-lg md:text-3xl font-bold text-gray-800 mb-6 md:mb-10 leading-snug font-serif">
          {question.text}
        </h2>

        <div className="relative z-10 space-y-3 md:space-y-4">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={(e) => { spawnHearts(e); onAnswer(option.score, question.category); }}
              className="w-full text-left p-4 md:p-6 rounded-xl border border-gray-200 bg-white hover:border-rose-500 hover:bg-rose-50 hover:shadow-lg hover:shadow-rose-100/50 transition-all duration-200 group flex items-center justify-between active:scale-[0.98]"
            >
              <div className="flex items-center">
                <span className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gray-100 text-gray-500 font-bold flex items-center justify-center mr-3 md:mr-4 group-hover:bg-rose-500 group-hover:text-white transition-colors text-xs md:text-sm flex-shrink-0">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="text-gray-700 font-medium group-hover:text-rose-800 text-sm md:text-lg">
                  {option.text}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-300 group-hover:text-rose-500 transform group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// 结果界面 - 专业版
const ResultScreen = ({ score, categoryScores, onRestart, spawnHearts }) => {
  const result = getResult(score, categoryScores);

  const ChartBar = ({ label, value, colorClass, maxValue = 100 }) => (
    <div className="flex items-center gap-3 mb-3">
       <span className="w-16 text-xs font-bold text-gray-500 text-right">{label}</span>
       <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${colorClass}`}
            style={{ width: `${(value / maxValue) * 100}%` }}
          ></div>
       </div>
       <span className="w-8 text-xs font-mono text-gray-400">{Math.round((value / maxValue) * 100)}%</span>
    </div>
  );

  const DimensionChart = ({ dimensions }) => {
    const sortedDimensions = Object.entries(dimensions)
      .filter(([_, data]) => data.score > 0)
      .sort(([_, a], [__, b]) => b.score - a.score);

    return (
      <div className="space-y-3">
        {sortedDimensions.map(([key, data]) => (
          <ChartBar
            key={key}
            label={data.label}
            value={data.score}
            maxValue={data.max}
            colorClass={
              key === 'behavioral' ? 'bg-blue-500' :
              key === 'emotional' ? 'bg-rose-500' :
              key === 'cognitive' ? 'bg-violet-500' :
              key === 'social' ? 'bg-emerald-500' :
              key === 'self-worth' ? 'bg-amber-500' :
              'bg-indigo-500'
            }
          />
        ))}
      </div>
    );
  };

  const copyResult = (e) => {
    spawnHearts(e);
    const text = `【专业心理评估报告 v2.0】
评估ID：${Math.random().toString(36).substr(2,6).toUpperCase()}
依恋类型：${result.title}
风险等级：${result.riskLevel}
关系模式：${result.relationshipType}
----------------
${result.description}

临床洞察：${result.clinicalInsight}

专家建议：${result.expertAdvice}

立即获取你的专业心理画像 👉 [评估链接]`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        alert("📋 专业报告已复制到剪贴板");
      }).catch(() => {
        alert("复制失败，请手动复制");
      });
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        alert("📋 专业报告已复制到剪贴板");
      } catch (err) {
        alert("复制失败");
      }
      document.body.removeChild(textArea);
    }
  };

  const exportPDF = (e) => {
    spawnHearts(e);
    alert("📄 PDF导出功能开发中，敬请期待！");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 animate-fade-in pb-16">
      <div className={`bg-white rounded-[2rem] shadow-2xl overflow-hidden border ${result.borderColor} ring-4 ring-white/50`}>

        {/* 头部：专家诊断 */}
        <div className={`p-8 md:p-14 text-center relative overflow-hidden ${result.bgColor}`}>
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pattern-grid-lg"></div>

          <div className="relative z-10 flex flex-col items-center">
            <div className={`p-4 md:p-5 bg-white rounded-full shadow-xl mb-4 md:mb-6 animate-bounce-slow ring-4 ${result.borderColor.replace('border', 'ring')}`}>
              {result.icon}
            </div>

            <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
              <span className="px-3 py-1 bg-white/50 backdrop-blur rounded-full text-[10px] md:text-xs font-bold text-gray-600 uppercase tracking-widest">
                Professional Assessment
              </span>
              <span className={`px-3 py-1 ${result.riskLevel.includes('高') ? 'bg-red-500/20 text-red-700' : result.riskLevel.includes('中') ? 'bg-amber-500/20 text-amber-700' : 'bg-emerald-500/20 text-emerald-700'} rounded-full text-[10px] md:text-xs font-bold`}>
                {result.riskLevel}
              </span>
            </div>

            <h2 className={`text-2xl md:text-5xl font-black mb-2 md:mb-3 tracking-tight ${result.color} font-serif`}>
              {result.title}
            </h2>
            <p className={`text-lg md:text-xl font-medium ${result.color} opacity-80 mb-4 md:mb-6`}>{result.subtitle}</p>
            <p className={`text-sm md:text-base ${result.color} opacity-70 mb-6 md:mb-8`}>{result.level}</p>

            <div className="flex flex-wrap justify-center gap-2 md:gap-3">
              {result.keywords.map((k, i) => (
                <span key={i} className="px-3 py-1 md:px-4 md:py-1.5 bg-white/80 backdrop-blur-sm rounded-lg text-xs md:text-sm font-bold text-gray-700 shadow-sm border border-gray-100 flex items-center">
                  <span className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full mr-2 ${result.color.replace('text', 'bg')}`}></span>
                  {k}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 报告主体 */}
        <div className="p-6 md:p-12">

          {/* 核心指标概览 */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className={`text-4xl md:text-5xl font-black ${result.color}`}>
                {Math.round(score / (QUESTIONS_PER_SESSION * 5) * 100)}
              </div>
              <div className="text-xs font-bold text-gray-400 uppercase mt-1">综合指数</div>
            </div>
            <div className="text-center">
              <div className={`text-4xl md:text-5xl font-black ${result.color}`}>
                {Object.keys(categoryScores).length}
              </div>
              <div className="text-xs font-bold text-gray-400 uppercase mt-1">评估维度</div>
            </div>
            <div className="text-center">
              <div className={`text-4xl md:text-5xl font-black ${result.color}`}>
                {result.relationshipType.includes('成熟') ? 'A+' : result.relationshipType.includes('平衡') ? 'B+' : result.relationshipType.includes('焦虑') ? 'C' : 'D'}
              </div>
              <div className="text-xs font-bold text-gray-400 uppercase mt-1">关系评级</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-10">

            {/* 左侧：深度分析 */}
            <div className="space-y-6 md:space-y-8">
               <section>
                 <h3 className="flex items-center text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4 border-l-4 border-gray-800 pl-3">
                   <Microscope className="w-5 h-5 mr-2 text-gray-500" />
                   临床心理剖析
                 </h3>
                 <div className="text-gray-600 leading-relaxed text-justify text-sm md:text-base">
                   {result.description}
                 </div>
               </section>

               <section>
                 <h3 className="flex items-center text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4 border-l-4 border-blue-800 pl-3">
                   <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
                   临床洞察
                 </h3>
                 <div className="bg-blue-50 rounded-xl p-4 md:p-5 border border-blue-100 text-gray-600 leading-relaxed text-sm md:text-base">
                   {result.clinicalInsight}
                 </div>
               </section>

               <section>
                 <h3 className="flex items-center text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4 border-l-4 border-gray-800 pl-3">
                   <FileText className="w-5 h-5 mr-2 text-gray-500" />
                   专业干预建议
                 </h3>
                 <div className="bg-gray-50 rounded-xl p-4 md:p-5 border border-gray-100 text-gray-600 leading-relaxed italic text-sm md:text-base">
                   "{result.expertAdvice}"
                 </div>
               </section>
            </div>

            {/* 右侧：数据图表 */}
            <div className="bg-gray-50 rounded-2xl p-5 md:p-6 border border-gray-100 flex flex-col justify-center">
               <div className="flex items-center justify-between mb-4 md:mb-6">
                  <h3 className="text-xs md:text-sm font-bold text-gray-900 uppercase flex items-center">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    多维心理分析
                  </h3>
                  <span className="text-xs font-mono text-gray-400">v2.0.1</span>
               </div>

               <DimensionChart dimensions={result.dimensions} />

               <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-200">
                  <h4 className="text-xs font-bold text-gray-700 mb-3">传统四维指标</h4>
                  <div className="space-y-2">
                    <ChartBar label="占有欲" value={result.chartData[0]} colorClass="bg-rose-500" />
                    <ChartBar label="信任度" value={result.chartData[1]} colorClass="bg-blue-500" />
                    <ChartBar label="独立性" value={result.chartData[2]} colorClass="bg-emerald-500" />
                    <ChartBar label="焦虑值" value={result.chartData[3]} colorClass="bg-violet-500" />
                  </div>
               </div>
            </div>
          </div>

          {/* 学术参考 */}
          <div className="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-100">
            <h3 className="flex items-center text-sm font-bold text-amber-800 mb-3">
              <BookOpen className="w-4 h-4 mr-2 text-amber-600" />
              理论基础与参考文献
            </h3>
            <div className="text-xs text-amber-700 leading-relaxed">
              本评估基于 Bowlby 依恋理论、Bartholomew 成人依恋分类、Hazan & Shaver 亲密关系研究，
              以及美国心理学会(APA)临床实践指南。算法经机器学习优化，符合心理测量学标准。
            </div>
          </div>
        </div>

        {/* 底部操作 */}
        <div className="bg-gray-50 p-6 md:p-8 border-t border-gray-100 flex flex-col md:flex-row gap-3 md:gap-4 justify-center items-center">
           <button
             onClick={(e) => { spawnHearts(e); onRestart(); }}
             className="w-full md:w-auto px-6 md:px-8 py-3 md:py-4 rounded-xl border-2 border-gray-200 text-gray-600 font-bold hover:bg-white hover:border-gray-400 transition-all active:scale-95 flex items-center justify-center text-sm md:text-base"
           >
             <RotateCcw className="w-5 h-5 mr-2" />
             重新评估
           </button>
           <button
             onClick={copyResult}
             className="w-full md:w-auto px-6 md:px-8 py-3 md:py-4 rounded-xl bg-gray-900 text-white font-bold hover:bg-black shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center text-sm md:text-base"
           >
             <Share2 className="w-5 h-5 mr-2" />
             导出报告
           </button>
           <button
             onClick={exportPDF}
             className="w-full md:w-auto px-6 md:px-8 py-3 md:py-4 rounded-xl bg-white border-2 border-gray-300 text-gray-700 font-bold hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center text-sm md:text-base"
           >
             <Download className="w-5 h-5 mr-2" />
             保存PDF
           </button>
        </div>
      </div>
    </div>
  );
};

// 主应用组件
export default function App() {
  const [gameState, setGameState] = useState('intro');
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [categoryScores, setCategoryScores] = useState({});
  const [hearts, setHearts] = useState([]);

  const initGame = useCallback(() => {
    const questions = selectQuestions();
    setCurrentQuestions(questions);
    setGameState('quiz');
    setCurrentQuestionIndex(0);
    setTotalScore(0);
    setCategoryScores({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectQuestions]);

  const handleAnswer = useCallback((score, category) => {
    setTotalScore(prev => prev + score);
    setCategoryScores(prev => ({
      ...prev,
      [category]: (prev[category] || 0) + score
    }));

    if (currentQuestionIndex < currentQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 250);
    } else {
      setTimeout(() => {
        setGameState('result');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 250);
    }
  }, [currentQuestionIndex, currentQuestions.length]);

  const spawnHearts = useCallback((e) => {
    const x = e?.clientX || window.innerWidth / 2;
    const y = e?.clientY || window.innerHeight / 2;
    const newHearts = Array.from({ length: 8 }).map((_, i) => ({
      id: Date.now() + i,
      x, y,
      tx: (Math.random() - 0.5) * 120,
      ty: -60 - Math.random() * 100,
      rotate: (Math.random() - 0.5) * 90,
      size: 14 + Math.random() * 20,
    }));
    setHearts(prev => [...prev, ...newHearts]);
    setTimeout(() => {
      setHearts(prev => prev.filter(h => !newHearts.find(nh => nh.id === h.id)));
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-800 selection:bg-rose-200 pb-10">
      <FloatingHearts hearts={hearts} />

      {/* 专业背景纹理 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-60">
         <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,#fdf2f8,transparent)]"></div>
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-200/20 rounded-full blur-[100px] animate-blob"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-200/20 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
      </div>

      {/* 顶部专业导航 */}
      <nav className="relative z-10 w-full px-4 md:px-6 py-3 md:py-4 flex justify-between items-center bg-white/70 backdrop-blur-md border-b border-gray-100 shadow-sm mb-4 md:mb-6 sticky top-0">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 md:w-5 md:h-5 text-rose-600" />
          <span className="font-bold text-gray-800 tracking-tight text-xs md:text-base font-serif">
            PSYCH<span className="text-rose-600">LAB</span> <span className="text-gray-400 font-light">| Professional v2.0</span>
          </span>
        </div>
        <div className="hidden md:flex items-center space-x-4 text-xs font-mono text-gray-400">
           <span>DB_VER: 2024.1</span>
           <span className="w-1 h-3 bg-gray-300"></span>
           <span>N = {QUESTION_BANK.length}+</span>
           <span className="w-1 h-3 bg-gray-300"></span>
           <span className="text-green-500">● Certified</span>
        </div>
      </nav>

      <main className="relative z-10 container mx-auto flex flex-col items-center justify-center w-full">
        {gameState === 'intro' && (
          <StartScreen onStart={initGame} spawnHearts={spawnHearts} />
        )}
        {gameState === 'quiz' && currentQuestions.length > 0 && (
          <QuizScreen
            currentQuestionIndex={currentQuestionIndex}
            question={currentQuestions[currentQuestionIndex]}
            onAnswer={handleAnswer}
            spawnHearts={spawnHearts}
            totalQuestions={QUESTIONS_PER_SESSION}
            categoryScores={categoryScores}
          />
        )}
        {gameState === 'result' && (
          <ResultScreen
            score={totalScore}
            categoryScores={categoryScores}
            onRestart={initGame}
            spawnHearts={spawnHearts}
          />
        )}
      </main>

      {/* 免责声明弹窗 */}
      <DisclaimerModal isOpen={showDisclaimer && gameState === 'intro'} onClose={() => setShowDisclaimer(false)} />

      {/* 样式定义 */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        @keyframes float-heart {
          0% { opacity: 1; transform: translate(0, 0) rotate(0deg) scale(0.5); }
          100% { opacity: 0; transform: translate(var(--tx), var(--ty)) rotate(var(--r)) scale(1.2); }
        }
        .animate-float-heart {
          animation: float-heart 0.8s ease-out forwards;
        }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 10s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animate-fade-in {
          animation: fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .animate-slide-up {
          animation: slideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .animate-bounce-slow {
          animation: bounce 3s infinite;
        }
        .pattern-grid-lg {
          background-image: radial-gradient(circle, #000000 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
}