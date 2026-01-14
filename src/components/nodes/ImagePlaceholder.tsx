// src/components/nodes/ImagePlaceholder.tsx
import { useRef } from "react";
import { Group, Rect, Text } from "react-konva";
import type { ImagePlaceholderNode, ImageNode } from "../../types";

type ImagePlaceholderProps = {
    node: ImagePlaceholderNode;
    isSelected: boolean;
    onSelect: () => void;
    onDragEnd: (x: number, y: number) => void;
    onReplace: (newNode: ImageNode) => void;
};

export function ImagePlaceholderComponent({
    node,
    isSelected,
    onSelect,
    onDragEnd,
    onReplace,
}: ImagePlaceholderProps) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleClick = () => {
        onSelect();
        // 创建一个隐藏的 file input
        if (!fileInputRef.current) {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.style.display = "none";
            input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = (event) => {
                    const src = event.target?.result as string;
                    const img = new Image();
                    img.src = src;
                    img.onload = () => {
                        // 计算适合占位符的尺寸
                        const maxWidth = node.width || 620;
                        const maxHeight = node.height || 200;
                        let width = img.width;
                        let height = img.height;

                        if (width > maxWidth) {
                            const scale = maxWidth / width;
                            width = maxWidth;
                            height = height * scale;
                        }
                        if (height > maxHeight) {
                            const scale = maxHeight / height;
                            height = maxHeight;
                            width = width * scale;
                        }

                        const newImageNode: ImageNode = {
                            id: node.id,
                            type: "image",
                            x: node.x,
                            y: node.y,
                            width,
                            height,
                            src,
                            draggable: true,
                        };
                        onReplace(newImageNode);
                    };
                };
                reader.readAsDataURL(file);
            };
            document.body.appendChild(input);
            fileInputRef.current = input;
        }
        fileInputRef.current.click();
    };

    const cornerRadius = typeof node.radius === "number" ? node.radius : node.radius[0];

    return (
        <Group
            x={node.x}
            y={node.y}
            draggable={node.draggable !== false}
            onClick={handleClick}
            onTap={handleClick}
            onDragEnd={(e) => {
                onDragEnd(e.target.x(), e.target.y());
            }}
        >
            <Rect
                width={node.width}
                height={node.height}
                fill={node.fill}
                stroke={node.stroke}
                strokeWidth={1}
                cornerRadius={cornerRadius}
                opacity={isSelected ? 0.9 : 1}
            />
            <Text
                width={node.width}
                height={node.height}
                text={node.hintText}
                fill={node.hintColor}
                fontSize={24}
                align="center"
                verticalAlign="middle"
            />
        </Group>
    );
}
