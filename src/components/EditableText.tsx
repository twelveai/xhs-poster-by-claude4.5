// src/components/EditableText.tsx
import { useEffect, useRef } from "react";
import type { TextNode } from "../types";

type EditableTextProps = {
    node: TextNode;
    stageContainerRef: React.RefObject<HTMLDivElement | null>;
    scale: number;
    onComplete: (text: string) => void;
    onCancel: () => void;
};

export function EditableText({
    node,
    stageContainerRef,
    scale,
    onComplete,
    onCancel,
}: EditableTextProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const textarea = textareaRef.current;
        const container = stageContainerRef.current;
        if (!textarea || !container) return;

        // 获取容器位置
        const containerRect = container.getBoundingClientRect();

        // 计算 textarea 位置
        const x = containerRect.left + node.x * scale;
        const y = containerRect.top + node.y * scale;
        const width = (node.width || 400) * scale;

        // 设置样式
        textarea.style.position = "fixed";
        textarea.style.left = `${x}px`;
        textarea.style.top = `${y}px`;
        textarea.style.width = `${width}px`;
        textarea.style.minHeight = "50px";
        textarea.style.fontSize = `${node.fontSize * scale}px`;
        textarea.style.fontFamily = node.fontFamily;
        textarea.style.color = node.fill;
        textarea.style.lineHeight = String(node.lineHeight);
        textarea.style.textAlign = node.align;
        textarea.style.border = "2px solid #1890ff";
        textarea.style.borderRadius = "4px";
        textarea.style.padding = "4px";
        textarea.style.outline = "none";
        textarea.style.resize = "none";
        textarea.style.background = "rgba(255, 255, 255, 0.95)";
        textarea.style.zIndex = "1000";
        textarea.style.overflow = "hidden";

        // 自动聚焦并选中
        textarea.focus();
        textarea.select();

        // 自动调整高度
        const adjustHeight = () => {
            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight}px`;
        };
        adjustHeight();
        textarea.addEventListener("input", adjustHeight);

        return () => {
            textarea.removeEventListener("input", adjustHeight);
        };
    }, [node, scale, stageContainerRef]);

    const handleBlur = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            onComplete(textarea.value);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Escape") {
            onCancel();
        }
        // Ctrl/Cmd + Enter 完成编辑
        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
            handleBlur();
        }
    };

    return (
        <textarea
            ref={textareaRef}
            defaultValue={node.text}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
        />
    );
}
