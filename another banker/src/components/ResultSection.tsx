import { CheckCircle2, XCircle, Table, ListOrdered, AlertTriangle } from 'lucide-react';
import { BankersResult } from '../utils/bankersAlgorithm';
import { Badge } from './ui/badge';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

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

        {/* Deadlock Details */}
        {!result.isSafe && result.deadlockInfo && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h3 className="text-slate-900">Deadlock Analysis</h3>
            </div>
            
            <Alert className="border-red-300 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-red-900">Why Deadlock Occurred</AlertTitle>
              <AlertDescription className="text-red-800 mt-2">
                <p className="mb-3">
                  {result.deadlockInfo.remainingProcesses.length} process(es) are blocked and cannot proceed:
                </p>
                <div className="space-y-2">
                  {result.deadlockInfo.blockedReasons.map(({ process, need, available }) => {
                    const lackingResources: string[] = [];
                    need.forEach((needVal, idx) => {
                      if (needVal > available[idx]) {
                        lackingResources.push(`R${idx} (needs ${needVal}, has ${available[idx]})`);
                      }
                    });
                    
                    return (
                      <div key={process} className="bg-white/50 border border-red-200 rounded p-3">
                        <p className="font-medium">Process P{process} blocked:</p>
                        <p className="text-sm mt-1">
                          Insufficient resources: {lackingResources.join(', ')}
                        </p>
                      </div>
                    );
                  })}
                </div>
                <p className="mt-3 text-sm">
                  These processes are holding onto resources while waiting for others, 
                  creating a circular wait condition that prevents any of them from completing.
                </p>
              </AlertDescription>
            </Alert>
          </div>
        )}

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
            <h3 className="text-slate-900 mb-3">Execution Log</h3>
            <p className="text-sm text-slate-600 mb-4">
              {result.isSafe 
                ? 'Detailed step-by-step analysis of the safety algorithm'
                : 'Detailed log showing why the system entered an unsafe state'}
            </p>
            
            <div className="space-y-2 max-h-[500px] overflow-y-auto border border-slate-200 rounded-lg p-4 bg-slate-50">
              {result.steps.map((step, index) => {
                // Check for special formatting
                const isHeader = step.includes('Iteration') || step.includes('Initial');
                const isSuccess = step.includes('✓');
                const isFailed = step.includes('✗');
                const isDeadlock = step.includes('DEADLOCK') || step.includes('⚠️');
                const isDivider = step === '---';
                const isIndented = step.startsWith('  ');
                
                if (isDivider) {
                  return (
                    <div key={index} className="border-t-2 border-slate-300 my-2"></div>
                  );
                }
                
                if (isDeadlock) {
                  return (
                    <div
                      key={index}
                      className="bg-red-100 border-2 border-red-400 rounded-lg p-3"
                    >
                      <p className="text-red-900 font-medium text-center">{step}</p>
                    </div>
                  );
                }
                
                return (
                  <div
                    key={index}
                    className={`rounded-lg p-3 ${
                      isHeader
                        ? 'bg-blue-100 border border-blue-300'
                        : isSuccess
                        ? 'bg-green-50 border border-green-200'
                        : isFailed
                        ? 'bg-red-50 border border-red-200'
                        : 'bg-white border border-slate-200'
                    } ${isIndented ? 'ml-6' : ''}`}
                  >
                    <p
                      className={`text-sm ${
                        isHeader
                          ? 'text-blue-900 font-medium'
                          : isSuccess
                          ? 'text-green-800'
                          : isFailed
                          ? 'text-red-800'
                          : 'text-slate-700'
                      }`}
                    >
                      {step}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}