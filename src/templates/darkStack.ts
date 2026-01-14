// src/templates/darkStack.ts
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
    baseLayers: any[];
    initialElements: any[];
};

export const darkStack: Template = {
    id: "darkStack",
    name: "黑金商务叠卡",
    canvas: { width: 1080, height: 1440 },

    background: {
        type: "linearGradient",
        start: { x: 540, y: 0 },
        end: { x: 540, y: 1440 },
        colorStops: [
            0.0, "#1B1B22",  // 深黑蓝
            0.55, "#121218", // 更深
            1.0, "#0B0B10",  // 近黑
        ],
    },

    baseLayers: [
        {
            id: "cardBack1",
            type: "rect",
            x: 140, y: 170, width: 860, height: 1120, radius: 56,
            fill: "rgba(255,255,255,0.10)",
            shadow: { color: "rgba(0,0,0,0.45)", blur: 50, offsetX: 14, offsetY: 26 },
        },
        {
            id: "cardBack2",
            type: "rect",
            x: 120, y: 155, width: 860, height: 1120, radius: 56,
            fill: "rgba(255,255,255,0.14)",
            shadow: { color: "rgba(0,0,0,0.35)", blur: 44, offsetX: 10, offsetY: 22 },
        },
        {
            id: "cardMain",
            type: "rect",
            x: 95, y: 140, width: 890, height: 1160, radius: 60,
            fill: "rgba(255,255,255,0.16)",
            shadow: { color: "rgba(0,0,0,0.45)", blur: 32, offsetX: 0, offsetY: 16 },
        },
        {
            id: "infoCard",
            type: "rect",
            x: 210, y: 860, width: 660, height: 240, radius: 18,
            fill: "rgba(255,255,255,0.14)",
            shadow: { color: "rgba(0,0,0,0.5)", blur: 20, offsetX: 0, offsetY: 10 },
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
            fill: "#F2D7A6", // 金色字
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
            fill: "#F2D7A6",
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
            fill: "#F2D7A6",
            lineHeight: 1.25,
            align: "left",
        },
        {
            id: "infoPlaceholder",
            type: "imagePlaceholder",
            x: 230, y: 880, width: 620, height: 200, radius: 14,
            fill: "rgba(255,255,255,0.10)",
            stroke: "rgba(242,215,166,0.22)",
            hintText: "点击插入截图/图片",
            hintColor: "rgba(242,215,166,0.70)",
        },
        {
            id: "avatarCircle",
            type: "circle",
            x: 220, y: 1215, radius: 34,
            fill: "rgba(242,215,166,0.18)",
            stroke: "rgba(242,215,166,0.28)",
            strokeWidth: 2,
        },
        {
            id: "nick",
            type: "text",
            x: 270, y: 1192, width: 520,
            text: "AI编程",
            fontSize: 34,
            fontFamily: "system-ui, -apple-system, Segoe UI, PingFang SC, Microsoft YaHei",
            fill: "#F2D7A6",
            lineHeight: 1.1,
            align: "left",
        },
    ],
};
