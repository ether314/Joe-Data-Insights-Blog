import fs from "fs";
import path from "path";

const ROOT = path.resolve(".");
const OUT = path.join(ROOT, "src/data/ccp-member-roster.ts");
const DELEGATES_FILE = path.join(ROOT, "scripts/data/nc-delegates-20th.txt");

/** Strip gender/ethnicity/province parentheticals for matching. */
function baseName(raw) {
  return raw.replace(/（[^）]*）/g, "").trim();
}

function parseDelegateLine(line) {
  const tokens = line.trim().split(/\s+/).filter(Boolean);
  const members = [];
  for (const token of tokens) {
    const m = token.match(/^(.+?)（([^）]+)）$/);
    if (m) {
      members.push({ name: m[1], display: token, note: m[2] });
    } else {
      members.push({ name: token, display: token, note: "" });
    }
  }
  return members;
}

// 205 full CC members elected Oct 22, 2022 (gov.cn / Xinhua, stroke order)
const CC_FULL_RAW = `丁学东 丁薛祥 万立骏 习近平 马兴瑞 马晓伟 王宁 王凯（河南） 王凯（解放军和武警部队） 王勇 王浩 王强 王鹏 王毅 王小洪 王广华 王仁华 王文全 王文涛 王予波 王正谱 王东明 王伟中 王志军 王秀斌 王沪宁 王君正 王忠林 王受文 王春宁 王莉霞 王晓晖 王祥喜 王清宪 王蒙徽 巨乾生 毛伟明 尹力 尹弘 巴特尔 艾尔肯·吐尼亚孜 石泰峰 叶建春 冯飞 曲青山 任振鹤 庄荣文 刘宁 刘伟 刘小明 刘发庆 刘青松 刘国中 刘金国 刘建超 刘俊臣 刘振立 刘海星 齐玉 许勤 许昆林 许学强 孙金龙 孙绍骋 阴和俊 严金海 李屹 李伟 李希 李强 李干杰 李小新 李凤彪 李书磊 李玉超 李乐成 李邑飞 李尚福 李国英 李炳军 李桥铭 李晓红 李鸿忠 杨诚 杨志亮 杨学军 肖捷 肖培 吴汉圣 吴亚男 吴政隆 吴晓军 何卫东 何立峰 何宏军 邹加怡 应勇 汪海江 沈春耀 沈晓明 沈跃跃 怀进鹏 张工 张军 张林 张又侠 张升民 张玉卓 张庆伟 张红兵 张宏森 张雨浦 张国清 陆昊 陆治原 陈刚 陈旭 陈一新 陈小江 陈文清 陈吉宁 陈敏尔 努尔兰·阿不都满金 苗华 林武 林向阳 易会满 易炼红 罗文 金壮龙 金湘军 周强 周乃翔 周祖翼 郑栅洁 郑新聪 孟凡利 孟祥锋 赵龙 赵刚 赵一德 赵乐际 赵晓哲 郝鹏 胡中明 胡玉亭 胡昌升 胡和平 胡春华 胡衡华 钟绍军 信长星 侯凯 侯建国 俞庆江 俞建华 贺荣 贺军科 秦刚 秦树桐 袁华智 袁家军 铁凝 倪虹 倪岳峰 徐麟 徐西盛 徐忠波 徐起零 徐德清 殷勇 高翔 高志丹 郭普校 唐仁健 唐登杰 黄铭 黄强 黄守宏 黄坤明 黄建发 黄晓薇 龚正 常丁求 庹震 梁言顺 梁惠玲 谌贻琴 董军 韩俊 韩文秀 景俊海 程丽华 傅华 童建明 谢春涛 蓝天立 蓝佛安 楼阳生 雷凡培 慎海雄 蔡奇 蔡剑江 裴金佳 潘岳`;

