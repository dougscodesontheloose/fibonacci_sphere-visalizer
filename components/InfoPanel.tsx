import React, { useState, useRef, useEffect } from 'react';
import { generateMathInsight, streamChatResponse } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Sparkles, MessageSquare, Send, X, Terminal, Cpu } from 'lucide-react';

interface InfoPanelProps {
  points: number;
  theme: 'dark' | 'light';
}

const InfoPanel: React.FC<InfoPanelProps> = ({ points, theme }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'insight' | 'chat'>('insight');
  
  // Theme helpers
  const isDark = theme === 'dark';
  const borderColor = isDark ? 'border-nasa-border' : 'border-black';
  const bgColor = isDark ? 'bg-nasa-gray' : 'bg-white';
  const textColor = isDark ? 'text-gray-300' : 'text-gray-800';
  const headerColor = isDark ? 'text-white' : 'text-black';
  
  // Insight State
  const [insight, setInsight] = useState<string>('');
  const [loadingInsight, setLoadingInsight] = useState(false);

  // Chat State
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [inputMsg, setInputMsg] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    handleGenerateInsight("The mathematical significance of distributing " + points + " points on a sphere using the golden ratio.");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const handleGenerateInsight = async (topic: string) => {
    setLoadingInsight(true);
    const text = await generateMathInsight(points, topic);
    setInsight(text);
    setLoadingInsight(false);
  };

  const handleSendMessage = async () => {
    if (!inputMsg.trim() || isStreaming) return;

    const userMsg = inputMsg;
    setInputMsg('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsStreaming(true);

    setChatHistory(prev => [...prev, { role: 'model', text: '' }]);

    const generator = streamChatResponse(chatHistory, userMsg);
    let fullResponse = "";

    for await (const chunk of generator) {
      if (chunk) {
        fullResponse += chunk;
        setChatHistory(prev => {
            const newHistory = [...prev];
            newHistory[newHistory.length - 1] = { role: 'model', text: fullResponse };
            return newHistory;
        });
      }
    }
    setIsStreaming(false);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className={`absolute top-6 right-6 z-10 ${bgColor} border-2 ${borderColor} ${isDark ? 'text-nasa-orange' : 'text-black'} p-2 hover:bg-nasa-orange hover:text-white transition-colors uppercase font-mono text-xs tracking-widest flex items-center gap-2`}
      >
        <Terminal size={16} />
        <span>Open_Term</span>
      </button>
    );
  }

  return (
    <div className={`absolute top-6 right-6 z-10 w-[400px] ${bgColor} border-2 ${borderColor} flex flex-col font-mono shadow-none max-h-[calc(100vh-3rem)]`}>
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-3 border-b-2 ${borderColor} bg-opacity-50`}>
        <h3 className={`font-bold text-sm uppercase tracking-widest ${headerColor} flex items-center gap-2`}>
          <Cpu size={16} className="text-nasa-orange" />
          Intel_Link
        </h3>
        <button onClick={() => setIsOpen(false)} className={`${isDark ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-black'} transition-colors`}>
          <X size={16} />
        </button>
      </div>

      {/* Tabs */}
      <div className={`flex border-b-2 ${borderColor}`}>
        <button 
          onClick={() => setActiveTab('insight')}
          className={`flex-1 py-2 text-xs uppercase tracking-wider font-bold transition-colors border-r-2 ${borderColor} last:border-r-0 ${
              activeTab === 'insight' 
              ? 'bg-nasa-orange text-white' 
              : `${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
          }`}
        >
          Analysis
        </button>
        <button 
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-2 text-xs uppercase tracking-wider font-bold transition-colors ${
              activeTab === 'chat' 
              ? 'bg-nasa-orange text-white' 
              : `${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
          }`}
        >
          Comms
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 min-h-[300px] max-h-[600px] custom-scrollbar bg-opacity-50">
        {activeTab === 'insight' ? (
          <div>
             <div className="mb-6 border-b border-dashed border-gray-600 pb-4">
                 <h4 className={`text-[10px] font-bold uppercase ${isDark ? 'text-gray-500' : 'text-gray-500'} mb-3 tracking-widest`}>Run_Query_Sequence</h4>
                 <div className="flex flex-col gap-2">
                     <button disabled={loadingInsight} onClick={() => handleGenerateInsight("The connection between Sunflowers and Fibonacci Spheres")} className={`text-left px-3 py-2 ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-cyan-400' : 'bg-gray-100 hover:bg-gray-200 text-blue-600'} text-xs border border-transparent hover:border-nasa-orange transition-all`}>
                        &gt; EXEC: SUNFLOWER_SEQUENCE
                     </button>
                     <button disabled={loadingInsight} onClick={() => handleGenerateInsight("Why is the Golden Angle roughly 137.5 degrees?")} className={`text-left px-3 py-2 ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-cyan-400' : 'bg-gray-100 hover:bg-gray-200 text-blue-600'} text-xs border border-transparent hover:border-nasa-orange transition-all`}>
                        &gt; EXEC: ANGLE_137.5_ANALYSIS
                     </button>
                     <button disabled={loadingInsight} onClick={() => handleGenerateInsight("Mathematical properties of the Fibonacci Lattice")} className={`text-left px-3 py-2 ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-cyan-400' : 'bg-gray-100 hover:bg-gray-200 text-blue-600'} text-xs border border-transparent hover:border-nasa-orange transition-all`}>
                        &gt; EXEC: LATTICE_MATH_PROPS
                     </button>
                 </div>
             </div>
             
             {loadingInsight ? (
                 <div className="flex flex-col items-center justify-center py-10 space-y-2 text-nasa-orange">
                     <Terminal size={24} className="animate-pulse" />
                     <span className="text-xs uppercase animate-pulse">Processing_Data...</span>
                 </div>
             ) : (
                 <div className={`prose prose-sm max-w-none ${isDark ? 'prose-invert' : ''}`}>
                     <div className="text-xs leading-relaxed font-mono" dangerouslySetInnerHTML={{ __html: insight.replace(/\*\*(.*?)\*\*/g, '<strong class="text-nasa-orange">$1</strong>').replace(/\n/g, '<br />') }} />
                 </div>
             )}
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex-1 space-y-4 mb-4">
               {chatHistory.length === 0 && (
                   <div className="text-gray-500 text-center text-xs mt-10 uppercase tracking-widest border border-dashed border-gray-600 p-4">
                       // SYSTEM_READY<br/>
                       // AWAITING_INPUT
                   </div>
               )}
               {chatHistory.map((msg, idx) => (
                   <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                       <div className={`max-w-[90%] p-3 border text-xs ${
                           msg.role === 'user' 
                           ? `bg-nasa-orange text-black border-nasa-orange` 
                           : `${isDark ? 'bg-gray-800 border-gray-600 text-gray-300' : 'bg-gray-100 border-gray-300 text-gray-800'}`
                       }`}>
                           <span className="block text-[8px] opacity-50 mb-1 uppercase tracking-wider">{msg.role === 'user' ? 'OPERATOR' : 'AI_CORE'}</span>
                           {msg.text}
                       </div>
                   </div>
               ))}
               <div ref={chatEndRef} />
            </div>
          </div>
        )}
      </div>

      {/* Footer (Chat Input) */}
      {activeTab === 'chat' && (
          <div className={`p-3 border-t-2 ${borderColor} flex gap-2 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
              <div className="flex-1 relative">
                  <span className="absolute left-2 top-2.5 text-nasa-orange text-xs">&gt;</span>
                  <input 
                     type="text" 
                     value={inputMsg}
                     onChange={(e) => setInputMsg(e.target.value)}
                     onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                     placeholder="ENTER_COMMAND..."
                     className={`w-full ${isDark ? 'bg-black text-white' : 'bg-white text-black'} border ${isDark ? 'border-gray-700' : 'border-gray-300'} pl-6 pr-2 py-2 text-xs focus:outline-none focus:border-nasa-orange font-mono`}
                  />
              </div>
              <button 
                  onClick={handleSendMessage}
                  disabled={isStreaming || !inputMsg.trim()}
                  className="bg-nasa-orange hover:bg-orange-600 disabled:opacity-50 text-black p-2 transition-colors border border-nasa-orange"
              >
                  <Send size={16} />
              </button>
          </div>
      )}
    </div>
  );
};

export default InfoPanel;