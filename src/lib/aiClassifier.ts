import { ComplaintCategory, ComplaintPriority } from '../types';

export interface AIClassificationResult {
  category: ComplaintCategory;
  subcategory: string;
  department: string;
  priority: ComplaintPriority;
  confidence: number;
  keywords: string[];
  isSensitive: boolean;
  reasoning: string;
}

// Keyword dictionaries and weights
const KEYWORD_RULES = [
  {
    category: 'Harassment and Safety' as ComplaintCategory,
    department: 'Grievance Redressal Committee',
    priority: 'Critical' as ComplaintPriority,
    isSensitive: true,
    subcategories: [
      { name: 'Anti-Ragging Incident', words: ['ragging', 'seniors', 'forced', 'ragged', 'threatened', 'intimidation', 'hostel room entry'] },
      { name: 'Harassment / Safety', words: ['harass', 'stalking', 'assault', 'touching', 'misconduct', 'unsafe', 'lighting', 'dark walkway', 'abuse'] },
    ],
  },
  {
    category: 'Faculty' as ComplaintCategory,
    department: 'Grievance Redressal Committee',
    priority: 'High' as ComplaintPriority,
    isSensitive: true,
    subcategories: [
      { name: 'Evaluation Bias & Conduct', words: ['professor', 'faculty', 'teacher', 'viva', 'biased', 'marks reduction', 'bribe', 'favoritism', 'lecturer', 'dr.'] },
      { name: 'Classroom Harassment', words: ['shouting', 'humiliated', 'insulted', 'attendance penalty', 'personal remarks'] },
    ],
  },
  {
    category: 'Hostel' as ComplaintCategory,
    department: 'Hostel Administration',
    priority: 'Medium' as ComplaintPriority,
    isSensitive: false,
    subcategories: [
      { name: 'Water Supply & Plumbing', words: ['water', 'tap', 'bathroom', 'shower', 'tank', 'plumbing', 'borewell', 'pipeline', 'dry tap'] },
      { name: 'Sanitation & Housekeeping', words: ['cleaning', 'garbage', 'dustbin', 'washroom', 'mosquitoes', 'corridor', 'hygiene', 'smell'] },
      { name: 'Room Amenities', words: ['bed', 'fan', 'almirah', 'curtain', 'roommate', 'warden', 'geyser'] },
    ],
  },
  {
    category: 'Mess' as ComplaintCategory,
    department: 'Mess & Dining Committee',
    priority: 'High' as ComplaintPriority,
    isSensitive: false,
    subcategories: [
      { name: 'Food Hygiene & Quality', words: ['food', 'mess', 'dining', 'taste', 'stale', 'undercooked', 'canteen', 'rotten', 'insect', 'fly', 'paneer', 'rice', 'dal', 'oil', 'sour'] },
      { name: 'Mess Timings & Service', words: ['timing', 'serving', 'queue', 'plates', 'drinking water cooler'] },
    ],
  },
  {
    category: 'Infrastructure' as ComplaintCategory,
    department: 'Infrastructure & Maintenance',
    priority: 'Medium' as ComplaintPriority,
    isSensitive: false,
    subcategories: [
      { name: 'Audio-Visual & Classrooms', words: ['projector', 'hdmi', 'mic', 'screen', 'speaker', 'ac', 'air conditioner', 'fan', 'blackboard', 'podium'] },
      { name: 'Building Maintenance & Hazard', words: ['broken glass', 'handrail', 'lift', 'elevator', 'staircase', 'cracks', 'leakage', 'ceiling', 'door'] },
      { name: 'Electrical & Power', words: ['power cut', 'switchboard', 'socket', 'generator', 'wiring', 'spark'] },
      { name: 'Digital Infrastructure & IT', words: ['wifi', 'internet', 'lan', 'computer', 'desktop', 'network', 'router', 'terminal', 'portal'] },
    ],
  },
  {
    category: 'Academics' as ComplaintCategory,
    department: 'Academic Affairs',
    priority: 'Medium' as ComplaintPriority,
    isSensitive: false,
    subcategories: [
      { name: 'Examination & Timetable', words: ['exam', 'timetable', 'clash', 'schedule', 'datesheet', 'midsem', 'endsem', 'clashing', 'credits'] },
      { name: 'Laboratory Facilities', words: ['lab', 'apparatus', 'oscilloscope', 'chemicals', 'equipment', 'multimeter', 'probes', 'software'] },
      { name: 'Curriculum & Classes', words: ['syllabus', 'lecture timing', 'substitute', 'attendance portal', 'erp'] },
    ],
  },
  {
    category: 'Administration' as ComplaintCategory,
    department: 'Administrative Operations',
    priority: 'Low' as ComplaintPriority,
    isSensitive: false,
    subcategories: [
      { name: 'Student Certificates & Records', words: ['transcript', 'bonafide', 'certificate', 'scholarship', 'fee receipt', 'degree', 'id card', 'verification'] },
      { name: 'Campus Transport & Services', words: ['bus', 'shuttle', 'gate pass', 'parking', 'security guard'] },
    ],
  },
];

