// src/templates/pinkStack.ts
export type Template = {
    id: string;
    name: string;
    canvas: { width: number; height: number };
    background: {
        type: "linearGradient";
        start: { x: number; y: number };
        end: { x: number; y: number };
        colorStops: (number | string)[];
    };
    baseLayers: any[];      // 交给 Codex 细化类型
    initialElements: any[]; // 交给 Codex 细化类型
};

export const pinkStack: Template = {
    id: "pinkStack",
    name: "粉色叠卡（原图风）",
    canvas: { width: 1080, height: 1440 },
    background: {
        type: "linearGradient",
        start: { x: 540, y: 0 },
        end: { x: 540, y: 1440 },
        colorStops: [
            0.0, "#F7C7D8",
            0.55, "#F1B8D3",
            1.0, "#E9B7D8",
        ],
    },
    baseLayers: [
        {
            id: "cardBack1",
            type: "rect",
            x: 140, y: 170, width: 860, height: 1120, radius: 56,
            fill: "rgba(255,255,255,0.35)",
            shadow: { color: "rgba(0,0,0,0.08)", blur: 40, offsetX: 12, offsetY: 22 },
        },
        {
            id: "cardBack2",
            type: "rect",
            x: 120, y: 155, width: 860, height: 1120, radius: 56,
            fill: "rgba(255,255,255,0.45)",
            shadow: { color: "rgba(0,0,0,0.06)", blur: 34, offsetX: 8, offsetY: 18 },
        },
        {
            id: "cardMain",
            type: "rect",
            x: 95, y: 140, width: 890, height: 1160, radius: 60,
            fill: "rgba(255,255,255,0.78)",
            shadow: { color: "rgba(0,0,0,0.12)", blur: 28, offsetX: 0, offsetY: 14 },
        },
        {
            id: "infoCard",
            type: "rect",
            x: 210, y: 860, width: 660, height: 240, radius: 18,
            fill: "#FFFFFF",
            shadow: { color: "rgba(0,0,0,0.14)", blur: 18, offsetX: 0, offsetY: 8 },
        },
    ],
    initialElements: [
        {
            id: "t1",
            type: "text",
            x: 165, y: 230, width: 760,
            text: "MiniMax 今天上市，收盘涨\n109%，股价 345 港元，总市值\n1067 亿港元",
            fontSize: 44,
            fontFamily: "system-ui, -apple-system, Segoe UI, PingFang SC, Microsoft YaHei",
            fill: "#7A4A4A",
            lineHeight: 1.45,
            align: "left",
        },
        {
            id: "t2",
            type: "text",
            x: 165, y: 560, width: 760,
            text: "破千亿了",
            fontSize: 46,
            fontFamily: "system-ui, -apple-system, Segoe UI, PingFang SC, Microsoft YaHei",
            fill: "#7A4A4A",
            lineHeight: 1.2,
            align: "left",
            fontStyle: "bold",
        },
        {
            id: "t3",
            type: "text",
            x: 165, y: 690, width: 760,
            text: "4 年，从成立到 IPO，AI 领域最快",
            fontSize: 40,
            fontFamily: "system-ui, -apple-system, Segoe UI, PingFang SC, Microsoft YaHei",
            fill: "#7A4A4A",
            lineHeight: 1.25,
            align: "left",
        },
        {
            id: "infoPlaceholder",
            type: "imagePlaceholder",
            x: 230, y: 880, width: 620, height: 200, radius: 14,
            fill: "#F5F5F7",
            stroke: "rgba(0,0,0,0.06)",
            hintText: "点击插入截图/图片",
            hintColor: "#8A8A8A",
        },
        {
            id: "avatarCircle",
            type: "circle",
            x: 220, y: 1215, radius: 34,
            fill: "#D9D9DE",
            stroke: "rgba(0,0,0,0.08)",
            strokeWidth: 2,
        },
        {
            id: "nick",
            type: "text",
            x: 270, y: 1192, width: 520,
            text: "AI编程",
            fontSize: 34,
            fontFamily: "system-ui, -apple-system, Segoe UI, PingFang SC, Microsoft YaHei",
            fill: "#7A4A4A",
            lineHeight: 1.1,
            align: "left",
        },
    ],
};
