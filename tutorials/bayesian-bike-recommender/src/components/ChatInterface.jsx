import { useRef, useEffect } from 'react';

export default function ChatInterface({ onMessage, messages }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const suggestions = [
    "I want something affordable for commuting",
    "I'm a beginner with bad knees",
    "Looking for a mountain bike for trails",
    "Need a fitness bike, money is no object",
    "Weekend rides on mixed terrain",
  ];

  return (
    <div className="flex flex-col h-full bg-slate-800/50 rounded-xl border border-slate-700">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-700">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="text-2xl">💬</span>
          Tell us what you need
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Select a scenario to see how Bayesian inference works
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[200px]">
        {messages.length === 0 ? (
          <div className="text-slate-400 text-sm">
            <p className="mb-3">Click a scenario to start:</p>
            <div className="space-y-2">
              {suggestions.map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => onMessage(suggestion)}
                  className="block w-full text-left px-3 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-slate-300 text-sm transition-colors"
                >
                  "{suggestion}"
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              className={`chat-message flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] px-4 py-2 rounded-2xl ${
                  msg.type === 'user'
                    ? 'bg-blue-600 text-white rounded-br-md'
                    : 'bg-slate-700 text-slate-200 rounded-bl-md'
                }`}
              >
                {msg.type === 'system' && (
                  <span className="text-xs text-blue-400 block mb-1">🤖 AI + Bayesian</span>
                )}
                <p className="text-sm">{msg.text}</p>
                {msg.evidence && Object.keys(msg.evidence).length > 0 && (
                  <div className="mt-2 pt-2 border-t border-slate-600">
                    <p className="text-xs text-slate-400 mb-1">Extracted evidence:</p>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(msg.evidence).map(([key, value]) => (
                        <span
                          key={key}
                          className="px-2 py-0.5 bg-blue-500/30 text-blue-300 rounded text-xs"
                        >
                          {key}: {value}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Scenario buttons when conversation is active */}
      {messages.length > 0 && (
        <div className="p-4 border-t border-slate-700">
          <p className="text-xs text-slate-500 mb-2">Try another scenario:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, i) => (
              <button
                key={i}
                onClick={() => onMessage(suggestion)}
                className="px-3 py-1.5 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-slate-300 text-xs transition-colors"
              >
                {suggestion.length > 25 ? suggestion.substring(0, 25) + '...' : suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
