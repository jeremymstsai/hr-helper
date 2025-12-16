import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { NameInput } from './components/NameInput';
import { LuckyDraw } from './components/LuckyDraw';
import { GroupSplit } from './components/GroupSplit';
import { Footer } from './components/Footer';
import { Person, AppMode } from './types';

function App() {
  const [mode, setMode] = useState<AppMode>(AppMode.INPUT);
  const [names, setNames] = useState<Person[]>([]);

  const renderContent = () => {
    switch (mode) {
      case AppMode.INPUT:
        return <NameInput names={names} setNames={setNames} />;
      case AppMode.DRAW:
        return <LuckyDraw names={names} />;
      case AppMode.GROUPS:
        return <GroupSplit names={names} />;
      default:
        return <NameInput names={names} setNames={setNames} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar currentMode={mode} setMode={setMode} count={names.length} />
      
      <main className="flex-grow w-full">
        <div className="py-8 px-4 sm:px-6 lg:px-8">
            {renderContent()}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
