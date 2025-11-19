import { Shield, Info } from 'lucide-react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

export function Header() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-slate-900">Banker's Algorithm Simulator</h1>
            <p className="text-slate-600 mt-1">Deadlock Avoidance Algorithm</p>
          </div>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Info className="w-4 h-4 mr-2" />
              About
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Banker's Algorithm</DialogTitle>
              <DialogDescription>
                <div className="space-y-3 mt-4 text-slate-700">
                  <p>
                    The Banker's Algorithm is a deadlock avoidance algorithm that tests for safety
                    by simulating the allocation of predetermined maximum possible amounts of all
                    resources.
                  </p>
                  <div>
                    <p className="font-medium text-slate-900 mb-2">How it works:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Check if the system is in a safe state</li>
                      <li>Find a process whose need can be satisfied with available resources</li>
                      <li>Simulate process completion and resource release</li>
                      <li>Repeat until all processes complete or no safe sequence exists</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 mb-2">Matrices:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li><span className="font-medium">Available:</span> Available instances of each resource</li>
                      <li><span className="font-medium">Maximum:</span> Maximum demand of each process</li>
                      <li><span className="font-medium">Allocation:</span> Currently allocated resources</li>
                      <li><span className="font-medium">Need:</span> Remaining resource need (Max - Allocation)</li>
                    </ul>
                  </div>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
