// 模拟试卷 - 深圳小学六年级
const EXAMS_DATA = [
    {
        id: 'exam_01',
        title: '数学模拟试卷（一）',
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
        title: '语文模拟试卷（一）',
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
        title: '英语模拟试卷（一）',
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
    },
    // ===================== 数学（二）=====================
    {
        id: 'exam_math_02',
        title: '数学模拟试卷（二）',
        subject: 'math',
        subjectName: '数学',
        duration: 90,
        totalScore: 120,
        sections: [
            {
                id: 'm2_s1', name: '一、填空题（每题3分，共30分）', type: 'fillblank', score: 3,
                questions: [
                    { id: 'm2_01', question: '最小的质数是___，最小的合数是___', answer: '2；4', points: 3, explanation: '质数只有1和本身两个因数，最小质数是2；合数有两个以上因数，最小合数是4' },
                    { id: 'm2_02', question: '1.25的分数形式是___，化简后是___', answer: '125/100；5/4', points: 3, explanation: '1.25=125/100，约分：÷25=5/4' },
                    { id: 'm2_03', question: '一个圆柱底面直径6cm，高10cm，体积是___cm³(用π)', answer: '90π', points: 3, explanation: 'V=πr²h=π×3²×10=90π' },
                    { id: 'm2_04', question: '12和18的最大公因数是___，最小公倍数是___', answer: '6；36', points: 3, explanation: '12=2²×3，18=2×3²；最大公因数=2×3=6；最小公倍数=2²×3²=36' },
                    { id: 'm2_05', question: '一列数：2, 4, 8, 16, ___，下一个数是___', answer: '32', points: 3, explanation: '规律是每项×2，16×2=32' },
                    { id: 'm2_06', question: '5/8 + 3/4 = ___（化简）', answer: '11/8（或1又3/8）', points: 3, explanation: '通分：5/8+6/8=11/8' },
                    { id: 'm2_07', question: '解方程：3(x+2)=21，x=___', answer: '5', points: 3, explanation: 'x+2=7，x=5' },
                    { id: 'm2_08', question: '一个等腰三角形，底边8cm，周长26cm，腰长___cm', answer: '9', points: 3, explanation: '两腰=(26-8)÷2=9cm' },
                    { id: 'm2_09', question: '40%写成小数是___，写成分数（最简）是___', answer: '0.4；2/5', points: 3, explanation: '40%=0.4=40/100=2/5' },
                    { id: 'm2_10', question: '速度80km/h，行驶2.5小时，路程___km', answer: '200', points: 3, explanation: '路程=速度×时间=80×2.5=200km' }
                ]
            },
            {
                id: 'm2_s2', name: '二、判断与选择（共40分）', type: 'mixed', score: 0,
                questions: [
                    { id: 'm2_11', type: 'judge', question: '圆锥的体积是等底等高圆柱体积的1/3。', answer: '√', points: 3, explanation: 'V圆锥=1/3×V圆柱，这是公式结论' },
                    { id: 'm2_12', type: 'judge', question: '两个质数的积一定是合数。', answer: '√', points: 3, explanation: '两个质数p、q的积p×q有1、p、q、pq四个因数，大于2个，是合数' },
                    { id: 'm2_13', type: 'judge', question: '0是偶数。', answer: '√', points: 3, explanation: '0能被2整除（0÷2=0），所以0是偶数' },
                    { id: 'm2_14', type: 'judge', question: '所有的偶数都是合数。', answer: '×', points: 3, explanation: '2是偶数，但2是质数（只有1和2两个因数）' },
                    { id: 'm2_15', type: 'choice', question: '一个长方体，长8cm、宽5cm、高4cm，表面积是：', options: ['A. 160cm²', 'B. 184cm²', 'C. 160cm³', 'D. 200cm²'], answer: 'B', points: 4, explanation: 'S=2(lb+lh+bh)=2(40+32+20)=2×92=184cm²' },
                    { id: 'm2_16', type: 'choice', question: '甲做一件工作需要6天，乙需要4天，两人合做几天完成？', options: ['A. 5天', 'B. 2.4天', 'C. 3天', 'D. 10天'], answer: 'B', points: 4, explanation: '甲效率1/6，乙1/4，合做效率1/6+1/4=5/12，天数=1÷5/12=12/5=2.4天' },
                    { id: 'm2_17', type: 'choice', question: '若x:6=4:3，则x=', options: ['A. 6', 'B. 8', 'C. 4.5', 'D. 2'], answer: 'B', points: 4, explanation: 'x×3=6×4，3x=24，x=8' },
                    { id: 'm2_18', type: 'choice', question: '一堆苹果，取走40%后还剩48个，原有多少个？', options: ['A. 60', 'B. 80', 'C. 67', 'D. 120'], answer: 'B', points: 4, explanation: '60%对应48个，原来=48÷60%=80个' },
                    { id: 'm2_19', type: 'choice', question: '数据组5,3,8,6,4的平均数与中位数分别是：', options: ['A. 平均5，中位5', 'B. 平均5.2，中位5', 'C. 平均5，中位6', 'D. 平均5.2，中位6'], answer: 'B', points: 4, explanation: '平均数=(5+3+8+6+4)÷5=26÷5=5.2；排序3,4,5,6,8，中位数=5' },
                    { id: 'm2_20', type: 'choice', question: '一个扇形中心角90°，半径6cm，弧长是：', options: ['A. 3π cm', 'B. 6π cm', 'C. 9π cm', 'D. 12π cm'], answer: 'A', points: 4, explanation: '弧长=2πr×(90/360)=2π×6×1/4=3π cm' }
                ]
            },
            {
                id: 'm2_s3', name: '三、解答题（共50分）', type: 'solve', score: 0,
                questions: [
                    { id: 'm2_21', question: '计算：(3/4 - 1/6) × 2 + 5/12', answer: '(9/12-2/12)×2+5/12=7/12×2+5/12=14/12+5/12=19/12', points: 10, explanation: '先算括号，通分后7/12；×2=14/12；再+5/12=19/12' },
                    { id: 'm2_22', question: '某校六年级共240人，数学成绩优秀的占37.5%，良好的占45%，其余不及格。求三个等级各多少人？', answer: '优秀=240×37.5%=90人；良好=240×45%=108人；不及格=240-90-108=42人', points: 15, explanation: '分别用总人数×对应百分比' },
                    { id: 'm2_23', question: '一个梯形，上底6cm，下底14cm，高8cm。求面积。若沿高对折，能拼成什么图形？面积是多少？', answer: '梯形面积=(6+14)×8÷2=80cm²；沿高对折拼成一个平行四边形，面积不变=80cm²', points: 15, explanation: '梯形面积公式：(上底+下底)×高÷2；对折拼合，总面积不变' },
                    { id: 'm2_24', question: '甲乙两城相距420km，一辆汽车从甲城出发，前2小时速度80km/h，后来提速，共用5小时到达乙城。后段平均速度是多少？', answer: '前段路程=80×2=160km；后段路程=420-160=260km；后段时间=5-2=3h；后段速度=260÷3≈86.7km/h', points: 10, explanation: '分段计算路程和时间，再求速度' }
                ]
            }
        ]
    },
    // ===================== 数学（三）=====================
    {
        id: 'exam_math_03',
        title: '数学模拟试卷（三）',
        subject: 'math',
        subjectName: '数学',
        duration: 90,
        totalScore: 120,
        sections: [
            {
                id: 'm3_s1', name: '一、填空题（每题3分，共30分）', type: 'fillblank', score: 3,
                questions: [
                    { id: 'm3_01', question: '2026年是___年（闰年/平年），共___天', answer: '平年；365', points: 3, explanation: '2026÷4=506余2，不能被4整除，是平年，365天' },
                    { id: 'm3_02', question: '0.375化成最简分数是___', answer: '3/8', points: 3, explanation: '0.375=375/1000，约分：÷125=3/8' },
                    { id: 'm3_03', question: '一个圆的面积是25π cm²，其直径是___cm', answer: '10', points: 3, explanation: 'πr²=25π，r²=25，r=5，直径=10cm' },
                    { id: 'm3_04', question: '在1到20的整数中，质数共有___个', answer: '8', points: 3, explanation: '质数：2,3,5,7,11,13,17,19，共8个' },
                    { id: 'm3_05', question: '一个数的30%是24，这个数是___', answer: '80', points: 3, explanation: 'x×30%=24，x=24÷0.3=80' },
                    { id: 'm3_06', question: '(-3)的绝对值是___；+5和-5在数轴上距离原点___格', answer: '3；5', points: 3, explanation: '绝对值取非负值；正负5距原点各5格' },
                    { id: 'm3_07', question: '等差数列 2, 5, 8, 11, ___，第10项是___', answer: '14；29', points: 3, explanation: '公差3；第10项=2+(10-1)×3=29' },
                    { id: 'm3_08', question: '正六边形内角和是___°，每个内角___°', answer: '720；120', points: 3, explanation: 'n边形内角和=(n-2)×180；六边形=(6-2)×180=720°；每角=720÷6=120°' },
                    { id: 'm3_09', question: '水池容积600L，水龙头每分钟注水25L，___分钟注满', answer: '24', points: 3, explanation: '600÷25=24分钟' },
                    { id: 'm3_10', question: '两数之积是360，最大公因数是12，最小公倍数是___', answer: '30', points: 3, explanation: '两数之积=最大公因数×最小公倍数，360=12×最小公倍数，最小公倍数=30' }
                ]
            },
            {
                id: 'm3_s2', name: '二、判断与选择（共40分）', type: 'mixed', score: 0,
                questions: [
                    { id: 'm3_11', type: 'judge', question: '小数点后面的零可以去掉，不影响大小。', answer: '√', points: 3, explanation: '小数末尾的零去掉后数值不变，如5.30=5.3' },
                    { id: 'm3_12', type: 'judge', question: '两个数的最大公因数一定小于这两个数。', answer: '×', points: 3, explanation: '当两数相等时，最大公因数等于本身。如6和6的最大公因数是6' },
                    { id: 'm3_13', type: 'judge', question: '圆柱体侧面展开图一定是长方形。', answer: '√', points: 3, explanation: '圆柱侧面展开：长=底面周长，宽=高，是长方形（正方形是特殊长方形）' },
                    { id: 'm3_14', type: 'judge', question: '负数一定比正数小。', answer: '√', points: 3, explanation: '在数轴上负数在0左边，正数在0右边，负数一定小于正数' },
                    { id: 'm3_15', type: 'choice', question: '一件商品成本80元，按成本的125%定价，打九折出售，实际售价是：', options: ['A. 90元', 'B. 80元', 'C. 100元', 'D. 112元'], answer: 'A', points: 4, explanation: '定价=80×125%=100元；打九折=100×90%=90元' },
                    { id: 'm3_16', type: 'choice', question: '六个连续偶数之和为78，最小的偶数是：', options: ['A. 8', 'B. 10', 'C. 12', 'D. 6'], answer: 'A', points: 4, explanation: '设最小为x，x+(x+2)+(x+4)+(x+6)+(x+8)+(x+10)=78，6x+30=78，x=8' },
                    { id: 'm3_17', type: 'choice', question: '一根绳子，第一次用去1/3，第二次用去余下的1/4，还剩多少？', options: ['A. 5/12', 'B. 1/2', 'C. 1/4', 'D. 7/12'], answer: 'B', points: 4, explanation: '剩(1-1/3)=2/3；再用2/3×1/4=1/6；剩2/3-1/6=4/6-1/6=3/6=1/2' },
                    { id: 'm3_18', type: 'choice', question: '图表数据：2020:30,2021:36,2022:24,2023:48。平均每年增长最适合用哪种图表？', options: ['A. 饼图', 'B. 折线统计图', 'C. 条形图', 'D. 散点图'], answer: 'B', points: 4, explanation: '折线图最善于表示数据随时间的变化趋势' },
                    { id: 'm3_19', type: 'choice', question: '如果a和b互为质数（最大公因数是1），以下一定正确的是：', options: ['A. a和b都是质数', 'B. a×b是它们的最小公倍数', 'C. a+b是偶数', 'D. a-b=1'], answer: 'B', points: 4, explanation: '互质时，最小公倍数=两数之积（a×b）。互质不代表两者都是质数，如4和9互质' },
                    { id: 'm3_20', type: 'choice', question: '一个正方形和一个圆面积相等，设正方形周长为L，圆的周长约为：', options: ['A. 大于L', 'B. 等于L', 'C. 小于L', 'D. 不确定'], answer: 'C', points: 4, explanation: '设正方形边长a，面积a²；圆面积=πr²=a²，r=a/√π；圆周长=2πr=2π×a/√π=2a√π≈2a×1.772=3.54a<4a=L' }
                ]
            },
            {
                id: 'm3_s3', name: '三、解答题（共50分）', type: 'solve', score: 0,
                questions: [
                    { id: 'm3_21', question: '计算：2¼ ÷ 1½ × 4/5（带分数转假分数后计算）', answer: '2¼=9/4，1½=3/2；9/4÷3/2×4/5=9/4×2/3×4/5=72/60=6/5=1⅕', points: 10, explanation: '除以分数变乘以倒数：9/4×2/3=18/12=3/2；×4/5=12/10=6/5' },
                    { id: 'm3_22', question: '5年前，父亲年龄是儿子的4倍。今年父亲42岁，儿子今年多大？', answer: '设今年儿子x，5年前父亲=42-5=37，5年前儿子=x-5；37=4(x-5)；37=4x-20；4x=57；x≈14岁', points: 15, explanation: '方程法：5年前父亲37=4×儿子，先求年前儿子年龄再+5就是今年' },
                    { id: 'm3_23', question: '一个游泳池长50m、宽25m、深2m。（1）求池的容积（m³）；（2）若往池内注水，水管每小时注水100m³，需多少小时注满？', answer: '(1)容积=50×25×2=2500m³；(2)时间=2500÷100=25小时', points: 15, explanation: '长方体V=长×宽×高；时间=总量÷速度' },
                    { id: 'm3_24', question: '一次考试，全班40人，平均分76。男生25人平均74分，女生平均几分？', answer: '总分=40×76=3040；男生总分=25×74=1850；女生总分=3040-1850=1190；女生人数=40-25=15；女生平均=1190÷15≈79.3分', points: 10, explanation: '总分-男生总分=女生总分；再除以女生人数' }
                ]
            }
        ]
    },
    // ===================== 语文（二）=====================
    {
        id: 'exam_chinese_02',
        title: '语文模拟试卷（二）',
        subject: 'chinese',
        subjectName: '语文',
        duration: 90,
        totalScore: 120,
        sections: [
            {
                id: 'ch2_s1', name: '一、基础知识（共40分）', type: 'mixed', score: 0,
                questions: [
                    { id: 'ch2_01', type: 'choice', question: '"重"在"重量"中读：', options: ['A. zhòng', 'B. chóng', 'C. zhǒng', 'D. chōng'], answer: 'A', points: 3, explanation: '重量（名词）→读zhòng；重复（再次）→读chóng' },
                    { id: 'ch2_02', type: 'choice', question: '下列词语书写完全正确的是：', options: ['A. 再接再厉', 'B. 再接再励', 'C. 再结再厉', 'D. 在接再厉'], answer: 'A', points: 3, explanation: '再接再厉：厉=磨砺，形容继续努力。励=鼓励，此处用厉' },
                    { id: 'ch2_03', type: 'choice', question: '下列句子中，关联词使用正确的是：', options: ['A. 虽然我努力了，但是我失败了。', 'B. 只要你努力，而且会成功。', 'C. 因为下雨，所以出去玩。', 'D. 不但天黑了，而且路滑了。'], answer: 'A', points: 3, explanation: 'A：虽然…但是=转折关系✓；B：只要…就（非而且）；C：因果关系逻辑有问题；D：不但…而且=递进关系，句子语义不对' },
                    { id: 'ch2_04', type: 'choice', question: '"春蚕到死丝方尽，蜡炬成灰泪始干"使用的修辞是：', options: ['A. 比喻+夸张', 'B. 对偶+比喻', 'C. 拟人+排比', 'D. 对偶+夸张'], answer: 'B', points: 3, explanation: '两句结构对称=对偶；用春蚕吐丝、蜡烛燃泪比喻人的付出=比喻' },
                    { id: 'ch2_05', type: 'fillblank', question: '默写：《示儿》陆游：死去元知___，但悲不见___。王师北定___，家祭无忘___。', answer: '万事空；九州同；中原日；告乃翁', points: 4, explanation: '《示儿》：死去元知万事空，但悲不见九州同。王师北定中原日，家祭无忘告乃翁。——陆游（宋）' },
                    { id: 'ch2_06', type: 'fillblank', question: '缩句练习：蓝蓝的天空中飘着几朵洁白的云彩。→（保留主谓宾）', answer: '天空中飘着云彩', points: 4, explanation: '缩句去掉修饰成分（蓝蓝的、几朵、洁白的），留主干' },
                    { id: 'ch2_07', type: 'choice', question: '"望穿秋水"的意思是：', options: ['A. 秋天水清能望穿', 'B. 形容盼望极为迫切', 'C. 形容秋天水多', 'D. 比喻目光犀利'], answer: 'B', points: 3, explanation: '"望穿秋水"形容望眼欲穿，盼望十分迫切' },
                    { id: 'ch2_08', type: 'choice', question: '下面哪项属于说明文的说明方法：', options: ['A. 比喻', 'B. 拟人', 'C. 列数字', 'D. 夸张'], answer: 'C', points: 3, explanation: '说明方法：举例子、列数字、作比较、打比方、下定义等；比喻/拟人/夸张属于修辞手法' }
                ]
            },
            {
                id: 'ch2_s2', name: '二、阅读理解（共40分）', type: 'reading', score: 0,
                passage: '【阅读短文】\n\n荷叶·母亲\n\n父亲的朋友送给我们两缸荷花，一缸是红的，一缸是白的。\n\n今晚，雨打得我窗外荷花声音特别清脆。忽然看见红莲旁边的一个大荷叶，慢慢地倾侧了来，正覆盖在红莲上面……我不宁的心境散尽了！\n\n雨势并不减退，红莲却不动摇了。雨点不住地打着，只能在那勇敢慈怜的荷叶上面，聚了些流转无力的水珠。\n\n我心中深深地受了感动——\n\n母亲啊！你是荷叶，我是红莲。心中的雨点来了，除了你，谁是我在无遮拦天空下的荫蔽？\n\n——冰心《荷叶·母亲》',
                questions: [
                    { id: 'ch2_09', question: '"雨点不住地打着，只能在那勇敢慈怜的荷叶上面，聚了些流转无力的水珠。"这句话中，"勇敢慈怜"是在形容谁？体现了什么？', answer: '形容荷叶（象征母亲）。体现了母亲勇于保护孩子、充满慈爱的精神。', points: 8 },
                    { id: 'ch2_10', question: '文章最后作者将自己比作红莲，将母亲比作荷叶，这样写有什么好处？', answer: '用荷叶护莲比喻母亲保护孩子，将抽象的母爱具体化、形象化，读来生动感人，让读者更容易感受到母爱的伟大。', points: 8 },
                    { id: 'ch2_11', question: '"心中的雨点"比喻什么？"荫蔽"在文中是什么意思？', answer: '"心中的雨点"比喻生活中遇到的困难、挫折和烦恼；"荫蔽"指遮挡风雨、给予保护和慰藉。', points: 8 },
                    { id: 'ch2_12', question: '本文表达了作者怎样的感情？请结合文章内容简要分析。', answer: '表达了作者对母亲深深的依恋和感激之情。通过观察荷叶护莲的场景联想到母爱，自然地抒发了对母亲无私保护、不求回报的爱的赞颂与感谢。', points: 8 },
                    { id: 'ch2_13', question: '给文章最后一段加一个省略号（……）改写，并说明省略了什么内容。', answer: '示例："母亲啊！你是荷叶，我是红莲……"省略了作者内心无法言说的对母亲深厚的感激和依赖，留给读者无尽的想象空间。', points: 8 }
                ]
            },
            {
                id: 'ch2_s3', name: '三、习作（共40分）', type: 'essay', score: 0,
                questions: [
                    { id: 'ch2_14', question: '【作文题目】\n题目：《我身边的"平凡英雄"》\n\n要求：\n①描写你身边一位默默付出的普通人（如父母、老师、清洁工、快递员等）\n②不少于400字，运用细节描写（动作、语言、外貌、神态之一）\n③开头或结尾点题\n④语言流畅，字迹工整', answer: '（学生自由作答）', points: 40, explanation: '评分：人物形象鲜明(15)、细节描写生动(10)、情感真实(10)、结构完整(5)' }
                ]
            }
        ]
    },
    // ===================== 语文（三）=====================
    {
        id: 'exam_chinese_03',
        title: '语文模拟试卷（三）',
        subject: 'chinese',
        subjectName: '语文',
        duration: 90,
        totalScore: 120,
        sections: [
            {
                id: 'ch3_s1', name: '一、基础知识（共40分）', type: 'mixed', score: 0,
                questions: [
                    { id: 'ch3_01', type: 'choice', question: '"长"在"长大"中读：', options: ['A. cháng', 'B. zhǎng', 'C. chǎng', 'D. zhāng'], answer: 'B', points: 3, explanation: '长大（动词，成长）→ zhǎng；长度（形容词）→ cháng' },
                    { id: 'ch3_02', type: 'choice', question: '下列加点词语运用正确的是：', options: ['A. 他的表演惟妙惟肖，大家都竖起大拇指。', 'B. 这道题很简单，令人叹为观止。', 'C. 他对这件事漠不关心，十分感人。', 'D. 春天来了，到处莺歌燕舞，死气沉沉。'], answer: 'A', points: 3, explanation: '惟妙惟肖=模仿极为逼真，用于此处正确；B：叹为观止=赞叹精彩，不适合形容简单；C：漠不关心与感人矛盾；D：莺歌燕舞与死气沉沉矛盾' },
                    { id: 'ch3_03', type: 'choice', question: '把下列句子改为反问句：这件事不是你的错。', options: ['A. 这件事是你的错吗？', 'B. 难道这件事不是你的错吗？', 'C. 难道这件事是你的错吗？', 'D. 这件事怎么会不是你的错？'], answer: 'C', points: 3, explanation: '反问句和原句意思相同：原句说"不是你的错"→反问形式应是"难道是你的错吗？"（反问否定=肯定）' },
                    { id: 'ch3_04', type: 'choice', question: '"飞流直下三千尺，疑是银河落九天"中"疑是"的意思是：', options: ['A. 怀疑是', 'B. 好像是', 'C. 确定是', 'D. 不知道是'], answer: 'B', points: 3, explanation: '"疑"在此处是"好像、仿佛"的意思，这是夸张和比喻结合的写法' },
                    { id: 'ch3_05', type: 'fillblank', question: '按要求写成语：\n(1)形容学习刻苦：___\n(2)形容做事有条理：___\n(3)形容人品端正：___', answer: '(1)废寝忘食（凿壁借光/悬梁刺股）；(2)有条不紊；(3)堂堂正正（光明正大）', points: 4, explanation: '成语答案不唯一，言之有理即可' },
                    { id: 'ch3_06', type: 'fillblank', question: '将直接引语改为间接引语：妈妈对我说："你今天要早点回家。"→', answer: '妈妈对我说，让我今天要早点回家。', points: 4, explanation: '直→间接引语：去掉引号和冒号，改换人称（你→我），动词根据语意调整' },
                    { id: 'ch3_07', type: 'choice', question: '下列说法正确的是：', options: ['A. 《西游记》作者是罗贯中（明代）', 'B. 《水浒传》共有108将，作者施耐庵', 'C. 《三国演义》中诸葛亮是蜀国丞相，字仲达', 'D. 《红楼梦》作者是吴承恩'], answer: 'B', points: 3, explanation: 'A：《西游记》是吴承恩；B：正确；C：字仲达是司马懿，诸葛亮字孔明；D：《红楼梦》是曹雪芹' },
                    { id: 'ch3_08', type: 'choice', question: '下面属于记叙文六要素之一的是：', options: ['A. 说明方法', 'B. 事情起因', 'C. 修辞手法', 'D. 中心思想'], answer: 'B', points: 3, explanation: '记叙文六要素：时间、地点、人物、起因、经过、结果' }
                ]
            },
            {
                id: 'ch3_s2', name: '二、阅读理解（共40分）', type: 'reading', score: 0,
                passage: '【阅读短文】\n\n藏在石头里的书\n\n地质学家叔叔来我家做客，吃完饭带我去爬山。\n\n"叔叔，你看这些石头有什么用？"\n\n"石头里藏着一本书呢！"\n\n叔叔捡起一块石头，石头上有许多小点和波浪形的曲线，还有一些贝壳形状的印迹。\n\n"看这些痕迹，说明这里很久以前是大海，贝壳留下了印记，这就叫化石。地层就是一页一页的书，每一层记录着那个年代的历史……"\n\n我惊奇地望着这些普通的石头，感觉它们不再普通了——它们是大自然几万年、几十万年写成的书。',
                questions: [
                    { id: 'ch3_09', question: '文中"藏在石头里的书"具体指什么？用自己的话说明。', answer: '指岩石上保留的化石（生物遗留的痕迹）和地层记录，就像书本一样记录着远古时代的历史和信息。', points: 8 },
                    { id: 'ch3_10', question: '叔叔是用哪些具体的细节来说明"石头里藏着书"的？请列出两点。', answer: '①石头上有小点、波浪曲线和贝壳印迹（化石）；②地层像一页页书，每层记录一个年代的历史。', points: 8 },
                    { id: 'ch3_11', question: '"我惊奇地望着这些普通的石头，感觉它们不再普通了"——为什么"不再普通"？', answer: '因为"我"了解到了看似普通的岩石其实蕴含着大自然亿万年历史的记录（化石、地层信息），所以感受到了这些石头的神奇与珍贵，不再觉得它们平凡普通。', points: 8 },
                    { id: 'ch3_12', question: '这篇文章属于什么文体？说明了什么知识？', answer: '记叙文（也有说明性质）。通过叙述一次爬山经历，说明了化石的形成、地层记录历史这一地质学知识，激发读者对自然科学的兴趣。', points: 8 },
                    { id: 'ch3_13', question: '读完这篇文章，你得到了什么启示？写3~4句。', answer: '示例：大自然中处处隐藏着知识，需要我们用好奇的眼光去发现。普通的石头也有非凡的故事，学会观察和思考，才能发现生活中的"宝藏"。知识让我们看见普通事物背后的美好与神奇。', points: 8 }
                ]
            },
            {
                id: 'ch3_s3', name: '三、习作（共40分）', type: 'essay', score: 0,
                questions: [
                    { id: 'ch3_14', question: '【作文题目】\n题目自拟（提示：从"第一次___"出发，写一件让你印象深刻的事）\n\n要求：\n①不少于400字\n②有具体情节，通过细节体现人物心情变化\n③运用至少一种修辞手法\n④结构完整，主题积极向上', answer: '（学生自由作答）', points: 40, explanation: '评分：主题鲜明(10)、情节具体(15)、修辞运用(10)、结构语言(5)' }
                ]
            }
        ]
    },
    // ===================== 英语（二）=====================
    {
        id: 'exam_english_02',
        title: '英语模拟试卷（二）',
        subject: 'english',
        subjectName: '英语',
        duration: 60,
        totalScore: 100,
        sections: [
            {
                id: 'en2_s1', name: 'Part 1: Vocabulary & Grammar（词汇和语法，40分）', type: 'mixed', score: 0,
                questions: [
                    { id: 'en2_01', type: 'choice', question: 'We ___ TV when it started to rain.（过去进行时）', options: ['A. watch', 'B. watched', 'C. were watching', 'D. are watching'], answer: 'C', points: 3, explanation: '过去进行时：was/were + doing，表示过去某时刻正在进行的动作' },
                    { id: 'en2_02', type: 'choice', question: 'She has ___ to Beijing twice.（现在完成时）', options: ['A. go', 'B. went', 'C. gone', 'D. been'], answer: 'D', points: 3, explanation: 'have been to=曾经去过（已回）；have gone to=去了（还未回）。"twice"表示经历，用have been to' },
                    { id: 'en2_03', type: 'choice', question: 'The book ___ by millions of children every year.', options: ['A. reads', 'B. is read', 'C. read', 'D. reading'], answer: 'B', points: 3, explanation: '被动语态：am/is/are + 过去分词。书"被阅读"用is read' },
                    { id: 'en2_04', type: 'choice', question: 'Tom runs ___ than any other student in his class.', options: ['A. fast', 'B. fastest', 'C. more fast', 'D. faster'], answer: 'D', points: 3, explanation: '比较级+than，fast为单音节：faster' },
                    { id: 'en2_05', type: 'choice', question: 'If it ___ tomorrow, we will stay at home.', options: ['A. rains', 'B. will rain', 'C. rained', 'D. is raining'], answer: 'A', points: 3, explanation: '条件句：If+一般现在时，主句用一般将来时（will）' },
                    { id: 'en2_06', type: 'choice', question: 'I don\'t know ___ he will come or not.', options: ['A. if', 'B. that', 'C. what', 'D. whether'], answer: 'D', points: 3, explanation: '"whether...or not"是固定搭配；if不能与or not连用' },
                    { id: 'en2_07', type: 'choice', question: 'There ___ a lot of rain last summer.', options: ['A. were', 'B. was', 'C. is', 'D. are'], answer: 'B', points: 3, explanation: 'rain是不可数名词，用was；last summer是过去时' },
                    { id: 'en2_08', type: 'choice', question: 'He is ___ honest boy.', options: ['A. a', 'B. an', 'C. the', 'D. /'], answer: 'B', points: 3, explanation: '"honest"以元音/ɒ/开头，用an' },
                    { id: 'en2_09', type: 'fillblank', question: '写出下列形容词的比较级和最高级：\ngood: ___ / ___\nbad: ___ / ___', answer: 'good: better / best; bad: worse / worst', points: 6, explanation: '不规则变化必须记忆：good→better→best；bad→worse→worst' },
                    { id: 'en2_10', type: 'fillblank', question: 'He speaks English ___ (流利地). She dances ___ (优美地).', answer: 'fluently; gracefully', points: 4, explanation: '副词修饰动词；fluent→fluently；graceful→gracefully' }
                ]
            },
            {
                id: 'en2_s2', name: 'Part 2: Reading Comprehension（阅读理解，30分）', type: 'reading', score: 0,
                passage: '【Read and answer】\n\nThe Giant Panda\n\nThe giant panda is one of the most famous animals in the world. It lives in the mountains of central China. Pandas eat bamboo—they need about 12 to 38 kilograms of bamboo every day!\n\nPandas are black and white, and they look like bears. Baby pandas are very small when they are born—only about 150 grams, but adult pandas can weigh up to 150 kilograms.\n\nUnfortunately, pandas are endangered. There are fewer than 2,000 pandas living in the wild. The Chinese government and international organizations are working hard to protect them. Today, there are special nature reserves where pandas can live safely.',
                questions: [
                    { id: 'en2_11', question: 'Where do giant pandas live?', answer: 'They live in the mountains of central China.', points: 5 },
                    { id: 'en2_12', question: 'How much bamboo does a panda eat each day?', answer: 'They need about 12 to 38 kilograms of bamboo every day.', points: 5 },
                    { id: 'en2_13', question: 'How much does a baby panda weigh when it is born?', answer: 'Only about 150 grams.', points: 5 },
                    { id: 'en2_14', question: 'Why are pandas endangered? What is being done to help them?', answer: 'There are fewer than 2,000 pandas in the wild. The Chinese government and international organizations are protecting them and building nature reserves.', points: 5 },
                    { id: 'en2_15', question: 'True(T) or False(F): Adult pandas weigh about 150 grams.', options: ['T', 'F'], answer: 'F', points: 5, explanation: 'Adult pandas can weigh up to 150 KILOgrams, not grams. 150 grams is the weight of a newborn baby panda.' },
                    { id: 'en2_16', question: 'What do you think we can do to help protect pandas? Write 1-2 sentences.', answer: 'Sample: We can support wildlife organizations, reduce pollution, and not buy products made from endangered animals. We should also learn about pandas and tell others about their importance.', points: 5 }
                ]
            },
            {
                id: 'en2_s3', name: 'Part 3: Writing（写作，30分）', type: 'essay', score: 0,
                questions: [
                    { id: 'en2_17', question: 'Write a short paragraph (60-80 words) about your best friend.\n\nInclude:\n- Name and age\n- Appearance (what he/she looks like)\n- Personality\n- Why you like him/her', answer: '（学生自由作答）', points: 15, explanation: '评分：内容完整(5)、语法正确(5)、语言表达(5)' },
                    { id: 'en2_18', question: 'Rewrite the sentences:\n(1) Tom bought a new bike last week.（改为被动语态）\n(2) She is the most beautiful girl in the class.（对划线部分提问）\n(3) I have never seen such a wonderful film.（改为一般疑问句）', answer: '(1) A new bike was bought by Tom last week.\n(2) Who is the most beautiful girl in the class?\n(3) Have you ever seen such a wonderful film?', points: 15, explanation: '(1)过去被动：was/were+p.p.；(2)对人提问用Who；(3)现在完成时疑问：Have/Has提前' }
                ]
            }
        ]
    },
    // ===================== 英语（三）=====================
    {
        id: 'exam_english_03',
        title: '英语模拟试卷（三）',
        subject: 'english',
        subjectName: '英语',
        duration: 60,
        totalScore: 100,
        sections: [
            {
                id: 'en3_s1', name: 'Part 1: Vocabulary & Grammar（词汇和语法，40分）', type: 'mixed', score: 0,
                questions: [
                    { id: 'en3_01', type: 'choice', question: 'I ___ English for three years.（现在完成时）', options: ['A. study', 'B. studied', 'C. have studied', 'D. am studying'], answer: 'C', points: 3, explanation: 'for+时间段 + 现在完成时：have/has + p.p.，表示从过去持续到现在' },
                    { id: 'en3_02', type: 'choice', question: 'Neither Tom nor I ___ good at drawing.（主谓一致）', options: ['A. are', 'B. is', 'C. am', 'D. be'], answer: 'C', points: 3, explanation: 'neither...nor 就近原则：动词与最近的主语一致，I→am' },
                    { id: 'en3_03', type: 'choice', question: 'The harder you work, ___ you will get.', options: ['A. the better result', 'B. better result', 'C. the good result', 'D. a better result'], answer: 'A', points: 3, explanation: '"the+比较级…the+比较级"固定结构，表示"越……越……"' },
                    { id: 'en3_04', type: 'choice', question: 'Would you mind ___ the window?（动名词）', options: ['A. open', 'B. to open', 'C. opening', 'D. opened'], answer: 'C', points: 3, explanation: 'mind + doing（动名词），不用不定式' },
                    { id: 'en3_05', type: 'choice', question: '"May I use your pen?" "___, here you are."', options: ['A. No, you may not', 'B. Of course', 'C. Sorry, I don\'t know', 'D. Never mind'], answer: 'B', points: 3, explanation: 'Of course=当然可以，是礼貌肯定的回答' },
                    { id: 'en3_06', type: 'choice', question: 'The man ___ is talking to our teacher is my father.（定语从句）', options: ['A. which', 'B. who', 'C. what', 'D. whom'], answer: 'B', points: 3, explanation: '定语从句修饰人，用who/that；此处作主语用who' },
                    { id: 'en3_07', type: 'choice', question: 'It\'s important ___ us ___ protect the environment.', options: ['A. for; to', 'B. of; to', 'C. for; for', 'D. to; to'], answer: 'A', points: 3, explanation: 'It\'s+adj+for sb+to do：用for；It\'s+adj of sb（评价人品）用of' },
                    { id: 'en3_08', type: 'choice', question: 'She looked ___ and spoke ___.（形容词/副词）', options: ['A. happy; happy', 'B. happy; happily', 'C. happily; happy', 'D. happily; happily'], answer: 'B', points: 3, explanation: 'look是连系动词，后接形容词（happy）；speak是行为动词，后接副词（happily）' },
                    { id: 'en3_09', type: 'fillblank', question: '汉译英：\n(1) 我宁愿待在家里也不愿出去。→ I ___ stay at home ___ go out.\n(2) 多亏了你的帮助，我及时完成了作业。→ ___ your help, I finished my homework on time.', answer: '(1) would rather; than; (2) Thanks to', points: 6, explanation: '"would rather...than..."宁愿…不愿；"Thanks to"多亏了（正面）' },
                    { id: 'en3_10', type: 'fillblank', question: 'She is ___ (too) young ___ (to) go to school alone.', answer: 'too; to', points: 4, explanation: '"too...to..."太……以至于不能……' }
                ]
            },
            {
                id: 'en3_s2', name: 'Part 2: Reading（30分）', type: 'reading', score: 0,
                passage: '【Read the letter and answer】\n\nDear Mike,\n\nHow are you? I am writing to tell you about my school life in China.\n\nI study at Sunshine Primary School in Shenzhen. We have six classes a day. My favorite class is P.E. because I love basketball. After school, I usually join the basketball club and practice for one hour.\n\nNext month, our school will hold a Sports Day. I will join the 400-meter race and the basketball match. I am a little nervous but very excited!\n\nBy the way, I heard that you are learning Chinese. How is it going? Maybe we can practice together someday—you teach me English and I\'ll teach you Chinese!\n\nLooking forward to your reply!\n\nYour friend,\nLeo',
                questions: [
                    { id: 'en3_11', question: 'Where does Leo study?', answer: 'He studies at Sunshine Primary School in Shenzhen.', points: 5 },
                    { id: 'en3_12', question: 'Why is P.E. Leo\'s favorite class?', answer: 'Because he loves basketball.', points: 5 },
                    { id: 'en3_13', question: 'What does Leo do after school?', answer: 'He usually joins the basketball club and practices for one hour.', points: 5 },
                    { id: 'en3_14', question: 'What events will Leo join at Sports Day?', answer: 'He will join the 400-meter race and the basketball match.', points: 5 },
                    { id: 'en3_15', question: 'How does Leo feel about Sports Day? Find TWO adjectives from the letter.', answer: 'He feels a little nervous but very excited.', points: 5 },
                    { id: 'en3_16', question: 'What does Leo suggest about practicing languages?', answer: 'Leo suggests they practice together—Mike teaches Leo English and Leo teaches Mike Chinese.', points: 5 }
                ]
            },
            {
                id: 'en3_s3', name: 'Part 3: Writing（30分）', type: 'essay', score: 0,
                questions: [
                    { id: 'en3_17', question: 'Write a letter (60-80 words) to a pen pal about your school life.\n\nInclude:\n- Your school name and grade\n- Your favorite subject and why\n- An activity you do after school\n- One thing you are looking forward to', answer: '（学生自由作答）', points: 15, explanation: '评分：内容完整(5)、语法准确(5)、语言流利(5)' },
                    { id: 'en3_18', question: 'Translation (Chinese to English):\n(1) 我已经完成了我的家庭作业。\n(2) 他住得离学校太远，所以每天乘公共汽车。\n(3) 如果明天不下雨，我们将去公园。', answer: '(1) I have already finished my homework.\n(2) He lives too far from school, so he takes a bus every day.\n(3) If it doesn\'t rain tomorrow, we will go to the park.', points: 15, explanation: '(1)现在完成时have+p.p.；(2)too far+so结果；(3)条件句if+一般现在时' }
                ]
            }
        ]
    }
];
