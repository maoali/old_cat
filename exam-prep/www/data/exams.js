// 模拟试卷 - 深圳小学六年级
const EXAMS_DATA = [
    {
        id: 'exam_01',
        title: '深圳小学六年级升初中模拟试卷（一）',
        subject: 'math',
        subjectName: '数学',
        duration: 90,
        totalScore: 120,
        sections: [
            {
                id: 's1', name: '一、填空题（每题3分，共30分）', type: 'fillblank', score: 3,
                questions: [
                    { id: 'e1_01', question: '5/6 的分母是___，分子是___', answer: '6；5', points: 3 },
                    { id: 'e1_02', question: '把3/4化成百分数是___', answer: '75%', points: 3 },
                    { id: 'e1_03', question: '圆的半径为5cm，其面积为___（用π表示）', answer: '25π cm²', points: 3 },
                    { id: 'e1_04', question: '一个三角形两个角分别是45°和90°，第三个角是___', answer: '45°', points: 3 },
                    { id: 'e1_05', question: '比例尺1:500000，图上2cm代表实际___km', answer: '10km', points: 3 },
                    { id: 'e1_06', question: '数据3、5、7、7、8的中位数是___，众数是___', answer: '7；7', points: 3 },
                    { id: 'e1_07', question: '3/4 ÷ 1/2 = ___', answer: '3/2（或1½）', points: 3 },
                    { id: 'e1_08', question: '一个正方体棱长3cm，体积是___cm³', answer: '27', points: 3 },
                    { id: 'e1_09', question: '甲数与乙数的比是2:3，甲数是40，乙数是___', answer: '60', points: 3 },
                    { id: 'e1_10', question: '解方程 2x + 4 = 16，x = ___', answer: '6', points: 3 }
                ]
            },
            {
                id: 's2', name: '二、判断题（每题2分，共20分）', type: 'judge', score: 2,
                questions: [
                    { id: 'e2_01', question: '两个面积相等的图形，周长也一定相等。', answer: '×', points: 2, explanation: '错误！面积相等但形状不同，周长可以不相等。例：面积为4的图形可以是2×2的正方形（周长8）或4×1的长方形（周长10）' },
                    { id: 'e2_02', question: '等底等高的圆柱和圆锥，侧面积也相等。', answer: '×', points: 2, explanation: '错误！体积关系是圆柱=3×圆锥，但侧面积不一定相等。圆柱侧面积=2πrh，圆锥侧面积=πrl（l是母线长）' },
                    { id: 'e2_03', question: '一个数除以分数，商一定比这个数大。', answer: '×', points: 2, explanation: '错误！当被除数的分数>1时，商<被除数。例：6÷2=3<6' },
                    { id: 'e2_04', question: '分数的分子和分母同时乘以同一个数，分数大小不变。', answer: '√', points: 2, explanation: '正确！这是分数的基本性质。但这个数必须不为0。' },
                    { id: 'e2_05', question: '甲数比乙数多20%，则乙数比甲数少20%。', answer: '×', points: 2, explanation: '错误！基准量不同。设乙=100，甲=120，乙比甲少的是：(120-100)/120=1/6≈16.7%，不是20%！' },
                    { id: 'e2_06', question: '在比例尺中，比例尺越大，图上表示的实际范围越小。', answer: '√', points: 2, explanation: '正确！比例尺1:100比1:1000大，1:100中1cm代表1m（较小范围），1:1000中1cm代表10m（较大范围）' },
                    { id: 'e2_07', question: '任意三条线段都能组成三角形。', answer: '×', points: 2, explanation: '错误！三角形成立条件：任意两边之和必须大于第三边。如1、2、5就不能构成三角形（1+2=3<5）' },
                    { id: 'e2_08', question: '正方形是特殊的长方形。', answer: '√', points: 2, explanation: '正确！正方形满足长方形的所有条件（四个角都是直角，对边相等），同时四边也相等，所以是特殊的长方形。' },
                    { id: 'e2_09', question: '圆的面积公式是 C = 2πr。', answer: '×', points: 2, explanation: '错误！C=2πr是圆的周长公式，圆的面积公式是 S = πr²' },
                    { id: 'e2_10', question: '平均数一定在这组数据的最大值和最小值之间。', answer: '√', points: 2, explanation: '正确！平均数不可能小于最小值，也不可能大于最大值，一定在最大值和最小值之间（包含端点情况下所有值相同）。' }
                ]
            },
            {
                id: 's3', name: '三、选择题（每题3分，共30分）', type: 'choice', score: 3,
                questions: [
                    { id: 'e3_01', question: '下面各数中，最大的是：', options: ['A. 0.9', 'B. 8/9', 'C. 90%', 'D. 0.89'], answer: 'C', points: 3, explanation: '转化为小数比较：0.9=0.900，8/9≈0.889，90%=0.900，0.89=0.890\n90%=0.9与A相同，都是最大。（选C，因为90%=0.9是精确值，均为最大）' },
                    { id: 'e3_02', question: '一件衣服打八折后售价160元，原价是：', options: ['A. 128元', 'B. 192元', 'C. 200元', 'D. 208元'], answer: 'C', points: 3, explanation: '设原价为x，x×80%=160，x=160÷0.8=200元' },
                    { id: 'e3_03', question: '化简比15:25，结果是：', options: ['A. 15:25', 'B. 3:5', 'C. 0.6:1', 'D. 5:3'], answer: 'B', points: 3, explanation: '15:25，找最大公因数5，÷5得3:5' },
                    { id: 'e3_04', question: '下列图形中，周长最长的是（边长或半径相同，设a为单位长度）：', options: ['A. 边长a的正方形', 'B. 半径a的圆', 'C. 底和高都是a的等腰三角形', 'D. 边长a的正三角形'], answer: 'B', points: 3, explanation: '各图形周长：正方形4a，圆2πa≈6.28a，等腰三角形(两腰+底)≥3a，正三角形3a\n因此圆的周长最大' },
                    { id: 'e3_05', question: '从1~9的整数中随机取一个数，取到奇数的概率是：', options: ['A. 4/9', 'B. 5/9', 'C. 1/2', 'D. 1/9'], answer: 'B', points: 3, explanation: '1~9中奇数：1,3,5,7,9 共5个，总数9个\nP=5/9' },
                    { id: 'e3_06', question: '解方程 4(x-3) = 20，x = ：', options: ['A. 5', 'B. 8', 'C. 4.25', 'D. 2'], answer: 'B', points: 3, explanation: '4(x-3)=20，x-3=5，x=8' },
                    { id: 'e3_07', question: '下列哪种情况，速度和时间成反比例？', options: ['A. 匀速行驶时，路程和时间的关系', 'B. 总路程一定，速度和时间的关系', 'C. 单价一定，数量和总价的关系', 'D. 每小时耗油量一定，总耗油量和时间的关系'], answer: 'B', points: 3, explanation: '反比例：两量之积一定。总路程=速度×时间，总路程一定时，速度×时间=常数，所以成反比例' },
                    { id: 'e3_08', question: '一个圆柱形水杯，底面直径8cm，高12cm，侧面展开图的面积是：', options: ['A. 96π cm²', 'B. 48π cm²', 'C. 192π cm²', 'D. 24π cm²'], answer: 'A', points: 3, explanation: '侧面展开图是长方形\n宽=高=12cm，长=底面周长=πd=8π cm\n面积=8π×12=96π cm²' },
                    { id: 'e3_09', question: '下列各数中，能被2、3、5同时整除的是：', options: ['A. 120', 'B. 35', 'C. 60', 'D. 关系不正确，120和60都能'], answer: 'D', points: 3, explanation: '120：÷2=60✓，÷3=40✓，÷5=24✓\n60：÷2=30✓，÷3=20✓，÷5=12✓\n35：÷2不整除×\n所以120和60都能' },
                    { id: 'e3_10', question: '甲乙两人的钱数比是5:3，乙有42元，甲比乙多多少元？', options: ['A. 28元', 'B. 42元', 'C. 70元', 'D. 15元'], answer: 'A', points: 3, explanation: '乙=3份=42元，每份=14元。甲=5份=70元。甲比乙多70-42=28元' }
                ]
            },
            {
                id: 's4', name: '四、计算题（共20分）', type: 'solve', score: 0,
                questions: [
                    { id: 'e4_01', question: '计算：3/4 + 5/6 - 7/12', answer: '3/4+5/6-7/12=9/12+10/12-7/12=12/12=1', points: 5, explanation: '通分（12为最小公倍数）：9/12+10/12-7/12=12/12=1' },
                    { id: 'e4_02', question: '计算：2.4÷0.08×1.25', answer: '2.4÷0.08×1.25=30×1.25=37.5', points: 5, explanation: '先算除法：2.4÷0.08=240÷8=30；再算乘法：30×1.25=37.5' },
                    { id: 'e4_03', question: '解方程：5x - 3 = 2x + 12', answer: '5x-2x=12+3，3x=15，x=5', points: 5, explanation: '移项：5x-2x=12+3，3x=15，x=5，验算：5×5-3=22=2×5+12=22✓' },
                    { id: 'e4_04', question: '一个圆形花坛，直径为20m，求其面积（结果保留π）', answer: 'S=π×10²=100π≈314m²', points: 5, explanation: '半径=直径÷2=10m；面积S=πr²=π×100=100π≈314m²' }
                ]
            },
            {
                id: 's5', name: '五、应用题（共20分）', type: 'solve', score: 0,
                questions: [
                    { id: 'e5_01', question: '一辆汽车从A城到B城，去时速度60km/h，用了3小时；回来时用了4小时。回来时的速度是多少？去和回的平均速度是多少？', answer: 'AB距离=60×3=180km；回来速度=180÷4=45km/h；平均速度=总路程÷总时间=360÷7≈51.4km/h', points: 10, explanation: '注意：平均速度=总路程÷总时间，不是两速度的平均数！\n总路程=180×2=360km，总时间=3+4=7h，平均速度=360÷7≈51.4km/h' },
                    { id: 'e5_02', question: '一件商品，先涨价15%，再打八折出售，最终价格与原价相比是涨了还是降了？涨/降了百分之几？', answer: '设原价100，涨价后=115，打八折后=115×0.8=92，降了8%', points: 10, explanation: '设原价100元\n涨15%后：100×1.15=115元\n打八折：115×0.8=92元\n最终92元<100元，降价了（100-92）/100=8%。降了8%！\n⚠️ 注意：涨和降的基准不同，所以两次变化不能直接相加减' }
                ]
            }
        ]
    },
    {
        id: 'exam_02',
        title: '深圳小学六年级升初中模拟试卷（一）',
        subject: 'chinese',
        subjectName: '语文',
        duration: 90,
        totalScore: 120,
        sections: [
            {
                id: 'c1', name: '一、基础知识（共40分）', type: 'mixed', score: 0,
                questions: [
                    { id: 'c1_01', type: 'choice', question: '"行"在"银行"中读：', options: ['A. xíng', 'B. háng', 'C. héng', 'D. hǎng'], answer: 'B', points: 3, explanation: '银行（机构名词）→读háng；行走（动词）→读xíng' },
                    { id: 'c1_02', type: 'choice', question: '下列词语中没有错别字的一组是：', options: ['A. 急燥、干燥、噪音', 'B. 急躁、干燥、噪音', 'C. 急躁、干澡、噪音', 'D. 急躁、干燥、嘈燥'], answer: 'B', points: 3, explanation: '急躁（足旁）、干燥（火旁）、噪音（口旁）——偏旁决定含义' },
                    { id: 'c1_03', type: 'choice', question: '下面没有语病的一句是：', options: ['A. 大约三点钟左右他才来。', 'B. 他是我们班最优秀的同学之一。', 'C. 通过这件事，使我明白了道理。', 'D. 他的作文水平大大增加了。'], answer: 'B', points: 3, explanation: 'A：大约与左右重复；C：缺主语（通过+使，删其一）；D：水平用提高不用增加' },
                    { id: 'c1_04', type: 'choice', question: '"小草悄悄地探出头来，欣喜地望着世界。"这句话使用的修辞是：', options: ['A. 比喻', 'B. 排比', 'C. 拟人', 'D. 夸张'], answer: 'C', points: 3, explanation: '将小草赋予人的动作（探出头来）和情感（欣喜），这是拟人修辞。拟人不需要"像"字。' },
                    { id: 'c1_05', type: 'fillblank', question: '《竹石》的作者是___（朝代___）。诗句"咬定青山不放松，___"', answer: '郑燮（郑板桥）；清代；立根原在破岩中', points: 4, explanation: '《竹石》：咬定青山不放松，立根原在破岩中。千磨万击还坚劲，任尔东西南北风。——郑燮（清代）' },
                    { id: 'c1_06', type: 'fillblank', question: '依次填写"的、地、得"：美丽___花朵开___灿烂，让人高兴___跳起来。', answer: '的；得；得', points: 4, explanation: '美丽的（的+名词花朵）花朵开得（动词+得）灿烂（程度），让人高兴得（形容词+得）跳起来（结果）' },
                    { id: 'c1_07', type: 'choice', question: '"差强人意"的正确含义是：', options: ['A. 非常令人满意', 'B. 令人很失望', 'C. 勉强令人满意', 'D. 差一点令人满意'], answer: 'C', points: 3, explanation: '"差强人意"：差=勉强，意为"勉强使人满意"。这是典型的望文生义陷阱！' },
                    { id: 'c1_08', type: 'choice', question: '下列说法中正确的是：', options: ['A. 改进工作条件', 'B. 改善工作方法', 'C. 改善生活条件', 'D. 改进生活水平'], answer: 'C', points: 3, explanation: '改善（改变状况条件）→改善生活条件✓；改进（改变方法技术）→改进工作方法✓' }
                ]
            },
            {
                id: 'c2', name: '二、阅读理解（共40分）', type: 'reading', score: 0,
                passage: `【阅读短文】\n\n坚守的老人\n\n村口的老槐树下，每天清晨，李爷爷都会准时出现。他已经八十三岁了，腰微微地弯着，两手拄着那根陪了他几十年的竹拐杖。\n\n他在等什么？村里人都知道，他在等一封信。\n\n那是四十年前的事了。那年，他唯一的儿子响应国家号召，远赴边疆支援建设，临行前依依不舍地握着父亲的手说："爸，等我信，我会常写信回来的。"\n\n头几年，信果然来得勤。每逢村里邮递员的单车铃声响起，李爷爷的眼睛就亮了。后来，信渐渐少了，最后一封信来自十二年前。信上说，儿子在边疆结了婚，有了孩子，一切都好。再后来，就再没有消息了。\n\n村里有人劝他："老李，现在都用手机了，写信的人越来越少了，你儿子可能是用手机联系呢。"李爷爷总是微微地笑，也不争辩，依旧每天准时出现在老槐树下。\n\n那等待，已化为一种习惯，一种思念，一种爱。`,
                questions: [
                    { id: 'c2_01', question: '文章中李爷爷每天在槐树下等待的原因是什么？请用原文中的依据回答。', answer: '等儿子寄信。因为四十年前儿子临行前承诺"等我信，我会常写信回来的"，所以李爷爷坚持等待。', points: 8, explanation: '答题时要结合原文找依据，不能脱离文本凭空猜测。' },
                    { id: 'c2_02', question: '"每逢村里邮递员的单车铃声响起，李爷爷的眼睛就亮了。"这句话描写了什么？表达了什么感情？', answer: '这句话通过描写李爷爷的神态（眼睛亮了），表现了他听到邮递员来了时的激动和期盼，体现了他对儿子深深的思念之情。', points: 8, explanation: '神态描写分析：描写了什么（神态）+体现了什么感情（期盼/思念）' },
                    { id: 'c2_03', question: '文章最后说"那等待，已化为一种习惯，一种思念，一种爱。"请你说说这句话的含义。', answer: '这句话揭示了李爷爷几十年如一日等待的深刻原因——等待已不仅是等一封信，更是对儿子深沉的思念与爱的体现。这种日复一日的坚守，把对儿子的爱化为了生命中不可缺少的一部分。', points: 8, explanation: '理解句子：先分析字面意思，再联系文章主题，揭示深层含义（情感表达的方式）' },
                    { id: 'c2_04', question: '你觉得这位老人最打动你的是什么？请写3~4句感受。', answer: '示例：最打动我的是李爷爷几十年如一日的坚守。在现代通讯便利的时代，他仍选择用最传统的方式等待儿子的消息，那不仅仅是等一封信，更是对儿子深沉的爱与牵挂。这种父爱让我感受到亲情的伟大和人心中最本质的温柔。', points: 8, explanation: '开放性题目，言之有理即可得分。注意：要结合文章内容，不能空洞抒情。' },
                    { id: 'c2_05', question: '给本文拟一个标题，并说明理由（已有"坚守的老人"，请另拟一个）。', answer: '示例：《槐树下的思念》——以具体地点"槐树下"和情感"思念"为题，既点明故事发生的地点，又揭示了文章的情感主题，富有诗意，能引发读者的好奇与共鸣。', points: 8, explanation: '好标题要：概括全文内容、引发读者兴趣、与文章主题一致。' }
                ]
            },
            {
                id: 'c3', name: '三、习作（共40分）', type: 'essay', score: 0,
                questions: [
                    { id: 'c3_01', question: '【作文题目】\n题目：《那一刻，我长大了》或自拟题目\n\n要求：\n①写一篇不少于400字的记叙文\n②要有具体的事件，突出人物感受\n③运用至少两种修辞手法（比喻、拟人、排比等）\n④结构完整，有开头、经过、结尾\n\n【写作提示】\n可以写：第一次独立做某件事、帮助别人的经历、面对困难勇敢克服、一次比赛或考试的经历……', answer: '（学生自由作答，评分参考下方评分标准）', points: 40, explanation: '评分标准（满分40分）：\n内容充实（15分）：事件具体，有细节描写\n思想感情（10分）：主题鲜明，有成长感悟\n语言表达（10分）：语句通顺，运用修辞\n结构（5分）：开头结尾呼应，层次清晰' }
                ]
            }
        ]
    },
    {
        id: 'exam_03',
        title: '深圳小学六年级升初中模拟试卷（一）',
        subject: 'english',
        subjectName: '英语',
        duration: 60,
        totalScore: 100,
        sections: [
            {
                id: 'e1', name: 'Part 1: Vocabulary & Grammar（词汇和语法，40分）', type: 'mixed', score: 0,
                questions: [
                    { id: 'en1_01', type: 'choice', question: 'Choose the correct word: I waited for ___ hour.', options: ['A. a', 'B. an', 'C. the', 'D. /'], answer: 'B', points: 3, explanation: '"hour"以元音/aʊ/发音，所以用"an"。记住：看发音不看字母。' },
                    { id: 'en1_02', type: 'choice', question: 'She ___ to school every day.（一般现在时）', options: ['A. go', 'B. goes', 'C. going', 'D. went'], answer: 'B', points: 3, explanation: '"she"是第三人称单数，一般现在时动词加s：go→goes' },
                    { id: 'en1_03', type: 'choice', question: 'The past tense of "go" is ___', options: ['A. goed', 'B. goes', 'C. went', 'D. gone'], answer: 'C', points: 3, explanation: 'go是不规则动词，过去式是went（必须记忆）' },
                    { id: 'en1_04', type: 'choice', question: 'Tom is ___ than Mike.（tall）', options: ['A. tall', 'B. more tall', 'C. taller', 'D. tallest'], answer: 'C', points: 3, explanation: '"tall"是一音节形容词，比较级直接加-er：taller（比两者）' },
                    { id: 'en1_05', type: 'choice', question: 'The plural of "child" is ___', options: ['A. childs', 'B. childes', 'C. children', 'D. child'], answer: 'C', points: 3, explanation: 'child是不规则复数：child→children（必须记忆）' },
                    { id: 'en1_06', type: 'choice', question: 'I have ___ homework to do tonight.', options: ['A. a', 'B. many', 'C. a lot of', 'D. three'], answer: 'C', points: 3, explanation: 'homework是不可数名词，不能用"a"或数词，可用"a lot of/some/much"' },
                    { id: 'en1_07', type: 'choice', question: 'Where ___ she live?（特殊疑问句）', options: ['A. do', 'B. does', 'C. is', 'D. are'], answer: 'B', points: 3, explanation: 'she是三单，特殊疑问句用does：Where does she live?' },
                    { id: 'en1_08', type: 'choice', question: '"Read"的过去式的发音与下列哪个单词相同？', options: ['A. real', 'B. red', 'C. reed', 'D. ride'], answer: 'B', points: 3, explanation: 'read过去式发音/red/，与颜色"red"发音相同。拼写相同但发音不同！' },
                    { id: 'en1_09', type: 'fillblank', question: '写出下列动词的过去式: \nbuy→___, teach→___, leave→___', answer: 'bought; taught; left', points: 6, explanation: '不规则动词必须记忆：buy→bought，teach→taught，leave→left' },
                    { id: 'en1_10', type: 'fillblank', question: 'She is the ___ (tall) student in our class.', answer: 'tallest', points: 4, explanation: '最高级用于三个或以上比较，tall→tallest（+est），后接in+范围' },
                    { id: 'en1_11', type: 'choice', question: '"good"的最高级是：', options: ['A. goodest', 'B. more good', 'C. best', 'D. most good'], answer: 'C', points: 4, explanation: 'good是不规则形容词：good→better→best（必须记忆）' }
                ]
            },
            {
                id: 'e2', name: 'Part 2: Reading Comprehension（阅读理解，30分）', type: 'reading', score: 0,
                passage: `【Read the passage and answer the questions】\n\nMy name is Lisa. I am 12 years old and I am in Grade 6. Every morning, I get up at 6:30 and have breakfast with my family. My favorite subject is English because I love reading stories in English.\n\nLast weekend, my parents took me to the Science Museum. We saw many interesting things there. I learned about space and planets. My favorite part was the rocket model—it was huge! We stayed there for three hours.\n\nNext summer, I want to visit Beijing with my family. I have never been there before. I hope we can see the Great Wall and the Forbidden City. I think it will be a wonderful trip!`,
                questions: [
                    { id: 'en2_01', question: 'How old is Lisa?', answer: 'She is 12 years old.', points: 5, explanation: '原文：I am 12 years old' },
                    { id: 'en2_02', question: 'What is Lisa\'s favorite subject? Why?', answer: 'Her favorite subject is English, because she loves reading stories in English.', points: 5, explanation: '原文：My favorite subject is English because I love reading stories in English.' },
                    { id: 'en2_03', question: 'What did Lisa do last weekend?', answer: 'She went to the Science Museum with her parents.', points: 5, explanation: '原文：my parents took me to the Science Museum' },
                    { id: 'en2_04', question: 'Has Lisa visited Beijing before? How do you know?', answer: 'No, she has never visited Beijing before. We know because she says "I have never been there before."', points: 5, explanation: '现在完成时"have never been"表示过去到现在从未去过' },
                    { id: 'en2_05', question: 'What does Lisa hope to see in Beijing?（Write TWO things）', answer: 'She hopes to see the Great Wall and the Forbidden City.', points: 5, explanation: '原文：we can see the Great Wall and the Forbidden City' },
                    { id: 'en2_06', question: 'True(T) or False(F): Lisa visited the rocket model for three hours.', options: ['T', 'F'], answer: 'F', points: 5, explanation: 'Lisa在博物馆呆了3小时（We stayed there for three hours），但不是只看火箭模型花了3小时。' }
                ]
            },
            {
                id: 'e3', name: 'Part 3: Writing（写作，30分）', type: 'essay', score: 0,
                questions: [
                    { id: 'en3_01', question: 'Writing Task:\n\nWrite about your favorite weekend activity in about 60-80 words.\n\nYou may include:\n- What the activity is\n- When and where you do it\n- Why you like it\n- Who you do it with', answer: '（学生自由作答）', points: 15, explanation: '评分要点：内容完整（5分）、语法正确（5分）、语言流畅（5分）' },
                    { id: 'en3_02', question: 'Sentence Transformation:\n(1) She goes to school by bus.（改为一般疑问句）\n(2) He is the tallest boy in the class.（划线部分对应的特殊疑问句）\n(3) I bought a book yesterday.（改为否定句）', answer: '(1) Does she go to school by bus?\n(2) Who is the tallest boy in the class?\n(3) I did not (didn\'t) buy a book yesterday.', points: 15, explanation: '(1)三单疑问句：Does提前，动词变原形；(2)对人划线用Who；(3)否定句：did not+动词原形' }
                ]
            }
        ]
    }
];
