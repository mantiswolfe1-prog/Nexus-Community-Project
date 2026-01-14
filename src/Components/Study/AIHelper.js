import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles, Loader2, BookOpen, Calculator, FileText, Code } from 'lucide-react';
import GlassCard from '../UI/GlassCard.js';
import { Input } from '../UI/input.js';

export default function AIHelper({ accentColor = '#a55eea' }) {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState('explain'); // explain, solve, summarize, code

  const modes = [
    { id: 'explain', label: 'Explain', icon: BookOpen },
    { id: 'solve', label: 'Solve', icon: Calculator },
    { id: 'summarize', label: 'Summarize', icon: FileText },
    { id: 'code', label: 'Code Help', icon: Code },
  ];

  const generateResponse = (query, mode) => {
    const responses = {
      explain: {
        default: `Great question about "${query}"! Let me break this down for you:\n\n1. **Key Concept**: This topic involves understanding the fundamental principles.\n\n2. **Step-by-Step Breakdown**:\n   - Start by identifying what we know\n   - Consider how the parts relate to each other\n   - Apply the core principle\n\n3. **Example**: Think of it in a real-world context to see how it applies.\n\nDoes this help clarify the concept? Would you like me to explain any part in more detail?`
      },
      solve: {
        default: `I'd like to help you solve "${query}"! Here's how to think about it:\n\n1. **Understand the Problem**: What information are you given? What are you trying to find?\n\n2. **Choose a Strategy**: \n   - Identify what methods might apply\n   - Think about what you've learned that relates to this\n\n3. **Work Through It**:\n   - Set up your approach\n   - Take it step-by-step\n   - Check your work\n\n4. **Verify**: Does your answer make sense in context?\n\nWhat part are you finding tricky? I'm here to guide you!`
      },
      summarize: {
        default: `Here's a summary of "${query}":\n\n**Main Points**:\n• Key idea #1: This is important because...\n• Key idea #2: This connects to...\n• Key idea #3: Remember that...\n\n**Why This Matters**: Understanding these points helps you grasp the bigger picture.\n\n**Questions to Consider**: What role does each point play? How do they connect?\n\nFocus on remembering these key points, and the details will follow!`
      },
      code: {
        default: `Let me help you understand "${query}":\n\n**Concept Explanation**:\nThis is a fundamental programming concept that helps with code organization and clarity.\n\n**How It Works**:\n1. The basic structure involves...\n2. This approach benefits your code by...\n3. Common patterns include...\n\n**Best Practices**:\n- Write clear, readable code\n- Test your logic before running\n- Learn from errors\n\n**Try This**: Modify your code step-by-step and observe how it behaves. That's the best way to learn!\n\nNeed help with a specific part?`
      }
    };
    
    return responses[mode]?.default || responses.explain.default;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setResponse('');

    // Simulate response delay
    setTimeout(() => {
      const result = generateResponse(query, mode);
      setResponse(result);
      setIsLoading(false);
    }, 1500);
  };

  const quickPrompts = [
    "What's the Pythagorean theorem?",
    "Explain photosynthesis",
    "How do I solve quadratic equations?",
    "What caused World War I?"
  ];

  return (
    <GlassCard className="p-6" accentColor={accentColor} hover={false}>
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5" style={{ color: accentColor }} />
        <h3 className="font-semibold text-white">AI Study Helper</h3>
      </div>

      {/* Mode Selection */}
      <div className="flex flex-wrap gap-2 mb-4">
        {modes.map((m) => (
          <motion.button
            key={m.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMode(m.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              mode === m.id 
                ? 'text-white' 
                : 'bg-white/5 text-white/50 hover:text-white/70'
            }`}
            style={{ backgroundColor: mode === m.id ? accentColor : undefined }}
          >
            <m.icon className="w-3 h-3" />
            {m.label}
          </motion.button>
        ))}
      </div>

      {/* Quick Prompts */}
      {!response && !isLoading && (
        <div className="mb-4">
          <p className="text-xs text-white/40 mb-2">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => setQuery(prompt)}
                className="px-3 py-1.5 rounded-full bg-white/5 text-xs text-white/60 hover:text-white/80 hover:bg-white/10 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Response Area */}
      {(response || isLoading) && (
        <div className="mb-4 p-4 rounded-xl bg-white/5 min-h-[120px]">
          {isLoading ? (
            <div className="flex items-center gap-2 text-white/50">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Thinking...</span>
            </div>
          ) : (
            <div className="text-sm text-white/80 whitespace-pre-wrap">
              {response}
            </div>
          )}
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Ask me to ${mode} something...`}
          className="bg-white/5 border-white/10 text-white"
          disabled={isLoading}
        />
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isLoading || !query.trim()}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white disabled:opacity-50"
          style={{ backgroundColor: accentColor }}
        >
          <Send className="w-4 h-4" />
        </motion.button>
      </form>

      <p className="text-xs text-white/30 mt-3 text-center">
        I help you learn, not do your homework for you!
      </p>
    </GlassCard>
  );
}