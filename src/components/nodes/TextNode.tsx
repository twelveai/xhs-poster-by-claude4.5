// src/components/nodes/TextNode.tsx
import { Text } from "react-konva";
import type { TextNode as TextNodeType } from "../../types";
import type Konva from "konva";

type TextNodeProps = {
    node: TextNodeType;
    isSelected: boolean;
    onSelect: () => void;
    onDragEnd: (x: number, y: number) => void;
    onDblClick: () => void;
    nodeRef?: React.RefObject<Konva.Text | null>;
};

export function TextNodeComponent({
    node,
    isSelected,
    onSelect,
    onDragEnd,
    onDblClick,
    nodeRef,
}: TextNodeProps) {
    return (
        <Text
            ref={nodeRef}
            id={node.id}
            x={node.x}
            y={node.y}
            width={node.width}
            text={node.text}
            fontSize={node.fontSize}
            fontFamily={node.fontFamily}
            fill={node.fill}
            lineHeight={node.lineHeight}
            align={node.align}
            fontStyle={node.fontStyle}
            draggable={node.draggable !== false}
            onClick={onSelect}
            onTap={onSelect}
            onDblClick={onDblClick}
            onDblTap={onDblClick}
            onDragEnd={(e) => {
                onDragEnd(e.target.x(), e.target.y());
            }}
            // 添加视觉反馈
            opacity={isSelected ? 1 : 0.95}
        />
    );
}