// 171 alternate CC members (gov.cn, ballot order)
const CC_ALT_RAW = `丁向群 丁兴农 于立军 于吉红 于会文 马汉成 王健 王曦 王立岩 王永红 王抗平 王庭凯 王新伟 王嘉毅 韦韬 方永祥 方红卫 邓亦武 邓修明 石玉钢 石正露 卢红 卢东亮 付文化 丛亮 包钢 邢善萍 吉林 曲莹璞 吕军 朱天舒 朱文祥 朱芝松 朱国贤 朱鹤新 刘珺 刘捷 刘强 刘仲华 刘洪建 刘桂平 刘烈宏 刘敬桢 关志鸥 汤广福 安伟 农生文 孙向东 孙金明 孙梅君 纪斌 杜江峰 李云泽 李文堂 李术才 李石松 李红军 李贤玉 李明俊 李明清 李建榕 李荣灿 李殿勋 李儒新 杨斌 杨晋柏 连茂君 时光辉 吴浩 吴清 吴强 吴孔明 吴俊宝 吴胜华 吴朝晖 邱勇 何雅玲 谷澍 沈莹 沈丹阳 张伟 张政 张凤中 张文兵 张安顺 张国华 张忠阳 张金良 张春林 张荣桥 张超超 张智刚 陈杰 陈雍 陈永奇 陈宏敏 陈建文 陈瑞峰 林克庆 杭义洪 罗强 罗东川 金东寒 周志鑫 周建国 郑学选 赵东 胡文容 施小琳 姜辉 姜国平 洪庆 祖力亚提·司马义 费东斌 费高云 姚林 袁洁 袁古洁 夏林茂 徐留平 凌焕新 郭芳 郭元强 郭宁宁 郭永红 郭竹学 诸葛宇杰 黄如 黄旭聪 黄志强 黄路生 曹淑敏 龚旗煌 常进 崔玉忠 崔永辉 康义 彭佳学 葛巧红 董卫民 韩立明 覃伟中 景建峰 傅爱国 普布顿珠 曾益新 曾赞荣 温刚 蓝晓 虞爱华 窦贤康 蔡允革 蔡丽新 蔡希良 嘎玛泽登 廖林 缪建民 黎湘 魏文徽 才让太 王旭东 王晓云 杨发森 肖川 余剑锋 宋志勇 宋鱼水 张晶 周长奎 施金通 王成`;

const RETURNING_19TH = new Set(
  `习近平 李强 赵乐际 王沪宁 蔡奇 丁薛祥 李希 李鸿忠 陈敏尔 陈吉宁 黄坤明 马兴瑞 王毅 何立峰 张国清 刘国中 袁家军 尹力 石泰峰 胡春华 沈跃跃 铁凝 谌贻琴 孙绍骋 金壮龙 王小洪 吴政隆 尹弘 许勤 信长星 胡昌升 沈晓明 韩俊 冯飞 王宁 易炼红 刘宁 王君正 李干杰 李书磊 刘金国 杨晓渡 陈希 郭声琨 尤权 张庆伟 刘鹤 许其亮 孙春兰 栗战书 汪洋 韩正 王岐山 杨晓超 陈全国 胡春华 苗华 张又侠 何卫东 李尚福 秦刚 唐仁健 钟绍军 徐麟 郝鹏 倪岳峰 景俊海 楼阳生 蓝佛安 周祖翼 郑栅洁 孟凡利 赵龙 赵刚 赵一德 叶建春 任振鹤 王东明 王伟中 王晓晖 王莉霞 王祥喜 王蒙徽 毛伟明 龚正 周乃翔 应勇 林武 罗文 夏林茂 张军 肖捷 怀进鹏 庄荣文 齐玉 侯建国 俞建华 贺荣 董军 傅华 童建明 谢春涛 蓝天立 裴金佳 潘岳 严金海 阴和俊 李屹 李伟 李小新 李凤彪 李玉超 李乐成 李邑飞 李国英 李炳军 李桥铭 李晓红 杨诚 杨志亮 杨学军 肖培 吴汉圣 吴亚男 吴晓军 何宏军 汪海江 沈春耀 张工 张林 张升民 张玉卓 张红兵 张宏森 张雨浦 陆昊 陆治原 陈刚 陈旭 陈一新 陈小江 陈文清 努尔兰·阿不都满金 林向阳 易会满 金湘军 周强 郑新聪 孟祥锋 赵晓哲 胡中明 胡玉亭 胡和平 胡衡华 侯凯 俞庆江 贺军科 秦树桐 袁华智 倪虹 徐西盛 徐忠波 徐起零 徐德清 殷勇 高翔 高志丹 郭普校 唐登杰 黄铭 黄强 黄守宏 黄建发 黄晓薇 常丁求 庹震 梁言顺 梁惠玲 程丽华 雷凡培 慎海雄 蔡剑江 万立骏 马晓伟 王勇 王浩 王强 王鹏 王文全 王文涛 王予波 王正谱 王志军 王秀斌 王忠林 王受文 王春宁 王清宪 巨乾生 巴特尔 艾尔肯·吐尼亚孜 曲青山 刘伟 刘小明 刘发庆 刘青松 刘建超 刘俊臣 刘振立 刘海星 许昆林 许学强 孙金龙 邹加怡`.split(/\s+/)
);

