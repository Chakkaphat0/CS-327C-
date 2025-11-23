import { Package } from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface AvailableResourcesProps {
  available: number[];
  numResources: number;
  onChange: (available: number[]) => void;
}

export function AvailableResources({ available, numResources, onChange }: AvailableResourcesProps) {
  const handleChange = (index: number, value: string) => {
    const newAvailable = [...available];
    newAvailable[index] = parseInt(value) || 0;
    onChange(newAvailable);
  };

  return (
    <div className="border border-slate-200 rounded-lg p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="flex items-center gap-2 mb-4">
        <Package className="w-5 h-5 text-blue-600" />
        <h3 className="text-slate-900">Available Resources</h3>
      </div>
      <p className="text-sm text-slate-600 mb-4">
        Current number of available instances for each resource type
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {Array.from({ length: numResources }).map((_, index) => (
          <div key={index}>
            <Label htmlFor={`available-${index}`} className="text-slate-700">
              Resource R{index}
            </Label>
            <Input
              id={`available-${index}`}
              type="number"
              min="0"
              value={available[index] || 0}
              onChange={(e) => handleChange(index, e.target.value)}
              className="mt-1 bg-white"
            />
          </div>
        ))}
      </div>
    </div>
  );
}