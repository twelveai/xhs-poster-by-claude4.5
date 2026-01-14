// src/components/Canvas.tsx
import { useRef, useEffect, useCallback, useState, forwardRef, useImperativeHandle } from "react";
import { Stage, Layer, Rect, Circle, Group, Text } from "react-konva";
import { Transformer } from "react-konva";
import type Konva from "konva";
import { useEditor } from "../store/useStore";
import { TextNodeComponent } from "./nodes/TextNode";
import { ImageNodeComponent } from "./nodes/ImageNode";
import { ImagePlaceholderComponent } from "./nodes/ImagePlaceholder";
import { EditableText } from "./EditableText";
import type { TextNode, ImageNode, PosterNode } from "../types";

type CanvasProps = {
    containerRef: React.RefObject<HTMLDivElement | null>;
};

export const Canvas = forwardRef<Konva.Stage | null, CanvasProps>(
    ({ containerRef }, ref) => {
        const { state, dispatch, currentTemplate, currentNodes } = useEditor();
        const stageRef = useRef<Konva.Stage>(null);
        const transformerRef = useRef<Konva.Transformer>(null);
        const selectedNodeRef = useRef<Konva.Node>(null);

        const [scale, setScale] = useState(0.5);
        const [editingTextId, setEditingTextId] = useState<string | null>(null);

        // 暴露 stage ref
        useImperativeHandle(ref, () => stageRef.current!);

        // 计算缩放比例
        useEffect(() => {
            const updateScale = () => {
                if (containerRef.current) {
                    const containerWidth = containerRef.current.clientWidth - 40;
                    const containerHeight = containerRef.current.clientHeight - 40;
                    const canvasWidth = currentTemplate.canvas.width;
                    const canvasHeight = currentTemplate.canvas.height;

                    const scaleX = containerWidth / canvasWidth;
                    const scaleY = containerHeight / canvasHeight;
                    const newScale = Math.min(scaleX, scaleY, 1);

                    setScale(newScale);
                }
            };

            updateScale();
            window.addEventListener("resize", updateScale);
            return () => window.removeEventListener("resize", updateScale);
        }, [containerRef, currentTemplate]);

        // 更新 Transformer
        useEffect(() => {
            const transformer = transformerRef.current;
            const stage = stageRef.current;

            if (!transformer || !stage) return;

            if (state.selectedNodeId && !editingTextId) {
                const selectedNode = stage.findOne(`#${state.selectedNodeId}`);
                if (selectedNode) {
                    transformer.nodes([selectedNode]);
                    selectedNodeRef.current = selectedNode;
                } else {
                    transformer.nodes([]);
                    selectedNodeRef.current = null;
                }
            } else {
                transformer.nodes([]);
                selectedNodeRef.current = null;
            }
        }, [state.selectedNodeId, editingTextId, currentNodes]);

        // 键盘事件处理
        useEffect(() => {
            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === "Delete" || e.key === "Backspace") {
                    // 如果正在编辑文本，不处理删除
                    if (editingTextId) return;
                    // 如果焦点在输入框中，不处理删除
                    if (document.activeElement?.tagName === "INPUT" ||
                        document.activeElement?.tagName === "TEXTAREA") return;

                    if (state.selectedNodeId) {
                        dispatch({ type: "DELETE_NODE", nodeId: state.selectedNodeId });
                    }
                }
            };

            window.addEventListener("keydown", handleKeyDown);
            return () => window.removeEventListener("keydown", handleKeyDown);
        }, [state.selectedNodeId, dispatch, editingTextId]);

        // 点击空白区域取消选中
        const handleStageClick = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
            if (e.target === e.target.getStage()) {
                dispatch({ type: "SELECT_NODE", nodeId: null });
            }
        }, [dispatch]);

        // 渲染背景渐变
        const renderBackground = () => {
            const { background, canvas } = currentTemplate;

            // 创建渐变色停
            const colorStops: Array<{ offset: number; color: string }> = [];
            for (let i = 0; i < background.colorStops.length; i += 2) {
                colorStops.push({
                    offset: background.colorStops[i] as number,
                    color: background.colorStops[i + 1] as string,
                });
            }

            return (
                <Rect
                    x={0}
                    y={0}
                    width={canvas.width}
                    height={canvas.height}
                    fillLinearGradientStartPoint={{ x: background.start.x, y: background.start.y }}
                    fillLinearGradientEndPoint={{ x: background.end.x, y: background.end.y }}
                    fillLinearGradientColorStops={background.colorStops.flatMap((v, i) =>
                        i % 2 === 0 ? [v] : [v]
                    )}
                />
            );
        };

        // 渲染基础层
        const renderBaseLayers = () => {
            return currentTemplate.baseLayers.map((layer) => {
                if (layer.type === "rect") {
                    return (
                        <Rect
                            key={layer.id}
                            x={layer.x}
                            y={layer.y}
                            width={layer.width}
                            height={layer.height}
                            fill={layer.fill}
                            cornerRadius={layer.radius}
                            shadowColor={layer.shadow?.color}
                            shadowBlur={layer.shadow?.blur}
                            shadowOffsetX={layer.shadow?.offsetX}
                            shadowOffsetY={layer.shadow?.offsetY}
                        />
                    );
                }
                if (layer.type === "circle") {
                    return (
                        <Circle
                            key={layer.id}
                            x={layer.x}
                            y={layer.y}
                            radius={layer.radius}
                            fill={layer.fill}
                            stroke={layer.stroke}
                            strokeWidth={layer.strokeWidth}
                            shadowColor={layer.shadow?.color}
                            shadowBlur={layer.shadow?.blur}
                            shadowOffsetX={layer.shadow?.offsetX}
                            shadowOffsetY={layer.shadow?.offsetY}
                        />
                    );
                }
                return null;
            });
        };

        // 渲染可编辑节点
        const renderNodes = () => {
            return currentNodes.map((node) => {
                const isSelected = state.selectedNodeId === node.id;

                if (node.type === "text") {
                    // 编辑中隐藏 Text
                    if (editingTextId === node.id) {
                        return null;
                    }
                    return (
                        <TextNodeComponent
                            key={node.id}
                            node={node}
                            isSelected={isSelected}
                            onSelect={() => dispatch({ type: "SELECT_NODE", nodeId: node.id })}
                            onDragEnd={(x, y) => {
                                dispatch({ type: "UPDATE_NODE", nodeId: node.id, updates: { x, y } });
                            }}
                            onDblClick={() => {
                                setEditingTextId(node.id);
                            }}
                        />
                    );
                }

                if (node.type === "image") {
                    return (
                        <ImageNodeComponent
                            key={node.id}
                            node={node}
                            isSelected={isSelected}
                            onSelect={() => dispatch({ type: "SELECT_NODE", nodeId: node.id })}
                            onDragEnd={(x, y) => {
                                dispatch({ type: "UPDATE_NODE", nodeId: node.id, updates: { x, y } });
                            }}
                            onTransformEnd={(attrs) => {
                                dispatch({ type: "UPDATE_NODE", nodeId: node.id, updates: attrs });
                            }}
                        />
                    );
                }

                if (node.type === "imagePlaceholder") {
                    return (
                        <ImagePlaceholderComponent
                            key={node.id}
                            node={node}
                            isSelected={isSelected}
                            onSelect={() => dispatch({ type: "SELECT_NODE", nodeId: node.id })}
                            onDragEnd={(x, y) => {
                                dispatch({ type: "UPDATE_NODE", nodeId: node.id, updates: { x, y } });
                            }}
                            onReplace={(newNode: ImageNode) => {
                                dispatch({ type: "REPLACE_NODE", nodeId: node.id, newNode });
                            }}
                        />
                    );
                }

                if (node.type === "circle") {
                    return (
                        <Circle
                            key={node.id}
                            id={node.id}
                            x={node.x}
                            y={node.y}
                            radius={node.radius}
                            fill={node.fill}
                            stroke={node.stroke}
                            strokeWidth={node.strokeWidth}
                            draggable={node.draggable !== false}
                            onClick={() => dispatch({ type: "SELECT_NODE", nodeId: node.id })}
                            onTap={() => dispatch({ type: "SELECT_NODE", nodeId: node.id })}
                            onDragEnd={(e) => {
                                dispatch({ type: "UPDATE_NODE", nodeId: node.id, updates: { x: e.target.x(), y: e.target.y() } });
                            }}
                        />
                    );
                }

                return null;
            });
        };

        // 获取编辑中的文本节点
        const editingTextNode = editingTextId
            ? currentNodes.find((n) => n.id === editingTextId) as TextNode | undefined
            : null;

        const { canvas } = currentTemplate;

        return (
            <>
                <div
                    className="canvas-wrapper"
                    style={{
                        transform: `scale(${scale})`,
                        transformOrigin: "center center",
                    }}
                >
                    <Stage
                        ref={stageRef}
                        width={canvas.width}
                        height={canvas.height}
                        onClick={handleStageClick}
                        onTap={handleStageClick}
                    >
                        <Layer>
                            {/* 背景渐变 */}
                            {renderBackground()}
                            {/* 基础层（不可编辑） */}
                            {renderBaseLayers()}
                        </Layer>
                        <Layer>
                            {/* 可编辑节点 */}
                            {renderNodes()}
                            {/* Transformer */}
                            <Transformer
                                ref={transformerRef}
                                boundBoxFunc={(oldBox, newBox) => {
                                    // 限制最小尺寸
                                    if (newBox.width < 20 || newBox.height < 20) {
                                        return oldBox;
                                    }
                                    return newBox;
                                }}
                            />
                        </Layer>
                    </Stage>
                </div>

                {/* 文本编辑覆盖层 */}
                {editingTextNode && (
                    <EditableText
                        node={editingTextNode}
                        stageContainerRef={containerRef}
                        scale={scale}
                        onComplete={(newText) => {
                            dispatch({
                                type: "UPDATE_NODE",
                                nodeId: editingTextNode.id,
                                updates: { text: newText },
                            });
                            setEditingTextId(null);
                        }}
                        onCancel={() => {
                            setEditingTextId(null);
                        }}
                    />
                )}
            </>
        );
    }
);

Canvas.displayName = "Canvas";
