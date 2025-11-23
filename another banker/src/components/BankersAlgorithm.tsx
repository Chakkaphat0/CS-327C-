import { useState } from 'react';
import { Header } from './Header';
import { SetupPanel } from './SetupPanel';
import { AvailableResources } from './AvailableResources';
import { MatrixInput } from './MatrixInput';
import { ControlButtons } from './ControlButtons';
import { ResultSection } from './ResultSection';
import { Footer } from './Footer';
import { calculateBankersAlgorithm, BankersResult } from '../utils/bankersAlgorithm';

export function BankersAlgorithm() {
  const [numProcesses, setNumProcesses] = useState(5);
  const [numResources, setNumResources] = useState(3);
  const [available, setAvailable] = useState<number[]>([3, 3, 2]);
  const [maximum, setMaximum] = useState<number[][]>([
    [7, 5, 3],
    [3, 2, 2],
    [9, 0, 2],
    [2, 2, 2],
    [4, 3, 3],
  ]);
  const [allocation, setAllocation] = useState<number[][]>([
    [0, 1, 0],
    [2, 0, 0],
    [3, 0, 2],
    [2, 1, 1],
    [0, 0, 2],
  ]);
  const [result, setResult] = useState<BankersResult | null>(null);
  const [isSetupLocked, setIsSetupLocked] = useState(false);

  const handleSetup = (processes: number, resources: number) => {
    setNumProcesses(processes);
    setNumResources(resources);
    
    // Initialize arrays with zeros
    setAvailable(new Array(resources).fill(0));
    setMaximum(Array.from({ length: processes }, () => new Array(resources).fill(0)));
    setAllocation(Array.from({ length: processes }, () => new Array(resources).fill(0)));
    setResult(null);
    setIsSetupLocked(true);
  };

  const handleCalculate = () => {
    const calculatedResult = calculateBankersAlgorithm(available, maximum, allocation);
    setResult(calculatedResult);
  };

  const handleReset = () => {
    setIsSetupLocked(false);
    setResult(null);
    setAvailable(new Array(numResources).fill(0));
    setMaximum(Array.from({ length: numProcesses }, () => new Array(numResources).fill(0)));
    setAllocation(Array.from({ length: numProcesses }, () => new Array(numResources).fill(0)));
  };

  const handleLoadExample = () => {
    setNumProcesses(5);
    setNumResources(3);
    setAvailable([3, 3, 2]);
    setMaximum([
      [7, 5, 3],
      [3, 2, 2],
      [9, 0, 2],
      [2, 2, 2],
      [4, 3, 3],
    ]);
    setAllocation([
      [0, 1, 0],
      [2, 0, 0],
      [3, 0, 2],
      [2, 1, 1],
      [0, 0, 2],
    ]);
    setIsSetupLocked(true);
    setResult(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        <Header />
        
        <div className="mt-8 space-y-6">
          {/* Input Configuration Panel */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
            <h2 className="text-slate-900 mb-6">Input Configuration</h2>
            <SetupPanel
              numProcesses={numProcesses}
              numResources={numResources}
              onSetup={handleSetup}
              isLocked={isSetupLocked}
            />
          </div>

          {/* Matrix Input Section */}
          {isSetupLocked && (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
              <h2 className="text-slate-900 mb-6">Matrix Input Section</h2>
              
              <div className="space-y-6">
                <AvailableResources
                  available={available}
                  numResources={numResources}
                  onChange={setAvailable}
                />

                <MatrixInput
                  title="Maximum Matrix"
                  description="Maximum demand of each process"
                  matrix={maximum}
                  numProcesses={numProcesses}
                  numResources={numResources}
                  onChange={setMaximum}
                />

                <MatrixInput
                  title="Allocation Matrix"
                  description="Currently allocated resources"
                  matrix={allocation}
                  numProcesses={numProcesses}
                  numResources={numResources}
                  onChange={setAllocation}
                />
              </div>
            </div>
          )}

          {/* Control Buttons */}
          {isSetupLocked && (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
              <ControlButtons
                onCalculate={handleCalculate}
                onReset={handleReset}
                onLoadExample={handleLoadExample}
              />
            </div>
          )}

          {/* Result Section */}
          {result && (
            <ResultSection
              result={result}
              numProcesses={numProcesses}
              numResources={numResources}
              maximum={maximum}
              allocation={allocation}
            />
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}