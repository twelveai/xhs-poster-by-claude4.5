// src/types.ts
// 类型定义

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
  baseLayers: BaseLayer[];
  initialElements: PosterNode[];
};

export type Shadow = {
  color: string;
  blur: number;
  offsetX: number;
  offsetY: number;
};

export type BaseLayer = {
  id: string;
  type: "rect" | "circle";
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number | number[];
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  shadow?: Shadow;
};

// 节点基础类型
type NodeBase = {
  id: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation?: number;
  draggable?: boolean;
};

// 文本节点类型
export type TextNode = NodeBase & {
  type: "text";
  text: string;
  fontSize: number;
  fontFamily: string;
  fill: string;
  lineHeight: number;
  align: "left" | "center" | "right";
  fontStyle?: string;
};

// 图片节点类型
export type ImageNode = NodeBase & {
  type: "image";
  src: string;
  scaleX?: number;
  scaleY?: number;
};

// 图片占位符类型
export type ImagePlaceholderNode = NodeBase & {
  type: "imagePlaceholder";
  radius: number | number[];
  fill: string;
  stroke?: string;
  hintText: string;
  hintColor: string;
};

// 圆形节点类型
export type CircleNode = NodeBase & {
  type: "circle";
  radius: number;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
};

// 所有可编辑节点的联合类型
export type PosterNode = TextNode | ImageNode | ImagePlaceholderNode | CircleNode;

// 页面类型
export type Page = {
  nodes: PosterNode[];
};

// 编辑器状态
export type EditorState = {
  currentTemplateId: string;
  pages: Page[];
  pageIndex: number;
  selectedNodeId: string | null;
};

// Action 类型
export type EditorAction =
  | { type: "SET_TEMPLATE"; templateId: string }
  | { type: "SET_PAGE_INDEX"; index: number }
  | { type: "SELECT_NODE"; nodeId: string | null }
  | { type: "ADD_NODE"; node: PosterNode }
  | { type: "UPDATE_NODE"; nodeId: string; updates: Partial<PosterNode> }
  | { type: "DELETE_NODE"; nodeId: string }
  | { type: "SET_NODES"; nodes: PosterNode[] }
  | { type: "REPLACE_NODE"; nodeId: string; newNode: PosterNode };
