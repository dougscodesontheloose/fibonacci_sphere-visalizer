import React from 'react';
import { SphereConfig } from '../types';
import { Settings2, RotateCcw, Sun, Moon, Database } from 'lucide-react';

interface ControlsProps {
  config: SphereConfig;
  setConfig: React.Dispatch<React.SetStateAction<SphereConfig>>;
  onReset: () => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

const Controls: React.FC<ControlsProps> = ({ config, setConfig, onReset, theme, toggleTheme }) => {
  const isDark = theme === 'dark';
  const borderColor = isDark ? 'border-nasa-border' : 'border-black';
  const bgColor = isDark ? 'bg-nasa-gray' : 'bg-white';
  const textColor = isDark ? 'text-gray-300' : 'text-gray-800';
  const headerColor = isDark ? 'text-white' : 'text-black';
  const trackColor = isDark ? 'bg-gray-700' : 'bg-gray-300';

  const handleChange = <K extends keyof SphereConfig>(key: K, value: SphereConfig[K]) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className={`absolute top-6 left-6 z-10 w-80 ${bgColor} border-2 ${borderColor} p-0 shadow-none font-mono`}>
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-3 border-b-2 ${borderColor}`}>
        <div className="flex items-center gap-2">
           <Database size={16} className="text-nasa-orange" />
           <h2 className={`text-sm font-bold uppercase tracking-widest ${headerColor}`}>
             Control_Unit
           </h2>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={toggleTheme}
                className={`p-1 ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-black'} transition-colors`}
                title="Toggle Theme"
            >
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button 
              onClick={onReset}
              className={`p-1 ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-black'} transition-colors`}
              title="Reset"
            >
              <RotateCcw size={16} />
            </button>
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* Points Slider */}
        <div className="relative group">
          <label className={`flex justify-between text-[10px] uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-500'} mb-2`}>
            <span>Data_Points</span>
            <span className="text-nasa-orange font-bold">[{config.points}]</span>
          </label>
          <input
            type="range"
            min="10"
            max="5000"
            step="10"
            value={config.points}
            onChange={(e) => handleChange('points', parseInt(e.target.value))}
            className={`w-full h-1 ${trackColor} appearance-none cursor-pointer accent-nasa-orange hover:accent-orange-500 rounded-none`}
          />
        </div>

        {/* Radius Slider */}
        <div>
          <label className={`flex justify-between text-[10px] uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-500'} mb-2`}>
            <span>Orbit_Radius</span>
            <span className="text-nasa-orange font-bold">[{config.radius.toFixed(1)}]</span>
          </label>
          <input
            type="range"
            min="5"
            max="30"
            step="0.5"
            value={config.radius}
            onChange={(e) => handleChange('radius', parseFloat(e.target.value))}
            className={`w-full h-1 ${trackColor} appearance-none cursor-pointer accent-nasa-orange rounded-none`}
          />
        </div>

        {/* Point Size */}
        <div>
          <label className={`flex justify-between text-[10px] uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-500'} mb-2`}>
            <span>Entity_Scale</span>
            <span className="text-nasa-orange font-bold">[{config.pointSize.toFixed(2)}]</span>
          </label>
          <input
            type="range"
            min="0.01"
            max="1.0"
            step="0.01"
            value={config.pointSize}
            onChange={(e) => handleChange('pointSize', parseFloat(e.target.value))}
            className={`w-full h-1 ${trackColor} appearance-none cursor-pointer accent-nasa-orange rounded-none`}
          />
        </div>

        {/* Rotation Speed */}
        <div>
          <label className={`flex justify-between text-[10px] uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-500'} mb-2`}>
            <span>Spin_Velocity</span>
            <span className="text-nasa-orange font-bold">[{config.rotationSpeed.toFixed(2)}]</span>
          </label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.05"
            value={config.rotationSpeed}
            onChange={(e) => handleChange('rotationSpeed', parseFloat(e.target.value))}
            className={`w-full h-1 ${trackColor} appearance-none cursor-pointer accent-nasa-orange rounded-none`}
          />
        </div>

        {/* Toggles */}
        <div className="flex items-center justify-between pt-2 border-t border-dashed border-gray-600">
            <label className={`text-xs ${textColor} flex items-center gap-2 cursor-pointer uppercase tracking-wide`}>
                <div className={`w-3 h-3 border ${isDark ? 'border-gray-500' : 'border-black'} flex items-center justify-center`}>
                    {config.showLines && <div className="w-2 h-2 bg-nasa-orange"></div>}
                </div>
                <input 
                    type="checkbox" 
                    checked={config.showLines}
                    onChange={(e) => handleChange('showLines', e.target.checked)}
                    className="hidden"
                />
                Render_Spiral
            </label>
        </div>

        {/* Color Scheme */}
        <div>
             <label className={`block text-[10px] uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-500'} mb-2`}>Spectral_Mode</label>
             <div className="flex gap-1">
                 {(['golden', 'rainbow', 'cyber'] as const).map((scheme) => (
                     <button
                        key={scheme}
                        onClick={() => handleChange('colorScheme', scheme)}
                        className={`flex-1 text-[10px] py-2 border uppercase tracking-tighter transition-all ${
                            config.colorScheme === scheme 
                            ? `border-nasa-orange ${isDark ? 'bg-nasa-orange text-black' : 'bg-nasa-orange text-white'} font-bold`
                            : `${borderColor} ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} ${textColor}`
                        }`}
                     >
                         {scheme}
                     </button>
                 ))}
             </div>
        </div>
      </div>
      
      {/* Footer deco */}
      <div className={`h-1 w-full ${isDark ? 'bg-gray-800' : 'bg-gray-200'} flex`}>
          <div className="w-1/4 h-full bg-nasa-orange"></div>
          <div className="w-1/12 h-full bg-transparent"></div>
          <div className={`w-1/12 h-full ${isDark ? 'bg-gray-600' : 'bg-gray-400'}`}></div>
      </div>
    </div>
  );
};

export default Controls;