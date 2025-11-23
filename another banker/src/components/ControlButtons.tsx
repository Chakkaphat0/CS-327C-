import { Play, RotateCcw, FileText } from 'lucide-react';
import { Button } from './ui/button';

interface ControlButtonsProps {
  onCalculate: () => void;
  onReset: () => void;
  onLoadExample: () => void;
}

export function ControlButtons({ onCalculate, onReset, onLoadExample }: ControlButtonsProps) {
  return (
    <div className="flex flex-wrap gap-3 pt-2">
      <Button onClick={onCalculate} className="flex-1 min-w-[150px]">
        <Play className="w-4 h-4 mr-2" />
        Calculate Safe Sequence
      </Button>
      <Button onClick={onReset} variant="outline" className="flex-1 min-w-[150px]">
        <RotateCcw className="w-4 h-4 mr-2" />
        Reset Configuration
      </Button>
      <Button onClick={onLoadExample} variant="secondary" className="flex-1 min-w-[150px]">
        <FileText className="w-4 h-4 mr-2" />
        Load Example
      </Button>
    </div>
  );
}