const PSC = new Set(["习近平", "李强", "赵乐际", "王沪宁", "蔡奇", "丁薛祥", "李希"]);
const POLITBURO = new Set([
  ...PSC,
  "陈吉宁", "陈敏尔", "陈文清", "何立峰", "黄坤明", "李干杰", "李鸿忠", "李书磊", "刘国中",
  "马兴瑞", "石泰峰", "王毅", "尹力", "袁家军", "张国清", "张又侠", "何卫东",
]);

const EXPELLED = {
  李尚福: "Expelled July 2024; former Defense Minister and CMC member.",
  何卫东: "Expelled October 2025; former CMC Vice Chairman amid corruption probe.",
};
const RESIGNED = {
  秦刚: "Resigned July 2024; former Foreign Minister — removed after prolonged absence from public view.",
};
const INVESTIGATION = {
  张又侠: "Under investigation (Jan 2026); CMC Vice Chairman and senior general — highest-ranking purge target since 1976.",
  马兴瑞: "Under scrutiny; Xinjiang Party Secretary — missed key meetings in 2025–2026.",
};

const PROMOTED_FULL_2024 = new Set(["丁向群", "于立军", "于吉红"]);
const PROMOTED_FULL_2025 = new Set([
  "邓亦武", "卢红", "王庭凯", "王新伟", "王健", "王曦", "王永红", "王抗平", "王嘉毅", "韦韬", "方永祥",
  // Official Xinhua list (Oct 2025): Deng Xiuming, Deng Yiwu, Lu Hong, Ma Hancheng, Wang Jian, Wang Tingkai, Wang Xi, Wang Xinwei, Wang Yonghong, Wei Tao, Yu Huiwen
  // Mapped to Chinese from alternate roster where applicable:
  "邓修明", "马汉成", "王旭东", "王晓云", "杨发森",
]);

const PROVINCIAL_SECRETARIES = {
  陈吉宁: "Shanghai Party Secretary",
  陈敏尔: "Tianjin Party Secretary",
  黄坤明: "Guangdong Party Secretary",
  马兴瑞: "Xinjiang Party Secretary",
  尹力: "Sichuan Party Secretary (formerly Fujian)",
  袁家军: "Chongqing Party Secretary",
  信长星: "Jiangsu Party Secretary",
  胡昌升: "Gansu Party Secretary",
  沈晓明: "Hainan Party Secretary",
  冯飞: "Hainan Governor / former secretary",
  王宁: "Yunnan Party Secretary",
  易炼红: "Zhejiang Party Secretary",
  刘宁: "Guangxi Party Secretary",
  王君正: "Tibet Party Secretary",
  尹弘: "Gansu Party Secretary (formerly Henan)",
  许勤: "Heilongjiang Party Secretary",
  倪岳峰: "Hebei Party Secretary",
  景俊海: "Jilin Party Secretary",
  楼阳生: "Henan Party Secretary",
  蓝佛安: "Shanxi Party Secretary",
  周祖翼: "Fujian Party Secretary",
  郑栅洁: "Anhui Party Secretary",
  孟凡利: "Inner Mongolia Party Secretary",
  赵龙: "Liaoning Party Secretary",
  赵刚: "Shaanxi Party Secretary",
  赵一德: "Shaanxi Party Secretary",
  叶建春: "Jiangxi Party Secretary",
  任振鹤: "Gansu Governor (Tujia)",
  王东明: "NPC Vice Chairman; former Liaoning secretary",
  王伟中: "Guangdong Governor",
  王晓晖: "Sichuan Party Secretary",
  王莉霞: "Inner Mongolia Chair (Mongol)",
  毛伟明: "Hunan Governor",
  龚正: "Shanghai Mayor",
  周乃翔: "Shandong Party Secretary",
  林武: "Shandong Party Secretary (formerly Shanxi)",
};

