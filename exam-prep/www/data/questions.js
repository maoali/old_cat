// 易错题题库 - 深圳小学六年级升初中
const QUESTIONS_DATA = [
    // =========== 数学题 ===========
    {
        id: 'q001', subject: 'math', chapter: 'math_02', type: 'choice', difficulty: 2, isCommonMistake: true,
        question: '计算：3/4 ÷ 3/8 = ?',
        options: ['A. 1/2', 'B. 9/32', 'C. 2', 'D. 8/9'],
        answer: 'C',
        explanation: '分数除法：除以一个分数等于乘以它的倒数。\n3/4 ÷ 3/8 = 3/4 × 8/3 = 24/12 = 2\n⚠️ 易错：很多同学误以为分子除分子、分母除分母，那是乘法化简的方法，不是除法！'
    },

    {
        id: 'q002', subject: 'math', chapter: 'math_02', type: 'choice', difficulty: 2, isCommonMistake: true,
        question: '一件商品先涨价20%，再降价20%，最终价格与原价相比：',
        options: ['A. 相同', 'B. 少4%', 'C. 少2%', 'D. 多4%'],
        answer: 'B',
        explanation: '原价设为100元。涨价20%后：100×1.2=120元。降价20%：120×0.8=96元。\n96<100，最终少了4元，即少4%。\n⚠️ 涨跌的基数不同！涨的基数是原价，降的基数是涨后的价，所以不能抵消！'
    },

    {
        id: 'q003', subject: 'math', chapter: 'math_04', type: 'choice', difficulty: 2, isCommonMistake: true,
        question: '圆的半径是3cm，它的面积是（ ）',
        options: ['A. 6π cm²', 'B. 9π cm²', 'C. 3π cm²', 'D. 18π cm²'],
        answer: 'B',
        explanation: '圆面积公式：S = πr² = π × 3² = 9π ≈ 28.26 cm²\n⚠️ 常见错误：把面积公式πr²和周长公式2πr混淆。\n周长 = 2π×3 = 6π，面积 = π×9 = 9π，注意区分！'
    },

    {
        id: 'q004', subject: 'math', chapter: 'math_03', type: 'choice', difficulty: 2, isCommonMistake: true,
        question: '在地图上，比例尺为1:2000000，量得两城市距离为3cm，两城市实际距离是：',
        options: ['A. 6000km', 'B. 60km', 'C. 6km', 'D. 600000m'],
        answer: 'B',
        explanation: '实际距离 = 图上距离 ÷ 比例尺 = 3cm ÷ (1/2000000) = 3×2000000 = 6000000cm = 60km\n⚠️ 注意单位换算：6000000cm = 60000m = 60km'
    },

    {
        id: 'q005', subject: 'math', chapter: 'math_02', type: 'choice', difficulty: 1, isCommonMistake: true,
        question: '下面哪个算式的结果是正确的？',
        options: ['A. 0.5×0.5=0.25', 'B. 0.5×0.5=0.05', 'C. 0.5×0.5=2.5', 'D. 0.5×0.5=0.50'],
        answer: 'A',
        explanation: '0.5×0.5：先按整数算5×5=25，两个因数各有1位小数，共2位小数，所以结果是0.25。\n⚠️ 易错：答案不是0.50（末尾0可忽略），也不是0.05（小数点位置数错）'
    },

    {
        id: 'q006', subject: 'math', chapter: 'math_01', type: 'choice', difficulty: 2, isCommonMistake: true,
        question: '计算：100 - (45 + 28) = ?',
        options: ['A. 27', 'B. -27', 'C. 73', 'D. 123'],
        answer: 'A',
        explanation: '100 - (45+28) = 100 - 73 = 27\n或者利用括号展开：=100-45-28=55-28=27\n⚠️ 易错：括号前是减号，去掉括号后里面各项要变号。有些同学错算成100-45+28=83'],

    { id:'q007', subject:'math', chapter:'math_05', type:'choice', difficulty:2, isCommonMistake:true,
        question:'数据：7, 8, 9, 10, 100。下列说法正确的是：',
        options: ['A. 平均数是9', 'B. 中位数是9', 'C. 众数是10', 'D. 平均数比中位数小'],
        answer:'B',
        explanation:'将数据从小到大排列：7,8,9,10,100。共5个数据，中间第3个是9，所以中位数=9。\n平均数=(7+8+9+10+100)÷5=134÷5=26.8\n⚠️ 这组数据中平均数26.8远大于中位数9！异常值（100）会严重拉大平均数。'},

    { id:'q008', subject:'math', chapter:'math_06', type:'choice', difficulty:1, isCommonMistake:true,
        question:'解方程：x - 8 = 25，x = ?',
        options: ['A. 17', 'B. 33', 'C. 13', 'D. -33'],
        answer:'B',
        explanation:'x - 8 = 25\n移项：x = 25 + 8 = 33\n⚠️ 易错：移项时一定要变号！-8移到右边变成+8，不是继续减8。错误解法：x=25-8=17'},

    { id:'q009', subject:'math', chapter:'math_04', type:'choice', difficulty:2, isCommonMistake:true,
        question:'等底等高的圆柱和圆锥，圆柱体积是圆锥体积的（ ）倍',
        options: ['A. 1/3', 'B. 3', 'C. 6', 'D. 2'],
        answer:'B',
        explanation:'圆柱体积 V₁ = πr²h；圆锥体积 V₂ = πr²h/3\n所以 V₁/V₂ = πr²h ÷ (πr²h/3) = 3\n⚠️ 口诀：等底等高，圆柱体积是圆锥的3倍；圆锥是圆柱的1/3'},

    { id:'q010', subject:'math', chapter:'math_02', type:'fillblank', difficulty:2, isCommonMistake:true,
        question:'把3/5化成百分数是___，把37.5%化成分数是___',
        answer:'60%；3/8',
        explanation:'3/5=3÷5=0.6=60%\n37.5%=37.5/100=375/1000=3/8（约分：÷125）\n⚠️ 百分数化分数步骤：去掉%→以100为分母→约分到最简'},

    { id:'q011', subject:'math', chapter:'math_03', type:'choice', difficulty:2, isCommonMistake:true,
        question:'化简比 2/3 : 4/5 = ?',
        options: ['A. 1/2', 'B. 2:4', 'C. 5:6', 'D. 10:12'],
        answer:'C',
        explanation:'2/3 : 4/5，通分法：两项同乘15（3和5的最小公倍数）\n= (2/3×15) : (4/5×15) = 10 : 12 = 5 : 6\n⚠️ 注意要化成最简整数比，10:12还需约分÷2'},

    { id:'q012', subject:'math', chapter:'math_04', type:'choice', difficulty:2, isCommonMistake:true,
        question:'一个梯形，上底4cm，下底6cm，高5cm，面积是：',
        options: ['A. 25cm²', 'B. 15cm²', 'C. 30cm²', 'D. 50cm²'],
        answer:'A',
        explanation:'梯形面积 = (上底+下底)×高÷2 = (4+6)×5÷2 = 10×5÷2 = 25cm²\n⚠️ 易错：有些同学忘记÷2，或者把"高"和"腰"混淆。高是两底之间的垂线距离！'},

    { id:'q013', subject:'math', chapter:'math_05', type:'choice', difficulty:1, isCommonMistake:false,
        question:'一个扇形统计图中某部分圆心角是90°，该部分占总数的：',
        options: ['A. 25%', 'B. 90%', 'C. 30%', 'D. 45%'],
        answer:'A',
        explanation:'百分比 = 圆心角 ÷ 360° = 90° ÷ 360° = 1/4 = 25%'},

    { id:'q014', subject:'math', chapter:'math_03', type:'choice', difficulty:2, isCommonMistake:true,
        question:'甲和乙的钱数之比是3:5，两人共有160元，甲有多少元？',
        options: ['A. 60元', 'B. 96元', 'C. 32元', 'D. 80元'],
        answer:'A',
        explanation:'甲占比=3/(3+5)=3/8\n甲的钱=160×3/8=60元\n⚠️ 按比例分配：先算各部分占总量的分数，再乘以总量'},

    { id:'q015', subject:'math', chapter:'math_04', type:'choice', difficulty:2, isCommonMistake:true,
        question:'下面哪三条线段不能组成三角形？',
        options: ['A. 3cm, 4cm, 5cm', 'B. 2cm, 3cm, 6cm', 'C. 5cm, 6cm, 7cm', 'D. 1cm, 2cm, 2cm'],
        answer:'B',
        explanation:'三角形成立条件：任意两边之和 > 第三边\nB组：2+3=5 < 6，不满足条件，不能构成三角形\n⚠️ 注意判断时要检查最短的两边之和是否大于最长边'},

    // =========== 语文题 ===========
    { id:'q101', subject:'chinese', chapter:'cn_01', type:'choice', difficulty:1, isCommonMistake:true,
        question:'"银行"中"行"的读音是：',
        options: ['A. xíng', 'B. háng', 'C. héng', 'D. hàng'],
        answer:'B',
        explanation:'"行"是多音字：\nháng：名词，如"银行""行业""同行（háng）"\nxíng：动词或形容词，如"行走""可行""旅行"\n⚠️ 记忆技巧：银行是一种机构（名词），所以读háng'},

    { id:'q102', subject:'chinese', chapter:'cn_01', type:'choice', difficulty:2, isCommonMistake:true,
        question:'下列词语中，"燥"字使用正确的是：',
        options: ['A. 嘈燥', 'B. 急燥', 'C. 干燥', 'D. 洗燥'],
        answer:'C',
        explanation:'"干燥"正确！\n燥（火旁，与干热有关）→干燥\n噪（口旁，与声音有关）→噪音、嘈噪\n躁（足旁，与动作情绪有关）→急躁、烦躁\n澡（氵旁，与水有关）→洗澡\n⚠️ 形近字辨析：记住各自的偏旁部首所代表的含义！'},

    { id:'q103', subject:'chinese', chapter:'cn_03', type:'choice', difficulty:2, isCommonMistake:true,
        question:'下列句子中没有语病的是：',
        options: ['A. 通过这次活动，使我们懂得了合作的重要性。', 'B. 我们要大约在三点钟左右到达。', 'C. 他是班级里最优秀的学生之一。', 'D. 老师和同学们都喜欢小明活泼的性格和品质。'],
        answer:'C',
        explanation:'A. 缺主语病句："通过...使..."双重介词导致主语缺失，应删掉"通过"或"使"\nB. 语义重复："大约"和"左右"意思重复，保留一个即可\nC. 正确！（"之一"表示多个中的一个，"最优秀的学生之一"不矛盾）\nD. 搭配不当："喜欢...品质"中性格可以喜欢，但"活泼的品质"搭配不当\n⚠️ 记住常见病句类型：缺主语、重复、搭配不当、逻辑矛盾'},

    { id:'q104', subject:'chinese', chapter:'cn_03', type:'choice', difficulty:1, isCommonMistake:true,
        question:'选择正确的词填写：他（　）地跑向终点。',
        options: ['A. 快乐的', 'B. 快乐地', 'C. 快乐得', 'D. 快快乐乐'],
        answer:'B',
        explanation:'"地"用在动词前，修饰动词（副词/形容词+地+动词）\n"快乐地跑"-→"地"后面是动词"跑"，所以用"地"\n⚠️ 口诀："的"后名词，"地"后动词，"得"后程度词'},

    { id:'q105', subject:'chinese', chapter:'cn_02', type:'choice', difficulty:3, isCommonMistake:true,
        question:'"差强人意"这个成语的意思是：',
        options: ['A. 非常令人满意', 'B. 勉强令人满意', 'C. 令人非常失望', 'D. 差一点就满意了'],
        answer:'B',
        explanation:'"差强人意"意思是：勉强使人满意，还过得去。\n"差"在这里读chā，是"勉强、大致"的意思，不是"很差"！\n⚠️ 这是典型的望文生义陷阱！很多人以为"差强人意"=很差，完全理解反了！'},

    { id:'q106', subject:'chinese', chapter:'cn_04', type:'fillblank', difficulty:2, isCommonMistake:false,
        question:'《石灰吟》的作者是___，朝代是___。诗句"粉骨碎身全不怕，___"',
        answer:'于谦；明代；要留清白在人间',
        explanation:'《石灰吟》—于谦（明朝）\n全诗：千锤万凿出深山，烈火焚烧若等闲。粉骨碎身全不怕，要留清白在人间。\n⚠️ 注意：于谦是明代诗人，不要混淆了其他朝代！'},

    { id:'q107', subject:'chinese', chapter:'cn_03', type:'choice', difficulty:2, isCommonMistake:true,
        question:'"弯弯的月亮像一把镰刀"使用的修辞手法是：',
        options: ['A. 拟人', 'B. 排比', 'C. 比喻', 'D. 夸张'],
        answer:'C',
        explanation:'这句话中"月亮"是本体，"镰刀"是喻体，用"像"连接，这是明喻，属于比喻修辞手法。\n⚠️ 注意区分比喻和拟人：\n比喻：A像B，本体喻体相似\n拟人：赋予事物人的特征（如"小草探出头来"）'},

    { id:'q108', subject:'chinese', chapter:'cn_01', type:'choice', difficulty:2, isCommonMistake:true,
        question:'"的、地、得"用法，选择填写正确的一项：他高兴（　）蹦了起来。',
        options: ['A. 的', 'B. 地', 'C. 得', 'D. 都可以'],
        answer:'C',
        explanation:'高兴（形容词）+得+蹦起来（程度/结果）\n"得"用在动词或形容词后面，补充说明程度或结果。\n"高兴"是形容词，"蹦起来"是结果，所以用"得"\n完整句：他高兴得蹦了起来。'},

    { id:'q109', subject:'chinese', chapter:'cn_05', type:'choice', difficulty:1, isCommonMistake:false,
        question:'下列说明方法中，"据统计，地球上约有875万种物种"所使用的是：',
        options: ['A. 举例子', 'B. 列数字', 'C. 作比较', 'D. 打比方'],
        answer:'B',
        explanation:'"约有875万种"—使用了具体数据来说明，这是"列数字"的说明方法。\n"列数字"的特征：使用具体的数字，让说明更准确精确。'},

    { id:'q110', subject:'chinese', chapter:'cn_02', type:'choice', difficulty:2, isCommonMistake:true,
        question:'"改进"与"改善"的区别，选用正确的一项：',
        options: ['A. 改进工作条件', 'B. 改善工作方法', 'C. 改进教学方法', 'D. 改进生活状况'],
        answer:'C',
        explanation:'"改进"：改变原来的方法、技术，使更好——针对方法、技术\n"改善"：使原有情况变好——针对状况、条件、关系\n⚠️ 记忆：改进→进（前进/技术），改善→善（状况改好）\nA应为"改善工作条件"，B应为"改进工作方法"，D应为"改善生活状况"'},

    // =========== 英语题 ===========
    { id:'q201', subject:'english', chapter:'en_01', type:'choice', difficulty:1, isCommonMistake:true,
        question:'动词 "go" 的过去式是：',
        options: ['A. goed', 'B. went', 'C. goed', 'D. goes'],
        answer:'B',
        explanation:'"go"是不规则动词，过去式是"went"。\n常见不规则动词记忆：go→went, come→came, see→saw, have→had\n⚠️ 不能说"goed"！go的过去式是不规则的，必须单独记忆。'},

    { id:'q202', subject:'english', chapter:'en_02', type:'choice', difficulty:2, isCommonMistake:true,
        question:'选择正确的冠词：I waited for ___ hour at the bus stop.',
        options: ['A. a', 'B. an', 'C. the', 'D. 不需要冠词'],
        answer:'B',
        explanation:'"hour"虽然以辅音字母"h"开头，但发音从元音/aʊ/开始（h不发音），所以用"an"。\nan hour /æn ˈaʊər/\n⚠️ 冠词选择看发音不看字母：an honest man, an umbrella, a university（/j/开头）'},

    { id:'q203', subject:'english', chapter:'en_02', type:'choice', difficulty:2, isCommonMistake:true,
        question:'选择正确的句子：',
        options: ['A. She like apples.', 'B. She likes apples.', 'C. She liking apples.', 'D. She liked apples every day.'],
        answer:'B',
        explanation:'"She"是第三人称单数，一般现在时中动词需要加"-s"或"-es"。\nShe likes（三单变化：like→likes）\n⚠️ 一般现在时三单（he/she/it/单数名词）必须加s！\nD.每天是习惯动作，用一般现在时，不用过去时'},

    { id:'q204', subject:'english', chapter:'en_01', type:'choice', difficulty:1, isCommonMistake:true,
        question:'"child"的复数是：',
        options: ['A. childs', 'B. childes', 'C. children', 'D. child'],
        answer:'C',
        explanation:'"child"是不规则名词，复数是"children"。\n常见不规则复数：\nchild→children, man→men, woman→women\nfoot→feet, tooth→teeth, mouse→mice\n⚠️ 不能说"childs"或"childes"！'},

    { id:'q205', subject:'english', chapter:'en_02', type:'choice', difficulty:2, isCommonMistake:true,
        question:'把"She goes to school."变为特殊疑问句"她去哪里？"正确的是：',
        options: ['A. Where she goes?', 'B. Where does she go?', 'C. Where she go?', 'D. Where do she goes?'],
        answer:'B',
        explanation:'特殊疑问句结构：疑问词 + 助动词 + 主语 + 动词原形\nWhere + does + she + go？\n⚠️ 注意：动词变回原形（去掉s），助动词does承担"第三单数"的语法功能'},

    { id:'q206', subject:'english', chapter:'en_02', type:'choice', difficulty:2, isCommonMistake:true,
        question:'下列划线词语用法正确的是：',
        options: ['A. I have a homework to do.', 'B. She gave me some advice.', 'C. There are many informations.', 'D. I need three breads.'],
        answer:'B',
        explanation:'"advice"（建议）是不可数名词，用"some advice"正确。\nA. homework不可数，不能用"a homework"，应说"some homework"\nC. information不可数，不说"informations"，应说"some information"\nD. bread不可数，不说"three breads"，应说"three pieces of bread"'},

    { id:'q207', subject:'english', chapter:'en_01', type:'choice', difficulty:2, isCommonMistake:true,
        question:'"good"的最高级是：',
        options: ['A. goodest', 'B. more good', 'C. most good', 'D. best'],
        answer:'D',
        explanation:'"good"是不规则形容词：good → better → best\n⚠️ 常见不规则形容词：\ngood→better→best\nbad→worse→worst\nmany/much→more→most\nlittle→less→least'},

    { id:'q208', subject:'english', chapter:'en_02', type:'choice', difficulty:1, isCommonMistake:true,
        question:'"read"的过去式发音是：',
        options: ['A. /riːd/（和原形一样）', 'B. /red/（像red颜色）', 'C. /reɪd/', 'D. /riːdɪd/'],
        answer:'B',
        explanation:'"read"的过去式拼写和原形相同，都是"read"，但发音不同！\n原形read：/riːd/（长音i）\n过去式read：/red/（短音e，和red颜色发音相同）\n⚠️ 这是英语中最容易混淆的单词之一！'},

    { id:'q209', subject:'english', chapter:'en_02', type:'choice', difficulty:2, isCommonMistake:true,
        question:'选择正确的比较级句子：',
        options: ['A. She is more tall than me.', 'B. She is taller than me.', 'C. She is taller than I am taller.', 'D. She is the taller in our class.'],
        answer:'B',
        explanation:'"tall"是一个音节的形容词，比较级直接加"-er"，不用"more"。\ntall→taller（比较级）→tallest（最高级）\n⚠️ 规则：\n1~2音节短词：+er/est\n多音节长词：more/most+形容词\nB. "She is taller than me."正确！'},

    { id:'q210', subject:'english', chapter:'en_01', type:'fillblank', difficulty:2, isCommonMistake:true,
        question:'写出下列动词的过去式：buy→___，teach→___，leave→___',
        answer:'bought；taught；left',
        explanation:'不规则动词过去式（必须记忆）：\nbuy→bought（购买）\nteach→taught（教）\nleave→left（离开）\n⚠️ 这三个动词都是不规则变化，不能加-ed！'}
];
