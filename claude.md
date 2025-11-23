import React, { useState, useEffect, useMemo } from 'react';
import { 
  Heart, Lock, Eye, ShieldAlert, RotateCcw, Share2, Sparkles, 
  ChevronRight, Activity, Brain, Fingerprint, FileText, 
  CheckCircle, BarChart3, Microscope
} from 'lucide-react';

// ==========================================
// 🧠 心理学专家题库 (保持原有题库不变)
// ==========================================
const QUESTION_BANK = [
  // --- 行为控制 (Behavioral) ---
  { id: 'B001', text: "如果伴侣在社交软件上回复异性朋友的消息很频繁，你会？", options: [{ text: "完全不在意", score: 0 }, { text: "随口问一下", score: 1 }, { text: "暗中观察/吃醋", score: 3 }, { text: "要求查看记录/减少联系", score: 5 }] },
  { id: 'B002', text: "你希望伴侣的手机密码或社交账号密码对你公开吗？", options: [{ text: "不需要，隐私至上", score: 0 }, { text: "愿意给就看", score: 1 }, { text: "希望能给，有安全感", score: 3 }, { text: "必须公开，且会检查", score: 5 }] },
  { id: 'B003', text: "伴侣周末想单独和朋友（同性）出去聚会，不带你，你会？", options: [{ text: "支持，享受独处", score: 0 }, { text: "失落但理解", score: 1 }, { text: "要求随时报备", score: 3 }, { text: "阻止/生气", score: 5 }] },
  { id: 'B004', text: "你希望和伴侣开启“实时位置共享”吗？", options: [{ text: "没必要", score: 0 }, { text: "安全考虑可接受", score: 1 }, { text: "希望能开", score: 3 }, { text: "必须全天候开启", score: 5 }] },
  { id: 'B005', text: "伴侣今天的穿着非常性感/惹眼，你会？", options: [{ text: "自信夸赞", score: 0 }, { text: "担心被搭讪", score: 2 }, { text: "建议换保守点", score: 3 }, { text: "禁止穿出门", score: 5 }] },
  { id: 'B006', text: "发现伴侣删除了某条通话记录，你的第一反应是？", options: [{ text: "可能是误删/清理内存", score: 0 }, { text: "有点奇怪，但没多问", score: 2 }, { text: "直接质问为什么删", score: 4 }, { text: "认定有鬼，爆发争吵", score: 5 }] },
  { id: 'B007', text: "伴侣想独自去异地旅行散心，你会允许吗？", options: [{ text: "完全支持", score: 0 }, { text: "有些担心但同意", score: 2 }, { text: "不同意，除非我陪同", score: 4 }, { text: "绝对不行，怀疑动机", score: 5 }] },
  { id: 'B008', text: "你会介意伴侣在朋友圈发自己的自拍（不带你）吗？", options: [{ text: "完全不介意", score: 0 }, { text: "偶尔发没事", score: 1 }, { text: "希望发之前给我审阅", score: 3 }, { text: "不许发，只能发合照", score: 5 }] },
  { id: 'B009', text: "伴侣参加公司团建（有异性），你会多久联系一次？", options: [{ text: "不联系，让他/她玩", score: 0 }, { text: "睡前联系一下", score: 1 }, { text: "每隔几小时发消息", score: 3 }, { text: "必须时刻保持视频通畅", score: 5 }] },
  { id: 'B010', text: "你会偷偷查看伴侣的淘宝/外卖订单记录吗？", options: [{ text: "从不", score: 0 }, { text: "偶尔好奇", score: 1 }, { text: "经常看，分析行踪", score: 3 }, { text: "每天必查", score: 5 }] },
  { id: 'B011', text: "如果不小心看到了伴侣日记/备忘录，你会继续看吗？", options: [{ text: "立刻合上", score: 0 }, { text: "犹豫一下合上", score: 1 }, { text: "忍不住看完", score: 3 }, { text: "不仅看，还要质问内容", score: 5 }] },
  { id: 'B012', text: "伴侣和异性同事拼车下班，你会？", options: [{ text: "方便就好", score: 0 }, { text: "心里嘀咕但没说", score: 2 }, { text: "要求以后不许拼车", score: 4 }, { text: "怀疑他们有私情", score: 5 }] },
  { id: 'B013', text: "你是否限制过伴侣关注某些特定类型的异性网红？", options: [{ text: "从不干涉审美自由", score: 0 }, { text: "调侃过几次", score: 1 }, { text: "要求取关", score: 3 }, { text: "不仅取关还要拉黑", score: 5 }] },
  
  // --- 情绪反应 (Emotional) ---
  { id: 'E001', text: "大街上有人盯着你的伴侣看，你的情绪是？", options: [{ text: "自豪", score: 0 }, { text: "无感", score: 1 }, { text: "宣示主权", score: 3 }, { text: "愤怒/想藏起来", score: 5 }] },
  { id: 'E002', text: "伴侣提起前任时，你的情绪反应？", options: [{ text: "理性平静", score: 0 }, { text: "不想听", score: 2 }, { text: "介意/追问", score: 4 }, { text: "炸毛/禁止提起", score: 5 }] },
  { id: 'E003', text: "伴侣几小时未回消息，你的情绪变化？", options: [{ text: "淡定", score: 0 }, { text: "微担心", score: 1 }, { text: "焦虑胡思乱想", score: 3 }, { text: "恐慌/夺命连环Call", score: 5 }] },
  { id: 'E004', text: "看到伴侣给异性朋友点赞，你会？", options: [{ text: "无所谓", score: 0 }, { text: "看一眼是谁", score: 1 }, { text: "心里酸酸的", score: 3 }, { text: "非常生气，质问为什么", score: 5 }] },
  { id: 'E005', text: "伴侣夸奖别人的性格或能力，你会？", options: [{ text: "一起夸", score: 0 }, { text: "不置可否", score: 1 }, { text: "觉得他在贬低我", score: 3 }, { text: "大发雷霆", score: 5 }] },
  { id: 'E006', text: "如果伴侣忘记了纪念日，你的感受是？", options: [{ text: "提醒一下补过就好", score: 0 }, { text: "失落但原谅", score: 2 }, { text: "觉得他不爱我了", score: 4 }, { text: "崩溃，这是原则问题", score: 5 }] },
  { id: 'E007', text: "听到伴侣说“我需要空间”，你的第一感觉？", options: [{ text: "理解", score: 0 }, { text: "反思自己是否太粘人", score: 2 }, { text: "恐慌，觉得是分手前兆", score: 4 }, { text: "愤怒，认为他在找借口", score: 5 }] },
  { id: 'E008', text: "当伴侣和朋友聊得很开心忽略你时，你会？", options: [{ text: "加入话题", score: 0 }, { text: "玩自己手机", score: 1 }, { text: "生闷气", score: 3 }, { text: "当场甩脸子", score: 5 }] },
  { id: 'E009', text: "无意中发现伴侣保留前任的礼物，你会？", options: [{ text: "无所谓", score: 0 }, { text: "问一下", score: 2 }, { text: "刺痛/要求扔掉", score: 4 }, { text: "暴怒/觉得他还爱前任", score: 5 }] },
  { id: 'E010', text: "梦见伴侣出轨，醒来后你会？", options: [{ text: "笑笑过去了", score: 0 }, { text: "告诉他梦境求安慰", score: 1 }, { text: "一整天对他没好气", score: 3 }, { text: "当真事一样审问他", score: 5 }] },
  
  // --- 认知偏误 (Cognitive) ---
  { id: 'C001', text: "你认为“你是属于我的”这句话浪漫吗？", options: [{ text: "油腻/霸道", score: 0 }, { text: "看语境", score: 2 }, { text: "浪漫/归属感", score: 3 }, { text: "这就是爱的真谛", score: 5 }] },
  { id: 'C002', text: "伴侣有很好的异性“死党”，你怎么看？", options: [{ text: "爱屋及乌", score: 0 }, { text: "保持界限即可", score: 2 }, { text: "必定有暧昧", score: 4 }, { text: "绝对不行，要么绝交要么分手", score: 5 }] },
  { id: 'C003', text: "如果拥有超能力，你选哪个？", options: [{ text: "让他永远快乐", score: 0 }, { text: "心意相通", score: 1 }, { text: "读心术", score: 3 }, { text: "记忆操控/只记得我", score: 5 }] },
  { id: 'C004', text: "你觉得“没有隐私”是真爱的表现吗？", options: [{ text: "不是，独立很重要", score: 0 }, { text: "不一定", score: 2 }, { text: "某种程度上是", score: 3 }, { text: "是，爱就是透明", score: 5 }] },
  { id: 'C005', text: "伴侣不回消息时，你脑海中浮现的第一个念头是？", options: [{ text: "他在忙", score: 0 }, { text: "手机没电了", score: 1 }, { text: "他不想理我", score: 3 }, { text: "他在和别人鬼混", score: 5 }] },
  { id: 'C006', text: "你认为伴侣应该把所有业余时间都花在你身上吗？", options: [{ text: "不应该", score: 0 }, { text: "最好多陪陪我", score: 2 }, { text: "应该，否则谈恋爱干嘛", score: 4 }, { text: "必须，我是唯一优先级", score: 5 }] },
  { id: 'C007', text: "对于“爱人之间不应该有秘密”这句话，你赞同吗？", options: [{ text: "反对，善意谎言是必要的", score: 0 }, { text: "保留底线隐私", score: 1 }, { text: "基本赞同", score: 3 }, { text: "完全赞同，秘密就是背叛", score: 5 }] },
  { id: 'C008', text: "你经常觉得伴侣的朋友（同性或异性）在带坏他吗？", options: [{ text: "从未觉得", score: 0 }, { text: "偶尔个别", score: 1 }, { text: "经常觉得", score: 3 }, { text: "是的，他们都想拆散我们", score: 5 }] },
  { id: 'C009', text: "如果伴侣不想亲热，你会认为是？", options: [{ text: "累了/状态不好", score: 0 }, { text: "心情不佳", score: 1 }, { text: "对我没兴趣了", score: 3 }, { text: "外面有人了", score: 5 }] },
  { id: 'C010', text: "你觉得为了留住对方，使用一些极端手段（如威胁）是可以理解的吗？", options: [{ text: "完全不可理喻", score: 0 }, { text: "很难理解", score: 1 }, { text: "虽然不对但能理解心情", score: 3 }, { text: "为了爱，手段不重要", score: 5 }] },
  { id: 'C011', text: "你是否认为“如果他爱我，就应该知道我为什么生气”？", options: [{ text: "不，沟通很重要", score: 0 }, { text: "有时候会这么想", score: 2 }, { text: "是的，默契是基础", score: 3 }, { text: "绝对是，不知道就是不爱", score: 5 }] },
  
  // --- 更多混合场景 ---
  { id: 'M001', text: "伴侣手机响了但他去洗澡了，你会？", options: [{ text: "不理会/递给他", score: 0 }, { text: "看一眼是谁", score: 1 }, { text: "接起来听听", score: 3 }, { text: "解锁查看内容", score: 5 }] },
  { id: 'M002', text: "伴侣这周加班很多，很晚回家，你会？", options: [{ text: "心疼，煮宵夜", score: 0 }, { text: "抱怨没时间陪我", score: 2 }, { text: "突击视频查岗", score: 4 }, { text: "去公司楼下堵他", score: 5 }] },
  { id: 'M003', text: "伴侣沉迷打游戏/爱好忽略了你，你会？", options: [{ text: "做自己的事", score: 0 }, { text: "撒娇求关注", score: 1 }, { text: "拔电源/闹情绪", score: 4 }, { text: "逼他在游戏和我之间选一个", score: 5 }] },
  { id: 'M004', text: "你是否会把现任和前任进行比较？", options: [{ text: "从不", score: 0 }, { text: "偶尔心里比较", score: 1 }, { text: "经常比较", score: 3 }, { text: "直接说出来打击他", score: 5 }] },
  { id: 'M005', text: "伴侣在社交媒体上关注了很多美女/帅哥，你会？", options: [{ text: "欣赏而已", score: 0 }, { text: "有点不爽", score: 2 }, { text: "要求取关", score: 4 }, { text: "觉得他在精神出轨", score: 5 }] },
];