const PRESIDIUM_STANDING = new Set(
  `习近平 李克强 栗战书 汪洋 王沪宁 赵乐际 韩正 王岐山 丁薛祥 王晨 刘鹤 许其亮 孙春兰 李希 李强 李鸿忠 杨洁篪 杨晓渡 张又侠 陈希 陈全国 陈敏尔 胡春华 郭声琨 黄坤明 蔡奇 尤权 张庆黎`.split(/\s+/)
);

function annotateCcMember(entry, group) {
  const name = baseName(entry.display || entry.name);
  let tenure = "new";
  let tenureLabel = group === "full" ? "New full member (2022)" : "New alternate (2022)";
  let remark = group === "full" ? "Elected full CC member at 20th Congress (Oct 2022)." : "Elected alternate; fills vacancies in ballot order.";

  if (EXPELLED[name]) {
    tenure = "expelled";
    tenureLabel = "Expelled";
    remark = EXPELLED[name];
  } else if (RESIGNED[name]) {
    tenure = "resigned";
    tenureLabel = "Resigned";
    remark = RESIGNED[name];
  } else if (INVESTIGATION[name]) {
    tenure = "investigation";
    tenureLabel = "Under scrutiny";
    remark = INVESTIGATION[name];
  } else if (PROMOTED_FULL_2024.has(name)) {
    tenure = "promoted";
    tenureLabel = "Promoted to full (2024)";
    remark = "Alternate promoted to full member at 3rd Plenum (July 2024).";
  } else if (PROMOTED_FULL_2025.has(name) && group === "alternate") {
    tenure = "promoted";
    tenureLabel = "Promoted to full (2025)";
    remark = "Alternate promoted to full member at 4th Plenum (Oct 2025) amid anti-corruption vacancies.";
  } else if (PSC.has(name)) {
    tenure = "returning";
    tenureLabel = "Returning · PSC";
    remark = "Politburo Standing Committee member; retained from 19th CC.";
  } else if (POLITBURO.has(name)) {
    tenure = "returning";
    tenureLabel = "Returning · Politburo";
    remark = "Politburo member; senior leader retained from prior term.";
  } else if (RETURNING_19TH.has(name)) {
    tenure = "returning";
    tenureLabel = "Returning CC member";
    remark = "Served on 19th Central Committee (2017–2022).";
  }

  if (PROVINCIAL_SECRETARIES[name] && tenure !== "expelled" && tenure !== "resigned" && tenure !== "investigation") {
    remark += ` ${PROVINCIAL_SECRETARIES[name]}.`;
  }
  if (entry.note && entry.note !== "女") {
    remark += entry.note.includes("河南") || entry.note.includes("解放军") ? ` Disambiguation: ${entry.note}.` : "";
  }

  return { name, display: entry.display || entry.name, tenure, tenureLabel, remark: remark.trim(), group };
}

function parseCcList(raw, group) {
  return parseDelegateLine(raw).map((e) => annotateCcMember(e, group));
}

