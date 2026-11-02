// Common English profanity and slurs — kept broad to catch variants
const PROFANITY_WORDS = new Set([
  'fuck', 'shit', 'damn', 'bitch', 'asshole', 'bastard', 'cunt', 'dick', 'pussy',
  'cock', 'twat', 'wanker', 'prick', 'douche', 'faggot', 'slut', 'whore',
  'nigger', 'nigga', 'chink', 'gook', 'spic', 'kike', 'fag', 'dyke', 'tranny',
  'retard', 'retarded', 'mongoloid', 'cripple', 'gimp', 'spaz',
]);

// Homoglyph map: visually-similar characters normalized to their ASCII equivalent
const HOMOGLYPHS = {
  'а': 'a', 'б': 'b', 'с': 'c', 'е': 'e', 'н': 'h', 'і': 'i', 'ј': 'j', 'р': 'p',
  'ѕ': 's', 'у': 'y', 'ѝ': 'i', 'ѳ': 'o', 'ѵ': 'v', 'ѷ': 'i', 'ѹ': 'u', 'ѻ': 'o',
  'υ': 'u', 'ϋ': 'u', 'ΰ': 'u', 'ф': 'f', 'х': 'x', 'ц': 'c', 'ч': 'ch', 'ш': 'sh',
  'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
  '０': '0', '１': '1', '２': '2', '３': '3', '４': '4', '５': '5', '６': '6', '７': '7', '８': '8', '９': '9',
  '@': 'a', '4': 'a', '3': 'e', '1': 'i', '!': 'i', '0': 'o', '$': 's', '5': 's', '7': 't', '+': 't',
};

function normalize(text) {
  let normalized = text.toLowerCase();
  // Strip zero-width and formatting characters
  normalized = normalized.replace(/[​‌‍⁠﻿]/g, '');
  // Replace homoglyphs with ASCII equivalents
  for (const [from, to] of Object.entries(HOMOGLYPHS)) {
    normalized = normalized.split(from).join(to);
  }
  // Collapse repeated punctuation and spaces
  normalized = normalized.replace(/([\W_])\1+/g, '$1');
  normalized = normalized.replace(/\s+/g, '');
  return normalized;
}

export function checkProfanity(text) {
  if (!text || typeof text !== 'string') return { clean: true, matches: [] };
  const normalized = normalize(text);
  const matches = [];
  const words = Array.from(PROFANITY_WORDS);
  for (let i = 0; i < words.length; i++) {
    if (normalized.includes(words[i])) {
      matches.push(words[i]);
    }
  }
  return { clean: matches.length === 0, matches };
}

export function hasProfanity(text) {
  return !checkProfanity(text).clean;
}