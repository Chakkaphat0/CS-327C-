import { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, Check } from 'lucide-react';
import { Button } from './ui/button';

interface MindNodeProps {
  node: {
    id: string;
    text: string;
    x: number;
    y: number;
    color: string;
    parentId: string | null;
  };
  isSelected: boolean;
  onSelect: () => void;
  onUpdatePosition: (id: string, x: number, y: number) => void;
  onUpdateText: (id: string, text: string) => void;
  onUpdateColor: (id: string, color: string) => void;
  onAddChild: (parentId: string) => void;
  onDelete: (id: string) => void;
  availableColors: string[];
}

export function MindNode({
  node,
  isSelected,
  onSelect,
  onUpdatePosition,
  onUpdateText,
  onUpdateColor,
  onAddChild,
  onDelete,
  availableColors,
}: MindNodeProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(node.text);
  const nodeRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isEditing) return;
    
    e.stopPropagation();
    onSelect();
    
    const rect = nodeRef.current?.getBoundingClientRect();
    if (rect) {
      dragOffset.current = {
        x: e.clientX - rect.left - rect.width / 2,
        y: e.clientY - rect.top - rect.height / 2,
      };
    }
    
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX - dragOffset.current.x;
      const newY = e.clientY - dragOffset.current.y;
      onUpdatePosition(node.id, newX, newY);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, node.id, onUpdatePosition]);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditText(node.text);
  };

  const handleEditComplete = () => {
    if (editText.trim()) {
      onUpdateText(node.id, editText.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEditComplete();
    } else if (e.key === 'Escape') {
      setEditText(node.text);
      setIsEditing(false);
    }
  };

  return (
    <div
      ref={nodeRef}
      className="absolute"
      style={{
        left: node.x,
        top: node.y,
        transform: 'translate(-50%, -50%)',
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: isSelected ? 20 : 10,
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      <div
        className="min-w-32 px-4 py-3 rounded-lg shadow-lg border-2 transition-all"
        style={{
          backgroundColor: node.color,
          borderColor: isSelected ? '#1e293b' : 'transparent',
          transform: isSelected ? 'scale(1.05)' : 'scale(1)',
        }}
      >
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleEditComplete}
            onKeyDown={handleKeyDown}
            className="w-full bg-white/90 px-2 py-1 rounded text-slate-900 outline-none"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          />
        ) : (
          <div className="text-white text-center select-none">{node.text}</div>
        )}
      </div>

      {isSelected && (
        <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 flex gap-2 bg-white rounded-lg shadow-lg p-2 border border-slate-200">
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onAddChild(node.id);
            }}
            className="h-8 w-8 p-0"
          >
            <Plus className="w-4 h-4" />
          </Button>
          
          {node.parentId && (
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(node.id);
              }}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      )}

      {isSelected && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex gap-1 bg-white rounded-lg shadow-lg p-2 border border-slate-200">
          {availableColors.map((color) => (
            <button
              key={color}
              className="w-6 h-6 rounded-full border-2 hover:scale-110 transition-transform"
              style={{
                backgroundColor: color,
                borderColor: color === node.color ? '#1e293b' : 'transparent',
              }}
              onClick={(e) => {
                e.stopPropagation();
                onUpdateColor(node.id, color);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
