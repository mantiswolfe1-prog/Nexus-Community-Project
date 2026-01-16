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
    const variations = {
      explain: [
        `Great question about "${query}"! Let me break this down for you:\n\n1. **Key Concept**: This topic involves understanding the fundamental principles.\n\n2. **Step-by-Step Breakdown**:\n   - Start by identifying what we know\n   - Consider how the parts relate to each other\n   - Apply the core principle\n\n3. **Example**: Think of it in a real-world context to see how it applies.\n\nDoes this help clarify the concept? Would you like me to explain any part in more detail?`,
        `Understanding "${query}" is essential! Here's the breakdown:\n\n**The Basics**: At its core, this concept means...\n\n**Why It Matters**: This is important because:\n- It helps you understand related topics\n- It has real-world applications\n- It builds your foundational knowledge\n\n**Visual Way to Think About It**: Imagine...\n\n**Key Takeaway**: Remember that the main idea is... Does that make sense?`,
        `Let me explain "${query}" in a way that clicks!\n\n**Simple Definition**: In plain terms, it's...\n\n**The Process**: Here's how it works:\n1. First, understand...\n2. Then, consider...\n3. Finally, apply...\n\n**Common Misconception**: People often think... but actually...\n\n**Practice It**: Try applying this concept to... What do you notice?`
      ],
      solve: [
        `I'd like to help you solve "${query}"! Here's how to think about it:\n\n1. **Understand the Problem**: What information are you given? What are you trying to find?\n\n2. **Choose a Strategy**: \n   - Identify what methods might apply\n   - Think about what you've learned that relates to this\n\n3. **Work Through It**:\n   - Set up your approach\n   - Take it step-by-step\n   - Check your work\n\n4. **Verify**: Does your answer make sense in context?\n\nWhat part are you finding tricky? I'm here to guide you!`,
        `Let's tackle "${query}" together! Here's a winning strategy:\n\n**Step 1 - Analyze**: What do you know? What do you need to find?\n\n**Step 2 - Plan**: Which method works best?\n\n**Step 3 - Execute**: \n- Work carefully\n- Show each step\n- Double-check your logic\n\n**Step 4 - Reflect**: Is your answer reasonable?\n\nTry starting with Step 1 - tell me what you have and what you need!`,
        `Ready to solve "${query}"?\n\n**The Key Strategy**:\n- Break it into smaller parts\n- Solve each part\n- Combine your results\n\n**Common Tools**:\n- Look for patterns\n- Use what you know\n- Test your answer\n\n**A Helpful Tip**: Start by...\n\nGive it a try and tell me where you get stuck!`
      ],
      summarize: [
        `Here's a summary of "${query}":\n\n**Main Points**:\n• Key idea #1: This is important because...\n• Key idea #2: This connects to...\n• Key idea #3: Remember that...\n\n**Why This Matters**: Understanding these points helps you grasp the bigger picture.\n\n**Questions to Consider**: What role does each point play? How do they connect?\n\nFocus on remembering these key points, and the details will follow!`,
        `Quick summary of "${query}":\n\n**The Essentials**:\n✓ Main concept: ...\n✓ Key supporting idea: ...\n✓ Important detail: ...\n\n**Connection to Other Topics**: This relates to... because...\n\n**Remember**: The most critical point is...\n\n**Test Your Understanding**: Can you explain why each point matters?`,
        `Summary breakdown for "${query}":\n\n**Overview**: In essence...\n\n**The Three Big Ideas**:\n1. **First**: ...\n2. **Second**: ...\n3. **Third**: ...\n\n**How They Fit Together**: Each builds on the previous one to create...\n\n**Real-World Link**: You can see this in...\n\nWhich part would you like to dive deeper into?`
      ],
      code: [
        `Let me help you understand "${query}":\n\n**Concept Explanation**:\nThis is a fundamental programming concept that helps with code organization and clarity.\n\n**How It Works**:\n1. The basic structure involves...\n2. This approach benefits your code by...\n3. Common patterns include...\n\n**Best Practices**:\n- Write clear, readable code\n- Test your logic before running\n- Learn from errors\n\n**Try This**: Modify your code step-by-step and observe how it behaves. That's the best way to learn!\n\nNeed help with a specific part?`,
        `Helping with "${query}" - here's what you need to know:\n\n**The Principle**: Code is about...\n\n**Common Approaches**:\n- Method A: Good for...\n- Method B: Better when...\n- Method C: Most efficient when...\n\n**Code Quality Tips**:\n✓ Keep it simple\n✓ Make it readable\n✓ Test thoroughly\n\n**Challenge**: Try building... and see what happens!\n\nWhat specific aspect are you working on?`,
        `Let's tackle "${query}" in code!\n\n**What You Need to Know**:\n- This pattern helps with...\n- It makes code more...\n- It prevents...\n\n**Structure**:\nStart by... then... finally...\n\n**Example Scenario**: Use this approach when...\n\n**Pro Tip**: Watch out for... and remember to...\n\nWant to try implementing it? I'll help if you get stuck!`
      ]
    };
    
    const modeResponses = variations[mode] || variations.explain;
    return modeResponses[Math.floor(Math.random() * modeResponses.length)];
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