// src/components/nodes/ImageNode.tsx
import { useEffect, useState } from "react";
import { Image } from "react-konva";
import type { ImageNode as ImageNodeType } from "../../types";
import type Konva from "konva";

type ImageNodeProps = {
    node: ImageNodeType;
    isSelected: boolean;
    onSelect: () => void;
    onDragEnd: (x: number, y: number) => void;
    onTransformEnd: (attrs: Partial<ImageNodeType>) => void;
    nodeRef?: React.RefObject<Konva.Image | null>;
};

export function ImageNodeComponent({
    node,
    isSelected,
    onSelect,
    onDragEnd,
    onTransformEnd,
    nodeRef,
}: ImageNodeProps) {
    const [image, setImage] = useState<HTMLImageElement | null>(null);

    useEffect(() => {
        const img = new window.Image();
        img.src = node.src;
        img.onload = () => {
            setImage(img);
        };
    }, [node.src]);

    if (!image) return null;

    return (
        <Image
            ref={nodeRef}
            id={node.id}
            image={image}
            x={node.x}
            y={node.y}
            width={node.width}
            height={node.height}
            scaleX={node.scaleX}
            scaleY={node.scaleY}
            rotation={node.rotation}
            draggable={node.draggable !== false}
            onClick={onSelect}
            onTap={onSelect}
            onDragEnd={(e) => {
                onDragEnd(e.target.x(), e.target.y());
            }}
            onTransformEnd={(e) => {
                const node = e.target;
                const scaleX = node.scaleX();
                const scaleY = node.scaleY();

                // 重置 scale，将其应用到 width/height
                node.scaleX(1);
                node.scaleY(1);

                onTransformEnd({
                    x: node.x(),
                    y: node.y(),
                    width: Math.max(20, node.width() * scaleX),
                    height: Math.max(20, node.height() * scaleY),
                    rotation: node.rotation(),
                });
            }}
            // 添加视觉反馈
            opacity={isSelected ? 1 : 0.95}
        />
    );
}
