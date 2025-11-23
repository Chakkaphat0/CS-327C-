export interface BankersResult {
  isSafe: boolean;
  safeSequence: number[];
  steps: string[];
  deadlockInfo?: {
    remainingProcesses: number[];
    blockedReasons: { process: number; need: number[]; available: number[] }[];
  };
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

  steps.push(`Initial Available Resources: [${work.join(', ')}]`);
  steps.push('---');

  let count = 0;
  let iterationCount = 0;

  // Try to find a safe sequence
  while (count < numProcesses) {
    let found = false;
    iterationCount++;
    
    steps.push(`\nIteration ${iterationCount}:`);
    steps.push(`Available: [${work.join(', ')}]`);

    for (let i = 0; i < numProcesses; i++) {
      if (finished[i]) continue;

      // Check if process i can be satisfied
      let canProceed = true;
      const insufficientResources: number[] = [];
      
      for (let j = 0; j < numResources; j++) {
        if (need[i][j] > work[j]) {
          canProceed = false;
          insufficientResources.push(j);
        }
      }

      if (canProceed) {
        // Process i can complete
        steps.push(
          `✓ P${i} can execute - Need: [${need[i].join(', ')}] ≤ Available: [${work.join(', ')}]`
        );

        // Add allocated resources back to work
        for (let j = 0; j < numResources; j++) {
          work[j] += allocation[i][j];
        }

        steps.push(
          `  P${i} completes and releases: [${allocation[i].join(', ')}]`
        );
        steps.push(
          `  New Available: [${work.join(', ')}]`
        );

        safeSequence.push(i);
        finished[i] = true;
        found = true;
        count++;
        break;
      } else {
        // Log why process cannot proceed
        const lackingResources = insufficientResources.map(idx => `R${idx}`).join(', ');
        steps.push(
          `✗ P${i} cannot execute - Need: [${need[i].join(', ')}], lacks sufficient ${lackingResources}`
        );
      }
    }

    // If no process can proceed, system is in unsafe state
    if (!found) {
      steps.push('\n⚠️  DEADLOCK DETECTED ⚠️');
      steps.push('---');
      steps.push('No process can proceed with current available resources.');
      
      // Collect information about remaining processes
      const remainingProcesses: number[] = [];
      const blockedReasons: { process: number; need: number[]; available: number[] }[] = [];
      
      for (let i = 0; i < numProcesses; i++) {
        if (!finished[i]) {
          remainingProcesses.push(i);
          blockedReasons.push({
            process: i,
            need: [...need[i]],
            available: [...work],
          });
          
          steps.push(`\nP${i} is blocked:`);
          steps.push(`  Needs: [${need[i].join(', ')}]`);
          steps.push(`  Available: [${work.join(', ')}]`);
          
          // Show which specific resources are insufficient
          const lackingDetails: string[] = [];
          for (let j = 0; j < numResources; j++) {
            if (need[i][j] > work[j]) {
              lackingDetails.push(`R${j}: needs ${need[i][j]} but only ${work[j]} available (short by ${need[i][j] - work[j]})`);
            }
          }
          steps.push(`  Insufficient: ${lackingDetails.join(', ')}`);
        }
      }
      
      steps.push('\n---');
      steps.push(`Deadlock Reason: ${remainingProcesses.length} process(es) [${remainingProcesses.map(p => 'P' + p).join(', ')}] are waiting for resources that cannot be satisfied.`);
      steps.push('These processes are holding resources that other processes need, creating a circular wait condition.');
      
      return {
        isSafe: false,
        safeSequence: [],
        steps,
        deadlockInfo: {
          remainingProcesses,
          blockedReasons,
        },
      };
    }
  }

  steps.push('\n---');
  steps.push(`✓ SUCCESS: All processes completed safely.`);
  steps.push(`Safe Sequence: ${safeSequence.map(p => 'P' + p).join(' → ')}`);

  return {
    isSafe: true,
    safeSequence,
    steps,
  };
}