import { useState } from 'react';
import { ChevronUp, ChevronDown, Sun, Snowflake } from 'lucide-react';

const Thermostat = () => {
 const [temperature, setTemperature] = useState(20);
 const [mode, setMode] = useState('heat'); // 'heat' or 'cool'
 const [isLoading, setIsLoading] = useState(false);
 const [error, setError] = useState(null);

 // Handle temperature increment
 const handleIncrement = async () => {
   const maxTemp = mode === 'heat' ? 30 : 26;
   const newTemp = Math.min(temperature + 0.5, maxTemp);
   
   setIsLoading(true);
   try {
     const response = await fetch('http://localhost:5001/api/thermostat/1', {
       method: 'PUT',
       headers: {
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${localStorage.getItem('token')}`
       },
       body: JSON.stringify({ 
         temperature: newTemp,
         mode 
       })
     });

     if (response.ok) {
       setTemperature(newTemp);
     } else {
       throw new Error('Failed to update temperature');
     }
   } catch (err) {
     setError(err.message);
     console.error('Error updating temperature:', err);
   } finally {
     setIsLoading(false);
   }
 };

 // Handle temperature decrement
 const handleDecrement = async () => {
   const minTemp = mode === 'heat' ? 15 : 10;
   const newTemp = Math.max(temperature - 0.5, minTemp);

   setIsLoading(true);
   try {
     const response = await fetch('http://localhost:5001/api/thermostat/1', {
       method: 'PUT',
       headers: {
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${localStorage.getItem('token')}`
       },
       body: JSON.stringify({ 
         temperature: newTemp,
         mode 
       })
     });

     if (response.ok) {
       setTemperature(newTemp);
     } else {
       throw new Error('Failed to update temperature');
     }
   } catch (err) {
     setError(err.message);
     console.error('Error updating temperature:', err);
   } finally {
     setIsLoading(false);
   }
 };

 // Handle mode toggle
 const toggleMode = async () => {
   setIsLoading(true);
   const newMode = mode === 'heat' ? 'cool' : 'heat';
   const defaultTemp = newMode === 'heat' ? 22 : 18;

   try {
     const response = await fetch('http://localhost:5001/api/thermostat/1/mode', {
       method: 'PUT',
       headers: {
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${localStorage.getItem('token')}`
       },
       body: JSON.stringify({ 
         mode: newMode,
         temperature: defaultTemp 
       })
     });

     if (response.ok) {
       setMode(newMode);
       setTemperature(defaultTemp);
     } else {
       throw new Error('Failed to update mode');
     }
   } catch (err) {
     setError(err.message);
     console.error('Error updating mode:', err);
   } finally {
     setIsLoading(false);
   }
 };

 // Get icon based on mode
 const getIcon = () => {
   if (mode === 'heat') {
     return <Sun size={24} className="text-white" />;
   }
   return <Snowflake size={24} className="text-white" />;
 };

 // Get temperature color based on value and mode
 const getTemperatureColor = () => {
   if (mode === 'heat') {
     return temperature >= 24 ? 'text-red-400' : 'text-orange-400';
   }
   return temperature <= 20 ? 'text-blue-400' : 'text-blue-300';
 };

 // Get mode-specific gradient colors
 const getModeGradient = () => {
   if (mode === 'heat') {
     return temperature >= 24 
       ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'
       : 'bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500';
   }
   return temperature <= 20
     ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'
     : 'bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500';
 };

 return (
   <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gray-900">
     <div className="w-full max-w-md mx-auto bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
       {error && (
         <div className="mb-4 px-4 py-2 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-center">
           {error}
         </div>
       )}

       {/* Mode Toggle */}
       <div className="flex justify-center mb-6">
         <button 
           onClick={toggleMode}
           disabled={isLoading}
           className={`px-6 py-2 rounded-full text-white transition-all flex items-center gap-2 ${getModeGradient()} disabled:opacity-50`}
         >
           {getIcon()}
           <span className="text-sm sm:text-base">Mode: {mode === 'heat' ? 'Heat' : 'Cool'}</span>
         </button>
       </div>

       {/* Temperature Display */}
       <div className="text-center mb-8">
         <span className={`text-6xl sm:text-7xl font-bold ${getTemperatureColor()} transition-colors`}>
           {temperature.toFixed(1)}°C
         </span>
       </div>

       {/* Temperature Controls */}
       <div className="flex flex-col items-center gap-4">
         <button
           onClick={handleIncrement}
           disabled={isLoading}
           className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors backdrop-blur-sm disabled:opacity-50"
           aria-label="Increase temperature"
         >
           <ChevronUp size={32} className="text-white" />
         </button>
         
         <button
           onClick={handleDecrement}
           disabled={isLoading}
           className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors backdrop-blur-sm disabled:opacity-50"
           aria-label="Decrease temperature"
         >
           <ChevronDown size={32} className="text-white" />
         </button>
       </div>
     </div>
   </div>
 );
};

export default Thermostat;