/**
 * Intelligent Rule-based NLP classifier.
 * Mimics an LLM response and can easily hook into a live Gemini endpoint.
 */
export async function classifyComplaint(
  text: string,
  title: string = ''
): Promise<AIClassificationResult> {
  const combinedText = `${title} ${text}`.toLowerCase();
  
  // Check if external Gemini API key is provided
  const geminiApiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
  if (geminiApiKey) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Analyze this student grievance: "${combinedText}".
Respond ONLY with JSON formatted as:
{
  "category": "Hostel" | "Mess" | "Academics" | "Faculty" | "Infrastructure" | "Administration" | "Harassment and Safety" | "Other",
  "subcategory": "string",
  "department": "string",
  "priority": "Low" | "Medium" | "High" | "Critical",
  "confidence": number between 0.8 and 0.99,
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "isSensitive": boolean,
  "reasoning": "brief explanation"
}`,
                  },
                ],
              },
            ],
          }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        const jsonMatch = data?.candidates?.[0]?.content?.parts?.[0]?.text?.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      }
    } catch (e) {
      console.warn('Gemini API call failed, falling back to built-in rule engine', e);
    }
  }

  // Built-in rule-based classifier
  let bestScore = 0;
  let matchedRule = KEYWORD_RULES[2]; // Default to Hostel or General
  let matchedSubcategory = 'General Grievance';
  const foundKeywords: string[] = [];

  for (const rule of KEYWORD_RULES) {
    let ruleScore = 0;
    for (const sub of rule.subcategories) {
      let subScore = 0;
      for (const word of sub.words) {
        if (combinedText.includes(word)) {
          subScore += word.length > 5 ? 3 : 2;
          if (!foundKeywords.includes(word)) {
            foundKeywords.push(word);
          }
        }
      }
      if (subScore > 0 && subScore >= ruleScore) {
        ruleScore = subScore;
        if (subScore > bestScore) {
          bestScore = subScore;
          matchedRule = rule;
          matchedSubcategory = sub.name;
        }
      }
    }
  }

  // Determine priority adjustments
  let priority = matchedRule.priority;
  if (combinedText.includes('urgent') || combinedText.includes('immediately') || combinedText.includes('hazard') || combinedText.includes('severe')) {
    if (priority === 'Medium') priority = 'High';
    if (priority === 'High') priority = 'Critical';
  }

  const confidence = bestScore > 0 ? Math.min(0.96, 0.75 + (bestScore * 0.04)) : 0.70;

  return {
    category: bestScore > 0 ? matchedRule.category : 'Other',
    subcategory: matchedSubcategory,
    department: matchedRule.department,
    priority: priority,
    confidence: Number(confidence.toFixed(2)),
    keywords: foundKeywords.slice(0, 5),
    isSensitive: matchedRule.isSensitive,
    reasoning: `Detected semantic triggers: [${foundKeywords.slice(0, 4).join(', ')}] pointing to ${matchedRule.category} operations.`,
  };
}
