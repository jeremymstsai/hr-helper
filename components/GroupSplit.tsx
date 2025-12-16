import React, { useState } from 'react';
import { Users, Shuffle, Copy, Download } from 'lucide-react';
import { Person } from '../types';
import { shuffleArray } from '../utils';

interface GroupSplitProps {
  names: Person[];
}

export const GroupSplit: React.FC<GroupSplitProps> = ({ names }) => {
  const [groupSize, setGroupSize] = useState<number>(4);
  const [groups, setGroups] = useState<Person[][]>([]);
  const [generated, setGenerated] = useState(false);

  const handleSplit = () => {
    if (names.length === 0) return;
    
    // Validate size
    const size = Math.max(1, Math.floor(groupSize));
    
    const shuffled = shuffleArray<Person>(names);
    const newGroups: Person[][] = [];
    
    for (let i = 0; i < shuffled.length; i += size) {
      newGroups.push(shuffled.slice(i, i + size));
    }
    
    setGroups(newGroups);
    setGenerated(true);
  };

  const copyToClipboard = () => {
    const text = groups.map((group, idx) => {
        return `第 ${idx + 1} 組: ${group.map(p => p.name).join(', ')}`;
    }).join('\n');
    
    navigator.clipboard.writeText(text).then(() => {
        alert('分組結果已複製！');
    });
  };

  const downloadCSV = () => {
    // Add BOM for Excel compatibility with UTF-8
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    csvContent += "組別,姓名\n";

    groups.forEach((group, index) => {
        group.forEach(person => {
            csvContent += `第 ${index + 1} 組,${person.name}\n`;
        });
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `分組結果_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">自動分組</h2>
        <p className="mt-2 text-gray-600">將 {names.length} 位人員隨機分配到不同組別</p>
      </div>

      {/* Controls */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center space-y-6">
        <div className="w-full max-w-md">
            <label className="block text-sm font-medium text-gray-700 mb-2">每組人數</label>
            <div className="flex items-center space-x-4">
                <input 
                    type="range" 
                    min="2" 
                    max={Math.max(2, names.length)} 
                    value={groupSize}
                    onChange={(e) => setGroupSize(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <span className="text-2xl font-bold text-indigo-600 w-12 text-center">{groupSize}</span>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
                預計分為 {Math.ceil(names.length / groupSize)} 組
            </p>
        </div>

        <button
            onClick={handleSplit}
            disabled={names.length === 0}
            className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center"
        >
            <Shuffle className="w-5 h-5 mr-2" />
            開始隨機分組
        </button>
      </div>

      {/* Results */}
      {generated && (
        <div className="space-y-6 animate-in zoom-in-95 duration-500">
            <div className="flex justify-between items-end border-b border-gray-200 pb-2">
                <h3 className="text-xl font-bold text-gray-800">分組結果</h3>
                <div className="flex space-x-2">
                    <button 
                        onClick={copyToClipboard}
                        className="text-sm text-gray-600 hover:text-indigo-600 flex items-center font-medium px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <Copy className="w-4 h-4 mr-1.5" /> 複製文字
                    </button>
                    <button 
                        onClick={downloadCSV}
                        className="text-sm bg-indigo-50 text-indigo-700 hover:bg-indigo-100 flex items-center font-medium px-3 py-1.5 rounded-lg transition-colors border border-indigo-200"
                    >
                        <Download className="w-4 h-4 mr-1.5" /> 下載 CSV
                    </button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {groups.map((group, idx) => (
                    <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                            <span className="font-bold text-gray-700">第 {idx + 1} 組</span>
                            <span className="text-xs bg-white border border-gray-200 px-2 py-0.5 rounded-full text-gray-500">
                                {group.length} 人
                            </span>
                        </div>
                        <div className="p-4">
                            <ul className="space-y-2">
                                {group.map((person) => (
                                    <li key={person.id} className="flex items-center text-gray-600">
                                        <div className="w-2 h-2 rounded-full bg-indigo-400 mr-2"></div>
                                        {person.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};