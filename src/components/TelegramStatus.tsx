import React from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const TelegramStatus = () => {
  // Replace this with your actual bot username
const BOT_USERNAME = "AlzheimerSupportBot"; 

  const handleConnect = () => {
    window.open(`https://t.me/${BOT_USERNAME}`, '_blank');
  };

  return (
    <Card className="w-full max-w-md mx-auto border-t-4 border-t-blue-500 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-gray-800">
            Telegram Assistant
          </CardTitle>
          <div className="flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-xs font-semibold text-green-700">System Online</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-gray-600 mb-6">
          Our AI assistant is ready to help you manage care schedules and answer questions directly through Telegram.
        </p>
        
        <Button 
          onClick={handleConnect}
          className="w-full bg-[#0088cc] hover:bg-[#0077b5] text-white font-medium py-6 flex items-center justify-center gap-2 group"
        >
          <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          Start Chat with Bot
        </Button>

        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
          <CheckCircle2 className="w-3 h-3" />
          <span>Secure Connection • 24/7 Availability</span>
        </div>
      </CardContent>
    </Card>
  );
};