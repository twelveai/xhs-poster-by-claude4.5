// src/App.tsx
import { useRef } from "react";
import type Konva from "konva";
import { EditorProvider } from "./store/useStore";
import { Toolbar } from "./components/Toolbar";
import { Canvas } from "./components/Canvas";
import { PropertyPanel } from "./components/PropertyPanel";
import "./App.css";

function AppContent() {
  const stageRef = useRef<Konva.Stage>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="app">
      <header className="app-header">
        <Toolbar stageRef={stageRef} />
      </header>
      <main className="app-main">
        <div className="canvas-container" ref={containerRef}>
          <Canvas ref={stageRef} containerRef={containerRef} />
        </div>
        <aside className="property-sidebar">
          <PropertyPanel />
        </aside>
      </main>
    </div>
  );
}

function App() {
  return (
    <EditorProvider>
      <AppContent />
    </EditorProvider>
  );
}

export default App;
