// src/components/PropertyPanel.tsx
import { useEditor } from "../store/useStore";
import type { TextNode, ImageNode } from "../types";

export function PropertyPanel() {
    const { state, dispatch, currentNodes } = useEditor();

    const selectedNode = currentNodes.find(
        (node) => node.id === state.selectedNodeId
    );

    if (!selectedNode) {
        return (
            <div className="property-panel">
                <div className="panel-header">属性面板</div>
                <div className="panel-empty">请选择一个元素</div>
            </div>
        );
    }

    const handleUpdate = (updates: Partial<TextNode | ImageNode>) => {
        dispatch({
            type: "UPDATE_NODE",
            nodeId: selectedNode.id,
            updates,
        });
    };

    if (selectedNode.type === "text") {
        const textNode = selectedNode as TextNode;
        return (
            <div className="property-panel">
                <div className="panel-header">文本属性</div>

                <div className="property-item">
                    <label>字号</label>
                    <input
                        type="number"
                        value={textNode.fontSize}
                        min={12}
                        max={120}
                        onChange={(e) =>
                            handleUpdate({ fontSize: parseInt(e.target.value) || 40 })
                        }
                    />
                </div>

                <div className="property-item">
                    <label>颜色</label>
                    <input
                        type="color"
                        value={textNode.fill}
                        onChange={(e) => handleUpdate({ fill: e.target.value })}
                    />
                </div>

                <div className="property-item">
                    <label>行高</label>
                    <input
                        type="number"
                        value={textNode.lineHeight}
                        min={0.8}
                        max={3}
                        step={0.1}
                        onChange={(e) =>
                            handleUpdate({ lineHeight: parseFloat(e.target.value) || 1.3 })
                        }
                    />
                </div>

                <div className="property-item">
                    <label>对齐</label>
                    <select
                        value={textNode.align}
                        onChange={(e) =>
                            handleUpdate({ align: e.target.value as "left" | "center" | "right" })
                        }
                    >
                        <option value="left">左对齐</option>
                        <option value="center">居中</option>
                        <option value="right">右对齐</option>
                    </select>
                </div>
            </div>
        );
    }

    if (selectedNode.type === "image") {
        const imageNode = selectedNode as ImageNode;
        return (
            <div className="property-panel">
                <div className="panel-header">图片属性</div>

                <div className="property-item">
                    <label>旋转角度</label>
                    <input
                        type="number"
                        value={imageNode.rotation || 0}
                        min={-180}
                        max={180}
                        onChange={(e) =>
                            handleUpdate({ rotation: parseInt(e.target.value) || 0 })
                        }
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="property-panel">
            <div className="panel-header">属性面板</div>
            <div className="panel-empty">该元素不支持编辑</div>
        </div>
    );
}
