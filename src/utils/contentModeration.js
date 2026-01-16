// Content Moderation System
// Auto-detects inappropriate content and issues warnings/bans

export const inappropriateWords = [
  'fuck', 'shit', 'ass', 'bitch', 'damn', 'hell', 'crap', 'piss',
  'cock', 'dick', 'pussy', 'cunt', 'fag', 'nigger', 'nigga', 'retard',
  'whore', 'slut', 'bastard', 'sex', 'porn', 'xxx', 'nude', 'naked',
  'kill', 'die', 'death', 'suicide', 'rape', 'molest', 'pedo',
  'hitler', 'nazi', 'terrorist', 'bomb', 'gun', 'weapon', 'drugs',
  'cocaine', 'meth', 'weed', 'marijuana', 'heroin', 'abuse'
];

export const moderateContent = (text) => {
  if (!text || typeof text !== 'string') return { isClean: true, violations: [] };
  
  const lowerText = text.toLowerCase();
  const violations = [];
  
  // Check for inappropriate words
  for (const word of inappropriateWords) {
    if (lowerText.includes(word)) {
      violations.push({
        type: 'inappropriate_language',
        word: word,
        severity: 'high'
      });
    }
  }
  
  // Check for excessive caps (YELLING)
  const capsRatio = (text.match(/[A-Z]/g) || []).length / text.length;
  if (capsRatio > 0.7 && text.length > 10) {
    violations.push({
      type: 'excessive_caps',
      severity: 'low'
    });
  }
  
  // Check for spam (repeated characters)
  if (/(.)\1{5,}/.test(text)) {
    violations.push({
      type: 'spam_pattern',
      severity: 'medium'
    });
  }
  
  return {
    isClean: violations.length === 0,
    violations,
    hasHighSeverity: violations.some(v => v.severity === 'high')
  };
};

export const getViolationMessage = (warningCount) => {
  if (warningCount === 1) {
    return '⚠️ Warning 1/3: Please keep content appropriate. Continued violations may result in a ban.';
  } else if (warningCount === 2) {
    return '⚠️ Warning 2/3: Second violation detected. One more strike will result in an automatic ban.';
  } else if (warningCount >= 3) {
    return '🚫 Strike 3: You have been automatically banned for repeated violations.';
  }
  return '';
};
