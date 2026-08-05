/* =========================================================
 * local.js —— 合肥本地渠道 + 官方招聘渠道（哥哥维护）
 * category 固定 "local"；kind: "company" 本地公司 / "channel" 官方渠道
 * 其余字段同 platforms.js（公司类用 background/condition/fee）
 * channel 类用 note 存网址/玩法
 * ======================================================= */
window.LOCAL_DATA = [
  { id:"jingtun", name:"鲸豚健康", category:"local", kind:"company", region:"合肥",
    background:"鲸豚(武汉)健康咨询，BOSS直聘长期招合肥导医/陪诊兼职储备",
    condition:"医护背景优先", fee:"按单结算",
    rating:4, tag:"BOSS直聘", link:"", note:"去 BOSS直聘搜「鲸豚健康」投简历", updated:"2026-08" },

  { id:"hanyi", name:"沈阳涵益科技（合肥岗）", category:"local", kind:"company", region:"合肥",
    background:"招合肥兼职陪诊师",
    condition:"兼职陪诊师", fee:"65–70 元/小时",
    rating:4, tag:"单价高", link:"", note:"比妙小医 45–50 高不少，重点投", updated:"2026-08" },

  { id:"tailele", name:"合肥泰乐勒健康管理", category:"local", kind:"company", region:"合肥",
    background:"本地一站式健康服务平台，BOSS直聘在招",
    condition:"陪诊师岗位", fee:"面议",
    rating:3, tag:"BOSS直聘", link:"", note:"BOSS直聘沟通", updated:"2026-08" },

  { id:"jianyitang", name:"合肥健益堂健康科技", category:"local", kind:"company", region:"合肥",
    background:"本地公司，陪诊师岗位",
    condition:"陪诊师", fee:"6–8K/月（全职参考）",
    rating:3, tag:"全职参考", link:"", note:"可问兼职可能性", updated:"2026-08" },

  { id:"yunxi", name:"合肥云憙智能科技", category:"local", kind:"company", region:"合肥瑶海区",
    background:"招陪诊师 50 人，全职兼职均可，经验不限",
    condition:"经验不限", fee:"4000–8000 元/月",
    rating:4, tag:"缺口大", link:"", note:"瑶海区，兼职也可谈", updated:"2026-08" },

  { id:"minai", name:"民爱陪诊", category:"local", kind:"company", region:"合肥",
    background:"本地机构，主打合肥本地就医陪护，覆盖安医大一附院、省立医院、滨湖医院等三甲",
    condition:"本地陪护", fee:"收费公示、无隐形消费",
    rating:4, tag:"本地稳", link:"", note:"三甲覆盖，单量较稳", updated:"2026-08" },

  { id:"miaoxiaoyi", name:"妙小医", category:"local", kind:"company", region:"合肥",
    background:"合肥本地头部，但 45–50 元/小时且条款苛刻",
    condition:"条款谈不拢不签", fee:"45–50 元/小时",
    rating:2, tag:"备选/慎签", link:"", note:"已接触，条款不公平就不签", updated:"2026-08" },

  { id:"ahzp", name:"安徽公共招聘网", category:"local", kind:"channel", region:"安徽",
    background:"政府背景，信息可靠",
    condition:"搜「陪诊」", fee:"免费",
    rating:5, tag:"官方可靠", link:"hf.ahggzp.gov.cn", note:"政府站，搜「陪诊」岗位", updated:"2026-08" },

  { id:"kq36", name:"康强医疗人才网", category:"local", kind:"channel", region:"全国/医疗",
    background:"医疗类岗位全",
    condition:"搜陪诊/导医", fee:"免费",
    rating:4, tag:"医疗专", link:"kq36.com", note:"医疗垂直，岗位多", updated:"2026-08" },

  { id:"boss", name:"BOSS直聘 / 职友集 / 597直聘", category:"local", kind:"channel", region:"合肥",
    background:"综合招聘平台，定位合肥搜「陪诊师 兼职」「导医 兼职」",
    condition:"主动投递", fee:"免费",
    rating:4, tag:"主动投", link:"", note:"定位合肥，多平台同时投", updated:"2026-08" },

  { id:"hospital", name:"医院陪护项目（中标服务公司）", category:"local", kind:"channel", region:"合肥",
    background:"安医大一附院等三甲的病患陪护/免陪照护项目对外招标，关注中标服务公司入职",
    condition:"入职中标公司", fee:"按单/月薪",
    rating:5, tag:"单最稳", link:"", note:"单量最稳定，重点关注", updated:"2026-08" }
];
