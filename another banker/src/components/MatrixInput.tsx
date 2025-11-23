import { Table } from 'lucide-react';
import { Input } from './ui/input';

interface MatrixInputProps {
  title: string;
  description: string;
  matrix: number[][];
  numProcesses: number;
  numResources: number;
  onChange: (matrix: number[][]) => void;
}

export function MatrixInput({
  title,
  description,
  matrix,
  numProcesses,
  numResources,
  onChange,
}: MatrixInputProps) {
  const handleChange = (processIndex: number, resourceIndex: number, value: string) => {
    const newMatrix = matrix.map(row => [...row]);
    newMatrix[processIndex][resourceIndex] = parseInt(value) || 0;
    onChange(newMatrix);
  };

  const getColorScheme = () => {
    if (title.includes('Maximum')) {
      return 'from-purple-50 to-pink-50 border-purple-200';
    }
    return 'from-amber-50 to-orange-50 border-amber-200';
  };

  return (
    <div className={`border rounded-lg p-4 bg-gradient-to-br ${getColorScheme()}`}>
      <div className="flex items-center gap-2 mb-2">
        <Table className="w-5 h-5 text-slate-700" />
        <h3 className="text-slate-900">{title}</h3>
      </div>
      <p className="text-sm text-slate-600 mb-4">{description}</p>

      <div className="overflow-x-auto bg-white rounded-lg border border-slate-200">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-slate-300 bg-slate-100 px-3 py-2 text-slate-700">Process</th>
              {Array.from({ length: numResources }).map((_, index) => (
                <th key={index} className="border border-slate-300 bg-slate-100 px-3 py-2 text-slate-700">
                  R{index}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: numProcesses }).map((_, processIndex) => (
              <tr key={processIndex}>
                <td className="border border-slate-300 bg-slate-50 px-3 py-2 text-center text-slate-700">
                  P{processIndex}
                </td>
                {Array.from({ length: numResources }).map((_, resourceIndex) => (
                  <td key={resourceIndex} className="border border-slate-300 p-1 bg-white">
                    <Input
                      type="number"
                      min="0"
                      value={matrix[processIndex]?.[resourceIndex] || 0}
                      onChange={(e) => handleChange(processIndex, resourceIndex, e.target.value)}
                      className="text-center h-8"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}