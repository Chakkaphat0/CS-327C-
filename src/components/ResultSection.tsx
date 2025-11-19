import { CheckCircle2, XCircle, Table, ListOrdered } from 'lucide-react';
import { BankersResult } from '../utils/bankersAlgorithm';
import { Badge } from './ui/badge';

interface ResultSectionProps {
  result: BankersResult;
  numProcesses: number;
  numResources: number;
  maximum: number[][];
  allocation: number[][];
}

export function ResultSection({ result, numProcesses, numResources, maximum, allocation }: ResultSectionProps) {
  // Calculate Need matrix
  const need = maximum.map((maxRow, i) =>
    maxRow.map((maxVal, j) => maxVal - (allocation[i]?.[j] || 0))
  );

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
        <h2 className="text-white">Analysis Results</h2>
      </div>

      <div className="p-6 space-y-6">
        {/* Safe/Unsafe Message */}
        <div>
          <h3 className="text-slate-900 mb-3">System State</h3>
          <div
            className={`border-2 rounded-lg p-6 ${
              result.isSafe
                ? 'bg-green-50 border-green-300'
                : 'bg-red-50 border-red-300'
            }`}
          >
            <div className="flex items-center gap-3">
              {result.isSafe ? (
                <>
                  <CheckCircle2 className="w-8 h-8 text-green-600 flex-shrink-0" />
                  <div>
                    <h3 className="text-green-900">System is in SAFE State</h3>
                    <p className="text-green-700 text-sm mt-1">
                      A safe sequence exists. No deadlock will occur.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="w-8 h-8 text-red-600 flex-shrink-0" />
                  <div>
                    <h3 className="text-red-900">System is in UNSAFE State</h3>
                    <p className="text-red-700 text-sm mt-1">
                      No safe sequence exists. Deadlock may occur.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Need Matrix Display */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Table className="w-5 h-5 text-slate-700" />
            <h3 className="text-slate-900">Need Matrix</h3>
          </div>
          <p className="text-sm text-slate-600 mb-4">
            Remaining resource need for each process (Maximum - Allocation)
          </p>

          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
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
                  {need.map((row, processIndex) => (
                    <tr key={processIndex}>
                      <td className="border border-slate-300 bg-slate-50 px-3 py-2 text-center text-slate-700">
                        P{processIndex}
                      </td>
                      {row.map((value, resourceIndex) => (
                        <td
                          key={resourceIndex}
                          className="border border-slate-300 px-3 py-2 text-center text-slate-900 bg-white"
                        >
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Safe Sequence Display */}
        {result.isSafe && result.safeSequence.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ListOrdered className="w-5 h-5 text-slate-700" />
              <h3 className="text-slate-900">Safe Sequence</h3>
            </div>
            <p className="text-sm text-slate-600 mb-4">
              Order in which processes can safely execute to completion
            </p>

            <div className="border border-green-200 bg-green-50 rounded-lg p-4">
              <div className="flex flex-wrap items-center gap-2">
                {result.safeSequence.map((process, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Badge variant="default" className="text-base px-4 py-2 bg-green-600">
                      P{process}
                    </Badge>
                    {index < result.safeSequence.length - 1 && (
                      <span className="text-green-600 text-xl">→</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Execution Steps */}
        {result.steps.length > 0 && (
          <div>
            <h3 className="text-slate-900 mb-3">Execution Steps</h3>
            <p className="text-sm text-slate-600 mb-4">
              Detailed step-by-step analysis of the safety algorithm
            </p>
            
            <div className="space-y-2 max-h-96 overflow-y-auto border border-slate-200 rounded-lg p-4 bg-slate-50">
              {result.steps.map((step, index) => (
                <div
                  key={index}
                  className="bg-white border border-slate-200 rounded-lg p-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1 text-sm">
                      <p className="text-slate-900">{step}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}