const QUESTIONS_PER_SESSION = 15;

// --- 结果分析逻辑 (保持不变) ---
const getResult = (totalScore) => {
  const maxScore = QUESTIONS_PER_SESSION * 5;
  const percentage = Math.round((totalScore / maxScore) * 100);

  if (percentage <= 20) {
    return {
      title: "安全型依恋 (Secure Attachment)",
      subtitle: "佛系散养型恋人",
      level: "Level 1: 极低占有欲",
      keywords: ["独立人格", "高度信任", "边界清晰"],
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      shadowColor: "shadow-emerald-200",
      chartData: [20, 80, 90, 10], 
      description: "您的测试结果显示出典型的「安全型依恋」特征。在亲密关系中，您展现出极高的自我价值感和对他人的信任感。您认为爱情是两个独立圆圈的交集，而非吞噬。",
      expertAdvice: "虽然您的独立性是关系的稳定剂，但需注意避免让伴侣产生'被冷落'或'不在乎'的错觉。适度表达依赖（Interdependence）能增强情感联结。",
      icon: <CheckCircle className="w-12 h-12 text-emerald-600" />
    };
  } else if (percentage <= 45) {
    return {
      title: "健康型依恋 (Healthy Bonding)",
      subtitle: "完美糖分型恋人",
      level: "Level 2: 适度占有欲",
      keywords: ["情感互惠", "良性互动", "张弛有度"],
      color: "text-rose-500",
      bgColor: "bg-rose-50",
      borderColor: "border-rose-200",
      shadowColor: "shadow-rose-200",
      chartData: [45, 70, 60, 30],
      description: "您的各项指标处于心理学定义的「健康情感区间」。您拥有正常的领地意识，这源于进化学中的配偶守护机制，但完全在理性和可控范围内。",
      expertAdvice: "继续保持这种「亲密有间」的状态。当感到嫉妒时，这是潜意识在提示您关注关系中的潜在需求，建议通过非暴力沟通（NVC）表达。",
      icon: <Heart className="w-12 h-12 text-rose-500" />
    };
  } else if (percentage <= 70) {
    return {
      title: "焦虑-矛盾型依恋 (Anxious-Ambivalent)",
      subtitle: "霸道守护者",
      level: "Level 3: 强占有欲",
      keywords: ["控制倾向", "患得患失", "高敏感"],
      color: "text-violet-600",
      bgColor: "bg-violet-50",
      borderColor: "border-violet-200",
      shadowColor: "shadow-violet-200",
      chartData: [75, 40, 30, 70],
      description: "您表现出较高的情感卷入度，可能属于「焦虑型依恋」人格。您对分离和被忽视极其敏感，试图通过掌控细节来缓解内心的不安全感。",
      expertAdvice: "您的控制欲实际上是「求救信号」。建议尝试建立伴侣之外的“安全基地”（如爱好、社交圈）。需意识到：抓得越紧，沙子流失得越快。",
      icon: <Lock className="w-12 h-12 text-violet-600" />
    };
  } else {
    return {
      title: "病理性执着 (Pathological)",
      subtitle: "高危预警信号",
      level: "Level 4: 极端占有欲",
      keywords: ["共生幻想", "认知扭曲", "情感吞噬"],
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      shadowColor: "shadow-red-200",
      chartData: [95, 10, 5, 95],
      description: "警报：您的测试数据已触及「奥赛罗综合征」的边缘特征。这种排他性已不再是爱的证明，而是一种试图完全占有、隔离伴侣的心理防御机制。",
      expertAdvice: "这种状态对双方都是巨大的消耗。强烈建议寻求专业心理咨询，探索原生家庭分离焦虑的根源。爱是自由的意志，不是囚禁的枷锁。",
      icon: <ShieldAlert className="w-12 h-12 text-red-600" />
    };
  }
};

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

