import { useState } from 'react';
import { Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface SetupPanelProps {
  numProcesses: number;
  numResources: number;
  onSetup: (processes: number, resources: number) => void;
  isLocked: boolean;
}

export function SetupPanel({ numProcesses, numResources, onSetup, isLocked }: SetupPanelProps) {
  const [processes, setProcesses] = useState(numProcesses);
  const [resources, setResources] = useState(numResources);

  const handleSetup = () => {
    if (processes > 0 && processes <= 20 && resources > 0 && resources <= 10) {
      onSetup(processes, resources);
    }
  };

  return (
    <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5 text-slate-700" />
        <h3 className="text-slate-900">Setup Configuration</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="processes">Number of Processes</Label>
          <Input
            id="processes"
            type="number"
            min="1"
            max="20"
            value={processes}
            onChange={(e) => setProcesses(parseInt(e.target.value) || 1)}
            disabled={isLocked}
            className="mt-1"
          />
          <p className="text-sm text-slate-500 mt-1">Max: 20</p>
        </div>

        <div>
          <Label htmlFor="resources">Number of Resources</Label>
          <Input
            id="resources"
            type="number"
            min="1"
            max="10"
            value={resources}
            onChange={(e) => setResources(parseInt(e.target.value) || 1)}
            disabled={isLocked}
            className="mt-1"
          />
          <p className="text-sm text-slate-500 mt-1">Max: 10</p>
        </div>

        <div className="flex items-end ">
          <Button
            onClick={handleSetup}
            disabled={isLocked}
            className="w-full"
          >
            {isLocked ? 'Configuration Locked' : 'Initialize Matrices'}
          </Button>
        </div>
      </div>
    </div>
  );
}