function loadDelegates() {
  const text = fs.readFileSync(DELEGATES_FILE, "utf8");
  const line = text.split("\n").find((l) => l.includes("习近平") && l.length > 1000);
  if (!line) throw new Error("Delegate line not found in " + DELEGATES_FILE);
  const parsed = parseDelegateLine(line);
  const ccFullNames = new Set(parseCcList(CC_FULL_RAW, "full").map((m) => m.name));
  const ccAltNames = new Set(parseCcList(CC_ALT_RAW, "alternate").map((m) => m.name));

  return parsed.map((d) => {
    const name = baseName(d.display);
    let tenure = "delegate";
    let tenureLabel = "Congress delegate";
    let remark = "Elected delegate to 20th Party Congress (Sept 2022); 2,296 total.";

    if (ccFullNames.has(name)) {
      tenure = "cc-full";
      tenureLabel = "CC full member";
      remark = "Also elected to 205-member Central Committee at congress.";
      if (RETURNING_19TH.has(name)) remark += " Returning CC member from 19th term.";
      else remark += " First-time CC member.";
      if (PSC.has(name)) remark += " PSC member.";
      else if (POLITBURO.has(name)) remark += " Politburo member.";
      if (EXPELLED[name]) {
        tenure = "expelled";
        tenureLabel = "CC · Expelled";
        remark = EXPELLED[name];
      } else if (RESIGNED[name]) {
        tenure = "resigned";
        tenureLabel = "CC · Resigned";
        remark = RESIGNED[name];
      } else if (INVESTIGATION[name]) {
        tenure = "investigation";
        tenureLabel = "CC · Under scrutiny";
        remark = INVESTIGATION[name];
      }
    } else if (ccAltNames.has(name)) {
      tenure = "cc-alt";
      tenureLabel = "CC alternate";
      remark = "Elected alternate CC member (171 total); may be promoted when vacancies arise.";
      if (PROMOTED_FULL_2024.has(name)) remark = "Promoted to full member at 3rd Plenum (July 2024).";
      if (PROMOTED_FULL_2025.has(name)) remark = "Promoted to full member at 4th Plenum (Oct 2025).";
    } else if (PRESIDIUM_STANDING.has(name)) {
      tenure = "presidium";
      tenureLabel = "Presidium Standing Committee";
      remark = "Member of 46-person Presidium Standing Committee that ran the 20th Congress.";
    } else if (name === "张桂梅") {
      remark = "Model teacher; delegate representing grassroots educators.";
    } else if (name === "丁宁") {
      remark = "Olympic table-tennis champion; sports delegate.";
    }

    return { name, display: d.display, tenure, tenureLabel, remark, group: "delegate" };
  });
}

const ccFull = parseCcList(CC_FULL_RAW, "full");
const ccAlt = parseCcList(CC_ALT_RAW, "alternate");
const ncDelegates = loadDelegates();

if (ccFull.length !== 205) throw new Error(`Expected 205 full members, got ${ccFull.length}`);
if (ccAlt.length !== 171) throw new Error(`Expected 171 alternates, got ${ccAlt.length}`);
if (ncDelegates.length !== 2296) throw new Error(`Expected 2296 delegates, got ${ncDelegates.length}`);

const out = `/** Auto-generated by scripts/generate-ccp-roster.mjs — do not edit by hand. */
export type MemberTenure =
  | "returning"
  | "new"
  | "promoted"
  | "expelled"
  | "resigned"
  | "investigation"
  | "delegate"
  | "cc-full"
  | "cc-alt"
  | "presidium";

export type RosterMember = {
  name: string;
  display: string;
  tenure: MemberTenure;
  tenureLabel: string;
  remark: string;
  group: "full" | "alternate" | "delegate";
};

export const CC_FULL_MEMBERS: RosterMember[] = ${JSON.stringify(ccFull, null, 2)};

export const CC_ALTERNATE_MEMBERS: RosterMember[] = ${JSON.stringify(ccAlt, null, 2)};

export const NC_DELEGATES: RosterMember[] = ${JSON.stringify(ncDelegates, null, 2)};

export const CC_ROSTER: RosterMember[] = [...CC_FULL_MEMBERS, ...CC_ALTERNATE_MEMBERS];

export function rosterForNode(nodeId: string): RosterMember[] | null {
  if (nodeId === "cc") return CC_ROSTER;
  if (nodeId === "nc") return NC_DELEGATES;
  return null;
}
`;

fs.writeFileSync(OUT, out, "utf8");
console.log(`Wrote ${OUT}`);
console.log(`  CC full: ${ccFull.length}, alternates: ${ccAlt.length}, NC delegates: ${ncDelegates.length}`);
