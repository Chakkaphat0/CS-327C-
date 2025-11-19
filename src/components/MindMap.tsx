import { useState, useRef, useCallback } from 'react';
import { MindNode } from './MindNode';
import { NodeConnections } from './NodeConnections';

export interface Node {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  parentId: string | null;
  children: string[];
}

const DEFAULT_COLORS = [
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#f59e0b', // amber
  '#10b981', // emerald
  '#06b6d4', // cyan
  '#f97316', // orange
  '#6366f1', // indigo
];

export function MindMap() {
  const [nodes, setNodes] = useState<Record<string, Node>>({
    root: {
      id: 'root',
      text: 'Main Idea',
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      color: '#3b82f6',
      parentId: null,
      children: [],
    },
  });

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const addChildNode = useCallback((parentId: string) => {
    const parent = nodes[parentId];
    if (!parent) return;

    const newId = `node-${Date.now()}`;
    const angle = parent.children.length * (Math.PI / 4);
    const distance = 200;
    
    const newNode: Node = {
      id: newId,
      text: 'New Idea',
      x: parent.x + Math.cos(angle) * distance,
      y: parent.y + Math.sin(angle) * distance,
      color: DEFAULT_COLORS[parent.children.length % DEFAULT_COLORS.length],
      parentId,
      children: [],
    };

    setNodes(prev => ({
      ...prev,
      [newId]: newNode,
      [parentId]: {
        ...prev[parentId],
        children: [...prev[parentId].children, newId],
      },
    }));
  }, [nodes]);

  const updateNodePosition = useCallback((id: string, x: number, y: number) => {
    setNodes(prev => ({
      ...prev,
      [id]: { ...prev[id], x, y },
    }));
  }, []);

  const updateNodeText = useCallback((id: string, text: string) => {
    setNodes(prev => ({
      ...prev,
      [id]: { ...prev[id], text },
    }));
  }, []);

  const updateNodeColor = useCallback((id: string, color: string) => {
    setNodes(prev => ({
      ...prev,
      [id]: { ...prev[id], color },
    }));
  }, []);

  const deleteNode = useCallback((id: string) => {
    if (id === 'root') return; // Can't delete root

    const node = nodes[id];
    if (!node) return;

    // Recursively delete all children
    const deleteRecursive = (nodeId: string) => {
      const n = nodes[nodeId];
      if (n) {
        n.children.forEach(childId => deleteRecursive(childId));
      }
    };

    deleteRecursive(id);

    setNodes(prev => {
      const newNodes = { ...prev };
      
      // Remove from parent's children
      if (node.parentId && newNodes[node.parentId]) {
        newNodes[node.parentId] = {
          ...newNodes[node.parentId],
          children: newNodes[node.parentId].children.filter(childId => childId !== id),
        };
      }

      // Delete this node and all children
      const nodesToDelete = new Set<string>();
      const collectNodes = (nodeId: string) => {
        nodesToDelete.add(nodeId);
        const n = newNodes[nodeId];
        if (n) {
          n.children.forEach(childId => collectNodes(childId));
        }
      };
      collectNodes(id);

      nodesToDelete.forEach(nodeId => {
        delete newNodes[nodeId];
      });

      return newNodes;
    });

    if (selectedNodeId === id) {
      setSelectedNodeId(null);
    }
  }, [nodes, selectedNodeId]);

  return (
    <div ref={containerRef} className="flex-1 relative overflow-hidden">
      <NodeConnections nodes={nodes} />
      
      {Object.values(nodes).map(node => (
        <MindNode
          key={node.id}
          node={node}
          isSelected={selectedNodeId === node.id}
          onSelect={() => setSelectedNodeId(node.id)}
          onUpdatePosition={updateNodePosition}
          onUpdateText={updateNodeText}
          onUpdateColor={updateNodeColor}
          onAddChild={addChildNode}
          onDelete={deleteNode}
          availableColors={DEFAULT_COLORS}
        />
      ))}
    </div>
  );
}
