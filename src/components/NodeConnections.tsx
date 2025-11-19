interface Node {
  id: string;
  x: number;
  y: number;
  color: string;
  parentId: string | null;
}

interface NodeConnectionsProps {
  nodes: Record<string, Node>;
}

export function NodeConnections({ nodes }: NodeConnectionsProps) {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
      {Object.values(nodes).map((node) => {
        if (!node.parentId) return null;

        const parent = nodes[node.parentId];
        if (!parent) return null;

        return (
          <line
            key={`${parent.id}-${node.id}`}
            x1={parent.x}
            y1={parent.y}
            x2={node.x}
            y2={node.y}
            stroke={parent.color}
            strokeWidth="2"
            strokeOpacity="0.5"
          />
        );
      })}
    </svg>
  );
}
