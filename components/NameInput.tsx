import React, { useState, useRef, useMemo } from 'react';
import { Upload, FileText, Trash2, UserPlus, AlertCircle, Database, AlertTriangle, Wand2 } from 'lucide-react';
import { Person } from '../types';
import { parseNames, generateId } from '../utils';

interface NameInputProps {
  names: Person[];
  setNames: (names: Person[]) => void;
}

export const NameInput: React.FC<NameInputProps> = ({ names, setNames }) => {
  const [inputText, setInputText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Analyze duplicates
  const { duplicateNames, hasDuplicates } = useMemo(() => {
    const counts: Record<string, number> = {};
    names.forEach(p => {
      counts[p.name] = (counts[p.name] || 0) + 1;
    });
    const duplicateNames = new Set(Object.keys(counts).filter(name => counts[name] > 1));
    return { duplicateNames, hasDuplicates: duplicateNames.size > 0 };
  }, [names]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  const handleAddNames = () => {
    if (!inputText.trim()) return;
    const newNames = parseNames(inputText);
    setNames([...names, ...newNames]);
    setInputText('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const newNames = parseNames(text);
        setNames([...names, ...newNames]);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClear = () => {
    if (window.confirm('確定要清空所有名單嗎？')) {
      setNames([]);
    }
  };

  const handleLoadDemo = () => {
    const demoData = [
      "陳小美", "林志豪", "張雅婷", "王冠宇", "李淑芬", 
      "陳小美", // Duplicate
      "黃柏翰", "林怡君", "陳家豪", "張婷婷", 
      "王冠宇", // Duplicate
      "許志明", "蔡嘉玲", "楊宗緯", "吳建豪"
    ];
    const newNames = demoData.map(name => ({ id: generateId(), name }));
    
    if (names.length > 0) {
        if(window.confirm('是否要保留現有名單並加入範例資料？\n取消則會覆蓋現有名單。')) {
            setNames([...names, ...newNames]);
        } else {
            setNames(newNames);
        }
    } else {
        setNames(newNames);
    }
  };

  const handleRemoveDuplicates = () => {
    const seen = new Set();
    const uniqueNames = names.filter(person => {
      const duplicate = seen.has(person.name);
      seen.add(person.name);
      return !duplicate;
    });
    setNames(uniqueNames);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">名單管理</h2>
        <p className="mt-2 text-gray-600">
          請輸入姓名（每行一個）或上傳 CSV 檔案。目前共有 <span className="font-bold text-indigo-600">{names.length}</span> 位人員。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Input Area */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-semibold text-gray-700 flex items-center">
              <FileText className="w-4 h-4 mr-2 text-indigo-500" />
              輸入姓名
            </label>
            <div className="flex space-x-2">
               <input
                type="file"
                ref={fileInputRef}
                accept=".csv,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={handleLoadDemo}
                className="text-xs flex items-center px-2 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-md transition-colors"
                title="載入模擬範例名單"
              >
                <Wand2 className="w-3 h-3 mr-1" />
                範例
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-xs flex items-center px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
              >
                <Upload className="w-3 h-3 mr-1.5" />
                上傳 CSV
              </button>
            </div>
          </div>
          
          <textarea
            value={inputText}
            onChange={handleTextChange}
            placeholder="王小明&#10;李大同&#10;張美麗..."
            className="flex-grow w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none bg-gray-50 text-gray-800 placeholder-gray-400 text-base min-h-[200px]"
          />
          
          <button
            onClick={handleAddNames}
            disabled={!inputText.trim()}
            className="mt-4 w-full flex items-center justify-center px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg font-medium"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            加入名單
          </button>
        </div>

        {/* List Preview */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center">
                目前名單
                {hasDuplicates && (
                    <span className="ml-2 flex items-center text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        發現重複
                    </span>
                )}
            </h3>
            <div className="flex space-x-2">
                {hasDuplicates && (
                    <button
                        onClick={handleRemoveDuplicates}
                        className="text-xs text-amber-600 hover:text-amber-800 flex items-center px-2 py-1 rounded bg-amber-50 hover:bg-amber-100 transition-colors border border-amber-200"
                    >
                        <Trash2 className="w-3 h-3 mr-1" />
                        移除重複
                    </button>
                )}
                {names.length > 0 && (
                <button
                    onClick={handleClear}
                    className="text-xs text-red-500 hover:text-red-700 flex items-center px-2 py-1 rounded hover:bg-red-50 transition-colors"
                >
                    <Trash2 className="w-3 h-3 mr-1" />
                    清空
                </button>
                )}
            </div>
          </div>

          <div className="flex-grow overflow-y-auto max-h-[300px] border border-gray-100 rounded-xl bg-gray-50 p-2">
            {names.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8">
                <Database className="w-10 h-10 mb-2 opacity-30" />
                <p>目前沒有資料</p>
                <button onClick={handleLoadDemo} className="mt-4 text-sm text-indigo-500 hover:underline">
                    載入範例試試看？
                </button>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {names.map((person, idx) => {
                  const isDuplicate = duplicateNames.has(person.name);
                  return (
                    <li 
                        key={person.id} 
                        className={`py-2 px-3 flex items-center justify-between group rounded-lg transition-colors ${
                            isDuplicate ? 'bg-amber-50 hover:bg-amber-100' : 'hover:bg-white'
                        }`}
                    >
                        <span className="flex items-center">
                        <span className={`w-6 h-6 rounded-full text-xs flex items-center justify-center mr-3 font-medium ${
                            isDuplicate ? 'bg-amber-200 text-amber-800' : 'bg-indigo-100 text-indigo-600'
                        }`}>
                            {idx + 1}
                        </span>
                        <span className={`${isDuplicate ? 'text-amber-900 font-semibold' : 'text-gray-700 font-medium'}`}>
                            {person.name}
                        </span>
                        {isDuplicate && (
                            <span className="ml-2 text-[10px] bg-red-100 text-red-600 px-1.5 rounded">
                                重複
                            </span>
                        )}
                        </span>
                        <button
                            onClick={() => {
                                const newNames = names.filter(n => n.id !== person.id);
                                setNames(newNames);
                            }}
                            className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};