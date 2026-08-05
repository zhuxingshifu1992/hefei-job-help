/* =========================================================
 * platforms.js —— 全国陪诊平台资讯（哥哥维护）
 * 维护：新增平台就在数组里加一项；改资讯只动这里，逻辑不用碰。
 * 字段：id 唯一 / name 名称 / category 固定 "national"
 *       region 区域 / background 背景 / condition 入驻条件
 *       fee 费用抽成 / rating 1-5 新手友好度 / tag 标签
 *       link 官网(可空) / note 备注 / updated 更新月份(YYYY-MM)
 * ======================================================= */
window.PLATFORM_DATA = [
  { id:"yueban", name:"悦伴陪诊", category:"national", region:"全国/合肥",
    background:"行业头部，杭州悦伴健康科技，覆盖 370+ 城市",
    condition:"实名认证 + 培训考核，持证优先", fee:"平台抽成，订单含保险",
    rating:5, tag:"首选", link:"", note:"滴滴模式智能派单/抢单", updated:"2026-08" },

  { id:"peizhenbei", name:"陪诊呗", category:"national", region:"全国",
    background:"蘑楚街旗下，覆盖全国 90%+ 城市，订单由中国平安承保，有 APP",
    condition:"实名认证 + 平台培训", fee:"平台抽成",
    rating:4, tag:"", link:"", note:"平安承保较稳", updated:"2026-08" },

  { id:"xiaotun", name:"小豚陪诊", category:"national", region:"全国",
    background:"垂直平台，对新手极度友好",
    condition:"免费培训，抢单模式", fee:"抽成约 15%–20%",
    rating:5, tag:"零基础首选", link:"", note:"免费培训，先冲这个", updated:"2026-08" },

  { id:"epeizhen", name:"e陪诊", category:"national", region:"全国",
    background:"老牌头部（2015 年成立），全国覆盖，抢单模式",
    condition:"医护背景优先，需审核", fee:"抽成约 15%–20%",
    rating:4, tag:"", link:"", note:"老牌平台单量稳", updated:"2026-08" },

  { id:"chengyi", name:"橙医健康", category:"national", region:"全国",
    background:"北京，《陪诊师职业技能规范》团体标准制订单位，可兼职/全职",
    condition:"身份证 + 健康证 + 培训考核", fee:"抽佣约 15%–25%",
    rating:4, tag:"", link:"", note:"有健康证更易过", updated:"2026-08" },

  { id:"peiyiwuyou", name:"陪医无忧", category:"national", region:"全国",
    background:"全国智慧陪诊平台，24 小时派单",
    condition:"实名认证 + 简单培训", fee:"平台抽成",
    rating:4, tag:"适合新手", link:"", note:"24h 派单", updated:"2026-08" },

  { id:"xiaoyi", name:"小易陪诊", category:"national", region:"多省",
    background:"AI 大数据匹配订单，多省份覆盖",
    condition:"线上培训 + 考试", fee:"自由接单，平台抽成",
    rating:3, tag:"", link:"", note:"AI 匹配，单量看地区", updated:"2026-08" },

  { id:"haohushi", name:"好护师", category:"national", region:"全国",
    background:"好大夫旗下，聚焦线下医疗陪伴，患者资源多",
    condition:"资质审核较严", fee:"平台抽成",
    rating:3, tag:"审核严口碑好", link:"", note:"审核严但资源好", updated:"2026-08" },

  { id:"zhikang", name:"织康陪诊", category:"national", region:"全国",
    background:"新兴综合平台",
    condition:"注册审核 + 培训", fee:"平台抽成",
    rating:3, tag:"", link:"", note:"新兴平台可观察", updated:"2026-08" },

  { id:"bailing", name:"百灵陪诊", category:"national", region:"全国",
    background:"垂直小平台（补充渠道）",
    condition:"注册审核", fee:"抽成约 20%–30%",
    rating:2, tag:"补充", link:"", note:"先问清合肥有无单", updated:"2026-08" },

  { id:"juxiaopao", name:"桔小跑", category:"national", region:"全国",
    background:"垂直小平台（补充渠道）",
    condition:"注册审核", fee:"抽成约 20%–30%",
    rating:2, tag:"补充", link:"", note:"先问清合肥有无单", updated:"2026-08" },

  { id:"99peizhen", name:"99陪诊", category:"national", region:"全国",
    background:"垂直小平台（补充渠道）",
    condition:"注册审核", fee:"抽成约 20%–30%",
    rating:2, tag:"补充", link:"", note:"先问清合肥有无单", updated:"2026-08" }
];
