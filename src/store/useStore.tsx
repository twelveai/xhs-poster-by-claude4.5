// src/store/useStore.tsx
import { createContext, useContext, useReducer, type ReactNode } from "react";
import type { EditorState, EditorAction, Page, PosterNode } from "../types";
import { templates } from "../templates";

// 初始化页面（默认 3 页）
const createInitialPages = (templateId: string): Page[] => {
    const template = templates.find((t) => t.id === templateId) || templates[0];
    return [
        { nodes: structuredClone(template.initialElements) as PosterNode[] },
        { nodes: structuredClone(template.initialElements) as PosterNode[] },
        { nodes: structuredClone(template.initialElements) as PosterNode[] },
    ];
};

// 初始状态
const initialState: EditorState = {
    currentTemplateId: templates[0].id,
    pages: createInitialPages(templates[0].id),
    pageIndex: 0,
    selectedNodeId: null,
};

// Reducer
function editorReducer(state: EditorState, action: EditorAction): EditorState {
    switch (action.type) {
        case "SET_TEMPLATE": {
            // 切换模板时：保留当前页的可编辑 elements
            return {
                ...state,
                currentTemplateId: action.templateId,
            };
        }
        case "SET_PAGE_INDEX": {
            return {
                ...state,
                pageIndex: action.index,
                selectedNodeId: null,
            };
        }
        case "SELECT_NODE": {
            return {
                ...state,
                selectedNodeId: action.nodeId,
            };
        }
        case "ADD_NODE": {
            const newPages = [...state.pages];
            newPages[state.pageIndex] = {
                nodes: [...state.pages[state.pageIndex].nodes, action.node],
            };
            return {
                ...state,
                pages: newPages,
                selectedNodeId: action.node.id,
            };
        }
        case "UPDATE_NODE": {
            const newPages = [...state.pages];
            const currentNodes = state.pages[state.pageIndex].nodes;
            newPages[state.pageIndex] = {
                nodes: currentNodes.map((node) =>
                    node.id === action.nodeId ? { ...node, ...action.updates } : node
                ) as PosterNode[],
            };
            return {
                ...state,
                pages: newPages,
            };
        }
        case "DELETE_NODE": {
            const newPages = [...state.pages];
            newPages[state.pageIndex] = {
                nodes: state.pages[state.pageIndex].nodes.filter(
                    (node) => node.id !== action.nodeId
                ),
            };
            return {
                ...state,
                pages: newPages,
                selectedNodeId:
                    state.selectedNodeId === action.nodeId ? null : state.selectedNodeId,
            };
        }
        case "SET_NODES": {
            const newPages = [...state.pages];
            newPages[state.pageIndex] = {
                nodes: action.nodes,
            };
            return {
                ...state,
                pages: newPages,
            };
        }
        case "REPLACE_NODE": {
            const newPages = [...state.pages];
            const currentNodes = state.pages[state.pageIndex].nodes;
            newPages[state.pageIndex] = {
                nodes: currentNodes.map((node) =>
                    node.id === action.nodeId ? action.newNode : node
                ),
            };
            return {
                ...state,
                pages: newPages,
                selectedNodeId: action.newNode.id,
            };
        }
        default:
            return state;
    }
}

// Context
type EditorContextType = {
    state: EditorState;
    dispatch: React.Dispatch<EditorAction>;
    currentTemplate: (typeof templates)[0];
    currentNodes: PosterNode[];
};

const EditorContext = createContext<EditorContextType | null>(null);

// Provider
export function EditorProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(editorReducer, initialState);

    const currentTemplate =
        templates.find((t) => t.id === state.currentTemplateId) || templates[0];
    const currentNodes = state.pages[state.pageIndex]?.nodes || [];

    return (
        <EditorContext.Provider
            value={{ state, dispatch, currentTemplate, currentNodes }}
        >
            {children}
        </EditorContext.Provider>
    );
}

// Hook
export function useEditor() {
    const context = useContext(EditorContext);
    if (!context) {
        throw new Error("useEditor must be used within EditorProvider");
    }
    return context;
}
