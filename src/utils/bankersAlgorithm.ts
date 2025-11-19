export interface BankersResult {
  isSafe: boolean;
  safeSequence: number[];
  steps: string[];
}

export function calculateBankersAlgorithm(
  available: number[],
  maximum: number[][],
  allocation: number[][]
): BankersResult {
  const numProcesses = maximum.length;
  const numResources = available.length;

  // Calculate Need matrix (Maximum - Allocation)
  const need = maximum.map((maxRow, i) =>
    maxRow.map((maxVal, j) => maxVal - (allocation[i]?.[j] || 0))
  );

  // Track which processes have finished
  const finished = new Array(numProcesses).fill(false);
  const safeSequence: number[] = [];
  const work = [...available]; // Current available resources
  const steps: string[] = [];

  steps.push(`Initial Available: [${work.join(', ')}]`);

  let count = 0;

  // Try to find a safe sequence
  while (count < numProcesses) {
    let found = false;

    for (let i = 0; i < numProcesses; i++) {
      if (finished[i]) continue;

      // Check if process i can be satisfied
      let canProceed = true;
      for (let j = 0; j < numResources; j++) {
        if (need[i][j] > work[j]) {
          canProceed = false;
          break;
        }
      }

      if (canProceed) {
        // Process i can complete
        steps.push(
          `P${i} can execute. Need: [${need[i].join(', ')}], Available: [${work.join(', ')}]`
        );

        // Add allocated resources back to work
        for (let j = 0; j < numResources; j++) {
          work[j] += allocation[i][j];
        }

        steps.push(
          `P${i} completed. Released: [${allocation[i].join(', ')}], New Available: [${work.join(', ')}]`
        );

        safeSequence.push(i);
        finished[i] = true;
        found = true;
        count++;
        break;
      }
    }

    // If no process can proceed, system is in unsafe state
    if (!found) {
      steps.push('No process can proceed with current available resources. System is UNSAFE.');
      return {
        isSafe: false,
        safeSequence: [],
        steps,
      };
    }
  }

  steps.push(`All processes completed successfully. Safe sequence found: P${safeSequence.join(' → P')}`);

  return {
    isSafe: true,
    safeSequence,
    steps,
  };
}