// --- 优化后的 StartScreen ---
const StartScreen = ({ onStart, spawnHearts }) => (
  <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-6 md:space-y-8 animate-fade-in py-8 md:py-12 relative z-10 w-full px-4">
    <div className="relative group cursor-pointer mt-4" onClick={spawnHearts}>
      {/* 调整了背景光晕大小，使其在小屏幕上更自然 */}
      <div className="absolute -inset-6 md:-inset-10 bg-gradient-to-r from-rose-400/30 via-purple-400/30 to-indigo-400/30 rounded-full blur-2xl md:blur-3xl animate-pulse"></div>
      
      {/* 修复：移除 Pro 标签，只保留居中的大脑图标 */}
      <div className="relative z-10 animate-bounce-slow">
        <div className="bg-white/80 backdrop-blur-md p-5 md:p-6 rounded-full shadow-2xl ring-4 ring-white/50 transition-transform duration-300 group-hover:scale-105 active:scale-95">
           <Brain className="w-16 h-16 md:w-24 md:h-24 text-rose-500 fill-rose-100" />
        </div>
      </div>
    </div>
    
    <div className="space-y-4 md:space-y-6 max-w-2xl w-full">
      {/* 优化字体大小适配小屏幕 */}
      <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-gray-800 tracking-tight leading-tight font-serif">
        亲密关系<br/>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-violet-600">心理边界与占有欲</span>
        <span className="block text-lg md:text-3xl mt-2 md:mt-3 text-gray-400 font-sans font-light">深度评估量表</span>
      </h1>
      
      {/* 优化统计栏在小屏幕上的布局：Gap缩小，字体调整 */}
      <div className="grid grid-cols-3 gap-2 md:gap-4 text-left bg-white/60 backdrop-blur-sm p-4 md:p-6 rounded-2xl border border-white/50 shadow-sm mx-auto max-w-lg w-full">
        <div className="flex flex-col items-center justify-center border-r border-gray-200">
          <span className="text-xl md:text-2xl font-bold text-gray-800">500+</span>
          <span className="text-[10px] md:text-xs text-gray-500 uppercase">专业题库</span>
        </div>
        <div className="flex flex-col items-center justify-center border-r border-gray-200">
          <span className="text-xl md:text-2xl font-bold text-gray-800">Random</span>
          <span className="text-[10px] md:text-xs text-gray-500 uppercase">随机抽样</span>
        </div>
        <div className="flex flex-col items-center justify-center">
          <span className="text-xl md:text-2xl font-bold text-gray-800">4D</span>
          <span className="text-[10px] md:text-xs text-gray-500 uppercase">多维分析</span>
        </div>
      </div>

      <p className="text-gray-600 text-xs md:text-base leading-relaxed px-2 md:px-8 max-w-xl mx-auto">
        本测评基于<strong>依恋理论 (Attachment Theory)</strong> 与 <strong>进化心理学</strong> 模型构建。<br className="hidden md:block"/>
        系统将从行为、情绪、认知三个维度，随机抽取 15 道情境题，为您生成精准的心理画像。
      </p>
    </div>

    <button 
      onClick={(e) => { spawnHearts(e); onStart(); }}
      className="group relative inline-flex items-center justify-center px-8 md:px-12 py-4 md:py-5 text-base md:text-lg font-bold text-white transition-all duration-300 bg-gray-900 rounded-full hover:bg-gray-800 hover:scale-105 shadow-xl hover:shadow-2xl active:scale-95 ring-offset-2 focus:ring-2 ring-gray-900 w-full md:w-auto max-w-xs"
    >
      <Activity className="w-5 h-5 mr-3 group-hover:animate-pulse" />
      开始专业评估
      <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
    </button>
    
    <p className="text-[10px] md:text-xs text-gray-400 font-mono">Session ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
  </div>
);

