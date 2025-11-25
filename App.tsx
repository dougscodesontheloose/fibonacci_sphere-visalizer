import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Environment } from '@react-three/drei';
import FibonacciSphere from './components/FibonacciSphere';
import Controls from './components/Controls';
import InfoPanel from './components/InfoPanel';
import { SphereConfig, DEFAULT_CONFIG } from './types';

const App: React.FC = () => {
  const [config, setConfig] = useState<SphereConfig>(DEFAULT_CONFIG);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const handleReset = () => setConfig(DEFAULT_CONFIG);
  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const isDark = theme === 'dark';

  return (
    <div className={`relative w-full h-screen overflow-hidden font-mono transition-colors duration-500 ${isDark ? 'bg-nasa-black text-gray-200' : 'bg-nasa-white text-gray-900'}`}>
      
      {/* 3D Canvas Layer */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 40], fov: 45 }}>
          <color attach="background" args={[isDark ? '#0B0B0B' : '#F0F0F0']} />
          
          <ambientLight intensity={isDark ? 0.5 : 1.0} />
          <pointLight position={[50, 50, 50]} intensity={isDark ? 1.5 : 0.8} color="#fff" />
          <pointLight position={[-50, -50, -50]} intensity={0.5} color={isDark ? "#ffd700" : "#444"} />
          
          <FibonacciSphere config={config} theme={theme} />
          
          <OrbitControls 
            enablePan={false} 
            minDistance={10} 
            maxDistance={100} 
            autoRotate={false}
            dampingFactor={0.05}
          />
          
          {isDark && (
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          )}
          
          {config.colorScheme === 'cyber' && (
              <Environment preset="city" />
          )}
        </Canvas>
      </div>

      {/* Grid Overlay for Technical Look */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-10" 
           style={{ 
             backgroundImage: `linear-gradient(${isDark ? '#333' : '#ccc'} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? '#333' : '#ccc'} 1px, transparent 1px)`,
             backgroundSize: '40px 40px'
           }}>
      </div>

      {/* UI Overlay Layer */}
      <Controls 
        config={config} 
        setConfig={setConfig} 
        onReset={handleReset} 
        theme={theme}
        toggleTheme={toggleTheme}
      />
      
      <InfoPanel points={config.points} theme={theme} />

      {/* Branding / Title */}
      <div className="absolute bottom-6 left-6 pointer-events-none">
        <div className={`border-l-4 ${isDark ? 'border-nasa-orange' : 'border-black'} pl-4`}>
          <h1 className={`text-4xl font-bold tracking-tighter uppercase ${isDark ? 'text-white' : 'text-black'}`}>
            FIBONACCI_<span className="text-nasa-orange">SYS</span>
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs uppercase tracking-[0.2em] ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
               Ref: {config.points.toString().padStart(4, '0')} // PHI: 1.618
            </span>
            <div className={`h-2 w-2 rounded-full ${isDark ? 'bg-green-500' : 'bg-green-600'} animate-pulse`}></div>
          </div>
        </div>
      </div>
      
      {/* Decorative HUD Elements */}
      <div className="absolute top-6 right-6 pointer-events-none flex flex-col items-end gap-1 opacity-50">
         <div className={`text-[10px] uppercase ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>SYS.VER.2.0.4</div>
         <div className={`w-32 h-1 ${isDark ? 'bg-gray-800' : 'bg-gray-300'}`}>
            <div className="h-full bg-nasa-orange w-2/3"></div>
         </div>
      </div>

    </div>
  );
};

export default App;