// src/components/Toolbar.tsx
import { useRef } from "react";
import { useEditor } from "../store/useStore";
import { templates } from "../templates";
import type { TextNode, ImageNode } from "../types";
import type Konva from "konva";

type ToolbarProps = {
    stageRef: React.RefObject<Konva.Stage | null>;
};

export function Toolbar({ stageRef }: ToolbarProps) {
    const { state, dispatch, currentTemplate } = useEditor();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch({ type: "SET_TEMPLATE", templateId: e.target.value });
    };

    const handlePrevPage = () => {
        if (state.pageIndex > 0) {
            dispatch({ type: "SET_PAGE_INDEX", index: state.pageIndex - 1 });
        }
    };

    const handleNextPage = () => {
        if (state.pageIndex < state.pages.length - 1) {
            dispatch({ type: "SET_PAGE_INDEX", index: state.pageIndex + 1 });
        }
    };

    const handleAddText = () => {
        const newText: TextNode = {
            id: `text-${Date.now()}`,
            type: "text",
            x: 200,
            y: 400,
            width: 600,
            text: "双击编辑文本",
            fontSize: 40,
            fontFamily: "system-ui, -apple-system, Segoe UI, PingFang SC, Microsoft YaHei",
            fill: currentTemplate.id === "darkStack" ? "#F2D7A6" : "#7A4A4A",
            lineHeight: 1.3,
            align: "left",
            draggable: true,
        };
        dispatch({ type: "ADD_NODE", node: newText });
    };

    const handleInsertImage = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const src = event.target?.result as string;
            const img = new Image();
            img.src = src;
            img.onload = () => {
                // 计算合适的尺寸（最大宽度 600）
                const maxWidth = 600;
                const scale = img.width > maxWidth ? maxWidth / img.width : 1;

                const newImage: ImageNode = {
                    id: `image-${Date.now()}`,
                    type: "image",
                    x: 240,
                    y: 400,
                    width: img.width * scale,
                    height: img.height * scale,
                    src,
                    draggable: true,
                };
                dispatch({ type: "ADD_NODE", node: newImage });
            };
        };
        reader.readAsDataURL(file);
        e.target.value = ""; // 重置 input
    };

    const handleDownload = () => {
        const stage = stageRef.current;
        if (!stage) return;

        // 隐藏选中框
        dispatch({ type: "SELECT_NODE", nodeId: null });

        // 延迟导出确保 Transformer 已消失
        setTimeout(() => {
            const uri = stage.toDataURL({ pixelRatio: 2 });
            const link = document.createElement("a");
            const timestamp = Date.now();
            link.download = `xiaohongshu-${state.currentTemplateId}-${state.pageIndex}-${timestamp}.png`;
            link.href = uri;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }, 100);
    };

    return (
        <div className="toolbar">
            <div className="toolbar-group">
                <label htmlFor="template-select">模板：</label>
                <select
                    id="template-select"
                    value={state.currentTemplateId}
                    onChange={handleTemplateChange}
                >
                    {templates.map((t) => (
                        <option key={t.id} value={t.id}>
                            {t.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="toolbar-group">
                <button onClick={handlePrevPage} disabled={state.pageIndex === 0}>
                    上一张
                </button>
                <span className="page-indicator">
                    {state.pageIndex + 1} / {state.pages.length}
                </span>
                <button
                    onClick={handleNextPage}
                    disabled={state.pageIndex === state.pages.length - 1}
                >
                    下一张
                </button>
            </div>

            <div className="toolbar-group">
                <button onClick={handleAddText}>添加文字</button>
                <button onClick={handleInsertImage}>插图</button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                />
            </div>

            <div className="toolbar-group">
                <button className="download-btn" onClick={handleDownload}>
                    下载 PNG
                </button>
            </div>
        </div>
    );
}
