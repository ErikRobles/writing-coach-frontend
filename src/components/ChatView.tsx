import React, { useState, useEffect, useRef } from 'react';
import { analyzeText } from '../api';

export default function ChatView() {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<{role: 'scribe' | 'user', content: string}[]>([
    {
      role: 'scribe',
      content: "Hi! I'm WritingCoach.AI, your friendly writing coach. I can help you fix grammar and suggest improvements. Just paste or type your draft below."
    }
  ]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage: { role: 'user' | 'scribe'; content: string } = { role: 'user', content: inputText };
    setMessages(prev => [...prev, userMessage]);
    
    const currentInput = inputText;
    setInputText('');
    setIsAnalyzing(true);

    const scribeMsgIndex = messages.length + 1;
    setMessages(prev => [...prev, { role: 'scribe', content: '' }]);

    try {
      await analyzeText(currentInput, (chunk) => {
        setMessages(prev => {
          const newMsg = [...prev];
          newMsg[scribeMsgIndex] = {
            role: 'scribe',
            content: (newMsg[scribeMsgIndex]?.content || '') + chunk
          };
          return newMsg;
        });
      });
    } catch (e: any) {
      setMessages(prev => {
        const errorString = String(e?.message || e);
        let fallbackMessage = 'Oops! We had trouble connecting to the server. Please check your connection.';
        
        if (errorString.toLowerCase().includes('rate limit') || errorString.includes('429')) {
          fallbackMessage = "You've run out of tokens for now. Please try again later or upgrade your plan.";
        }

        const newMsg = [...prev];
        newMsg[scribeMsgIndex] = {
          role: 'scribe',
          content: fallbackMessage
        };
        return newMsg;
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col relative w-full h-full max-w-4xl mx-auto pt-24 pb-32 px-4 md:px-8">
      
      {/* Messages Area */}
      <div className="flex-1 flex flex-col space-y-12 overflow-y-auto mb-16 scrollbar-hide">
        {messages.map((msg, idx) => (
          msg.role === 'scribe' ? (
            <section key={idx} className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex items-center gap-3 ml-2">
                <div className={`w-2 h-2 rounded-full bg-primary ${idx === messages.length - 1 && isAnalyzing ? 'animate-pulse' : ''}`}></div>
                <span className="font-space font-bold text-primary tracking-wider text-xs uppercase">
                  {idx === 0 ? 'WritingCoach.AI' : 'WritingCoach.AI Suggestion'}
                </span>
              </div>
              <div className="bg-surface-container p-6 rounded-xl border-l-2 border-primary/30 shadow-xl">
                {msg.content ? (
                  <div className="flex flex-col">
                    <div className="prose prose-invert prose-p:font-newsreader prose-p:text-xl prose-p:leading-relaxed prose-p:text-on-surface-variant max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, '<br/>') }} />
                    </div>
                    {idx > 0 && !isAnalyzing && (
                      <div className="mt-8 pt-6 border-t border-outline-variant/20 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                        <p className="font-space text-xs text-on-surface-variant italic">Click below to update your draft with these suggestions.</p>
                        <button 
                          onClick={() => {
                            setInputText(msg.content);
                            endRef.current?.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-md font-bold text-xs uppercase tracking-tighter hover:bg-primary hover:text-on-primary-fixed active:scale-95 transition-all">
                          <span className="material-symbols-outlined text-sm">edit_document</span>
                          Apply Changes
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-6 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                )}
              </div>
            </section>
          ) : (
            <section key={idx} className="flex flex-col gap-4 items-end animate-in fade-in slide-in-from-bottom-6 duration-700">
              <div className="flex items-center gap-3 mr-2">
                <span className="font-space font-medium text-secondary-dim tracking-wider text-xs uppercase">Your Draft</span>
                <div className="w-2 h-2 rounded-full bg-secondary-dim"></div>
              </div>
              <div className="glass-obsidian p-8 rounded-2xl border border-primary/20 shadow-[0px_0px_30px_rgba(169,255,223,0.05)] w-full md:w-5/6">
                <p className="font-newsreader text-2xl leading-loose text-on-surface whitespace-pre-wrap">
                  {msg.content}
                </p>
              </div>
            </section>
          )
        ))}
        <div ref={endRef} />
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 w-full z-40 px-4 pb-24 md:pb-8 pt-4 bg-gradient-to-t from-background via-background/95 to-transparent flex justify-center md:pl-64">
        <div className="max-w-4xl w-full mx-auto relative group px-4 md:px-8">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-tertiary/30 rounded-xl blur opacity-30 group-focus-within:opacity-100 transition duration-500"></div>
          <div className="relative flex items-center bg-surface-container-highest rounded-xl p-2 border border-outline-variant/20">
            <button className="p-3 text-on-surface-variant hover:text-primary transition-colors hidden sm:block">
              <span className="material-symbols-outlined">attach_file</span>
            </button>
            <textarea
              className="flex-grow bg-transparent border-none focus:ring-0 text-on-surface font-newsreader text-lg px-2 placeholder:text-on-surface-variant resize-none outline-none h-14 py-3"
              placeholder="Type or paste your text here..."
              value={inputText}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInputText(e.target.value)}
              onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <button 
              onClick={handleSend}
              disabled={isAnalyzing || !inputText.trim()}
              className="ml-2 flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary to-primary-container text-on-primary-fixed rounded-lg shadow-lg hover:shadow-primary/20 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined">send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
