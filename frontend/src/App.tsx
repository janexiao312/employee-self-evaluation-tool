import React from 'react';

/**
 * Root application component.
 * Full implementation wired in subsequent tasks (AppShell, SessionGate, StepRouter).
 */
function App(): React.ReactElement {
  return (
    <div className="min-h-screen bg-slate-50">
      <h1 className="sr-only">Employee Self-Evaluation Tool</h1>
      {/* AppShell, SessionGate, and StepRouter will be composed here in tasks 8.x */}
    </div>
  );
}

export default App;