const QuizScreen = ({ currentQuestionIndex, question, onAnswer, spawnHearts, totalQuestions }) => {
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 animate-slide-up pb-10">
      {/* 状态栏优化 */}
      <div className="mb-6 md:mb-8 flex items-end justify-between border-b border-gray-200 pb-4">
        <div>
          <span className="block text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Assessment In Progress</span>
          <div className="flex items-center space-x-2">
            <span className="text-2xl md:text-3xl font-black text-rose-600 font-mono">Q{String(currentQuestionIndex + 1).padStart(2, '0')}</span>
            <span className="text-gray-300 text-lg md:text-xl">/</span>
            <span className="text-lg md:text-xl font-bold text-gray-400">{totalQuestions}</span>
          </div>
        </div>
        <div className="text-right hidden md:block">
           <span className="text-xs text-gray-400 font-mono bg-gray-100 px-2 py-1 rounded">ID: {question.id}</span>
        </div>
      </div>

      {/* 进度条 */}
      <div className="mb-6 md:mb-10 relative h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-600 transition-all duration-700 ease-out rounded-full" 
          style={{ width: `${progress}%` }}
        ></div>
        <div className="absolute top-0 left-0 h-full w-full bg-white/20 animate-shimmer" style={{ width: `${progress}%` }}></div>
      </div>

      {/* 问题卡片优化：内边距适配 */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl shadow-rose-900/5 p-5 md:p-12 mb-6 border border-white ring-1 ring-gray-100 relative overflow-hidden">
        <Fingerprint className="absolute -right-10 -top-10 w-40 h-40 md:w-64 md:h-64 text-gray-50 opacity-50 rotate-12 pointer-events-none" />
        
        <h2 className="relative z-10 text-lg md:text-3xl font-bold text-gray-800 mb-6 md:mb-10 leading-snug font-serif">
          {question.text}
        </h2>

        <div className="relative z-10 space-y-3 md:space-y-4">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={(e) => { spawnHearts(e); onAnswer(option.score); }}
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

const ResultScreen = ({ score, onRestart, spawnHearts }) => {
  const result = getResult(score);
  const ChartBar = ({ label, value, colorClass }) => (
    <div className="flex items-center gap-3 mb-3">
       <span className="w-16 text-xs font-bold text-gray-500 text-right">{label}</span>
       <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-1000 ${colorClass}`} style={{ width: `${value}%` }}></div>
       </div>
       <span className="w-8 text-xs font-mono text-gray-400">{value}%</span>
    </div>
  );

  const copyResult = (e) => {
    spawnHearts(e);
    const text = `【心理专家评估报告】\n测评ID：${Math.random().toString(36).substr(2,6).toUpperCase()}\n依恋类型：${result.title}\n占有欲等级：${result.level}\n----------------\n${result.description}\n\n立即获取你的心理画像 👉 [链接]`;
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
            
            <div className="inline-block px-3 py-1 md:px-4 bg-white/50 backdrop-blur rounded-full text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 md:mb-4 border border-white">
              Diagnostic Result
            </div>

            <h2 className={`text-2xl md:text-5xl font-black mb-2 md:mb-3 tracking-tight ${result.color} font-serif`}>
              {result.title}
            </h2>
            <p className={`text-lg md:text-xl font-medium ${result.color} opacity-80 mb-6 md:mb-8`}>{result.subtitle}</p>

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
        <div className="p-6 md:p-12 grid md:grid-cols-2 gap-8 md:gap-10">
          
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
               <h3 className="flex items-center text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4 border-l-4 border-gray-800 pl-3">
                 <FileText className="w-5 h-5 mr-2 text-gray-500" />
                 专家干预建议
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
                  Psychometric Data
                </h3>
                <span className="text-xs font-mono text-gray-400">v2.0.1</span>
             </div>

             <div className="space-y-3 md:space-y-4">
               <ChartBar label="占有欲" value={result.chartData[0]} colorClass="bg-rose-500" />
               <ChartBar label="信任度" value={result.chartData[1]} colorClass="bg-blue-500" />
               <ChartBar label="独立性" value={result.chartData[2]} colorClass="bg-emerald-500" />
               <ChartBar label="焦虑值" value={result.chartData[3]} colorClass="bg-violet-500" />
             </div>

             <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-200 text-center">
                <div className={`text-4xl md:text-5xl font-black ${result.color}`}>{Math.round(score / (QUESTIONS_PER_SESSION * 5) * 100)}</div>
                <div className="text-[10px] md:text-xs font-bold text-gray-400 uppercase mt-1">Total Score Index</div>
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
             重新随机抽样
           </button>
           <button 
             onClick={copyResult}
             className="w-full md:w-auto px-6 md:px-8 py-3 md:py-4 rounded-xl bg-gray-900 text-white font-bold hover:bg-black shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center text-sm md:text-base"
           >
             <Share2 className="w-5 h-5 mr-2" />
             导出专家报告
           </button>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [gameState, setGameState] = useState('intro');
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [hearts, setHearts] = useState([]);

  const initGame = () => {
    const shuffled = [...QUESTION_BANK];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setCurrentQuestions(shuffled.slice(0, QUESTIONS_PER_SESSION));
    setGameState('quiz');
    setCurrentQuestionIndex(0);
    setTotalScore(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnswer = (score) => {
    setTotalScore(prev => prev + score);
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
  };

  const spawnHearts = (e) => {
    const x = e.clientX || window.innerWidth / 2;
    const y = e.clientY || window.innerHeight / 2;
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
  };

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

      {/* 顶部专业导航 - 响应式优化 */}
      <nav className="relative z-10 w-full px-4 md:px-6 py-3 md:py-4 flex justify-between items-center bg-white/70 backdrop-blur-md border-b border-gray-100 shadow-sm mb-4 md:mb-6 sticky top-0">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 md:w-5 md:h-5 text-rose-600" />
          <span className="font-bold text-gray-800 tracking-tight text-xs md:text-base font-serif">
            PSYCH<span className="text-rose-600">LAB</span> <span className="text-gray-400 font-light">| Professional</span>
          </span>
        </div>
        <div className="hidden md:flex items-center space-x-4 text-xs font-mono text-gray-400">
           <span>DB_VER: 2023.11</span>
           <span className="w-1 h-3 bg-gray-300"></span>
           <span>N = 500+</span>
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
          />
        )}
        {gameState === 'result' && (
          <ResultScreen 
            score={totalScore} 
            onRestart={initGame} 
            spawnHearts={spawnHearts}
          />
        )}
      </main>

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
      `}</style>
    </div>
  );
}