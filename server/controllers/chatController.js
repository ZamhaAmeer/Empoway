const { Op } = require('sequelize');
const { Place, Category, AccessibilityFeature, AccessibilityReport } = require('../models');

// Format place features into factual text for AI or direct responses
const formatPlaceDetails = (place) => {
  const f = place.accessibilityFeature ? place.accessibilityFeature.toJSON() : {};
  const statusLabels = {
    AVAILABLE: 'Available & Functional',
    NOT_AVAILABLE: 'Not Available / Barrier',
    NEEDS_VERIFICATION: 'Needs Physical Verification',
    UNKNOWN: 'Unknown / Not Documented'
  };

  const activeBarriers = (place.reports || []).filter(
    (r) => ['SUBMITTED', 'UNDER_REVIEW', 'CONFIRMED'].includes(r.status) && (r.reportType === 'BARRIER_REPORT' || r.barrierType)
  );

  return (
    `**${place.name}** (${place.cityOrArea}, ${place.district})\n` +
    `• Category: ${place.category?.name || 'General'}\n` +
    `• Verification Status: **${place.accessibilityStatus === 'VERIFIED' ? 'Physically Audited & Verified' : place.accessibilityStatus === 'COMMUNITY_REPORTED' ? 'Community Reported (Pending Audit)' : 'Unknown'}**\n` +
    `• Last Physical Audit: ${place.lastVerifiedDate ? new Date(place.lastVerifiedDate).toLocaleDateString('en-GB') : 'None on record'}\n` +
    `• Entrance: ${place.numberOfSteps === 0 ? 'Step-Free (0 steps)' : `${place.numberOfSteps} step(s)`} (${place.entranceDetails || 'Standard threshold'})\n` +
    `• Ramp Availability: ${statusLabels[f.wheelchairRamp] || 'Unknown'} (${place.rampCondition || 'Condition unspecified'})\n` +
    `• Elevator: ${statusLabels[f.elevator] || 'Unknown'} (${place.elevatorLocation || 'Location unspecified'})\n` +
    `• Accessible Toilet: ${statusLabels[f.accessibleToilet] || 'Unknown'}\n` +
    `• Accessible Parking: ${statusLabels[f.accessibleParking] || 'Unknown'}\n` +
    `• Wide Doorways (85+ cm): ${statusLabels[f.wideDoorways] || 'Unknown'}\n` +
    `• Wheelchair Pathways: ${statusLabels[f.wheelchairPathways] || 'Unknown'}\n` +
    `• Accessible Service Counters: ${statusLabels[f.accessibleCounters] || 'Unknown'}\n` +
    (place.limitationsNotes ? `• Mobility Limitations: ${place.limitationsNotes}\n` : '') +
    (activeBarriers.length > 0 ? `⚠️ **Active Reported Barrier Alert**: ${activeBarriers.map(b => b.description).join('; ')}\n` : '')
  );
};

// AI Accessibility Assistant – Your Guide to Accessible Places
exports.chatWithAssistant = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required.' });
    }

    const trimmed = message.trim();
    const lower = trimmed.toLowerCase();

    // 1. Fetch relevant database context
    // Check if any specific places in database are mentioned
    const allApprovedPlaces = await Place.findAll({
      where: { approvalStatus: 'APPROVED' },
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
        { model: AccessibilityFeature, as: 'accessibilityFeature' },
        { model: AccessibilityReport, as: 'reports' }
      ]
    });

    // Detect mentioned places
    const matchedPlaces = allApprovedPlaces.filter((p) => {
      const pName = p.name.toLowerCase();
      const pArea = p.cityOrArea.toLowerCase();
      // Match if 3+ letter words from place name appear in user message
      const words = pName.split(/[\s,–-]+/).filter(w => w.length > 3);
      return words.some(w => lower.includes(w)) || lower.includes(pName) || lower.includes(pArea);
    });

    // 2. Check for Place Comparison Request
    const isCompareRequest = lower.includes('compare') || lower.includes('versus') || lower.includes(' vs ') || lower.includes('better between');
    if (isCompareRequest && matchedPlaces.length >= 2) {
      const [placeA, placeB] = matchedPlaces.slice(0, 2);
      const reply =
        `### Side-by-Side Place Comparison\n\n` +
        formatPlaceDetails(placeA) + '\n---\n\n' +
        formatPlaceDetails(placeB) + '\n\n' +
        `**Comparison Summary:**\n` +
        `• **Entrance:** ${placeA.name} has ${placeA.numberOfSteps} step(s); ${placeB.name} has ${placeB.numberOfSteps} step(s).\n` +
        `• **Ramps:** ${placeA.name} is "${placeA.accessibilityFeature?.wheelchairRamp || 'UNKNOWN'}"; ${placeB.name} is "${placeB.accessibilityFeature?.wheelchairRamp || 'UNKNOWN'}".\n` +
        `• **Elevators:** ${placeA.name} is "${placeA.accessibilityFeature?.elevator || 'UNKNOWN'}"; ${placeB.name} is "${placeB.accessibilityFeature?.elevator || 'UNKNOWN'}".\n\n` +
        `*Note: Missing or unknown information is never assumed to be accessible or inaccessible.*`;

      return res.json({
        success: true,
        reply,
        suggestions: [
          `Open ${placeA.name} profile`,
          `Open ${placeB.name} profile`,
          'Compare other locations'
        ],
        timestamp: new Date().toISOString()
      });
    }

    // 3. Check for Verification Status explanation
    if (lower.includes('verification status') || lower.includes('what is verified') || lower.includes('how does verification work') || lower.includes('community reported')) {
      const reply =
        `### Understanding EMPOWAY Verification Statuses\n\n` +
        `EMPOWAY categorizes accessibility data into three strict information statuses:\n\n` +
        `1. **Verified (Shield Check)**: Confirmed through an on-site physical accessibility assessment conducted by trained accessibility auditors according to Gazette No. 1467/15 standards.\n\n` +
        `2. **Community Reported (Users Icon)**: Information submitted by registered users. While highly valuable for real-time updates, it has **not yet been independently physical-audited**.\n\n` +
        `3. **Unknown (Help Icon)**: Insufficient data is on record. Under EMPOWAY's zero-assumption policy, missing data is **never assumed to be accessible**.\n\n` +
        `*Community reports are never automatically marked as verified until an authorized audit is completed.*`;

      return res.json({
        success: true,
        reply,
        suggestions: [
          'How do I report a barrier?',
          'What is the Sri Lankan ramp gradient standard?',
          'Find verified hospitals in Colombo'
        ],
        timestamp: new Date().toISOString()
      });
    }

    // 4. Check for Barrier Reporting Guidance
    if (lower.includes('report') || lower.includes('broken') || lower.includes('damaged') || lower.includes('barrier') || lower.includes('blocked entrance') || lower.includes('elevator not working')) {
      const reply =
        `### How to Report Physical Accessibility Barriers\n\n` +
        `If you encounter a barrier such as a **damaged ramp**, a **blocked entrance**, an **out-of-order elevator**, or an **unavailable accessible restroom**:\n\n` +
        `1. Navigate to the place page in EMPOWAY.\n` +
        `2. Click **"Report Barrier / Inaccuracy"**.\n` +
        `3. Select the barrier type (e.g. *Damaged Ramp*, *Blocked Entrance*, *Elevator Out of Order*).\n` +
        `4. Provide an on-site description and optionally attach an evidence photograph.\n\n` +
        `**Moderation Lifecycle:**\n` +
        `• **Submitted** → **Under Review** → **Confirmed** (feature marked as barrier on site) → **Resolved** (when verified repaired) or **Rejected**.\n\n` +
        `Your reports immediately alert other wheelchair commuters to avoid hazardous routes!`;

      return res.json({
        success: true,
        reply,
        suggestions: [
          'Show places with active barrier alerts',
          'Explore Colombo places directory',
          'How does verification work?'
        ],
        timestamp: new Date().toISOString()
      });
    }

    // 5. Check if user asked about a specific place
    if (matchedPlaces.length > 0) {
      const primary = matchedPlaces[0];
      const reply =
        `Here is the verified physical accessibility profile from the EMPOWAY database:\n\n` +
        formatPlaceDetails(primary) + '\n\n' +
        `Would you like to compare **${primary.name}** with another facility, or check nearby accessible transit?`;

      return res.json({
        success: true,
        reply,
        suggestions: [
          `Compare ${primary.name}`,
          'What are the emergency contact numbers?',
          'Find nearby accessible transport'
        ],
        timestamp: new Date().toISOString()
      });
    }

    // 6. Check category searches (hospitals, banks, universities, transport)
    let categoryPlaces = [];
    if (lower.includes('hospital') || lower.includes('clinic') || lower.includes('doctor') || lower.includes('health') || lower.includes('medical')) {
      categoryPlaces = allApprovedPlaces.filter(p => p.category?.slug === 'hospitals-healthcare');
    } else if (lower.includes('bank') || lower.includes('atm') || lower.includes('money') || lower.includes('finance')) {
      categoryPlaces = allApprovedPlaces.filter(p => p.category?.slug === 'banks-financial-services');
    } else if (lower.includes('university') || lower.includes('campus') || lower.includes('school') || lower.includes('education')) {
      categoryPlaces = allApprovedPlaces.filter(p => p.category?.slug === 'universities-education');
    } else if (lower.includes('station') || lower.includes('rail') || lower.includes('train') || lower.includes('bus') || lower.includes('transport')) {
      categoryPlaces = allApprovedPlaces.filter(p => p.category?.slug === 'public-transport-transit');
    } else if (lower.includes('restaurant') || lower.includes('cafe') || lower.includes('food') || lower.includes('dining')) {
      categoryPlaces = allApprovedPlaces.filter(p => p.category?.slug === 'restaurants-cafes');
    }

    if (categoryPlaces.length > 0) {
      const sample = categoryPlaces.slice(0, 4);
      const reply =
        `Here are accessible facilities in that category from the EMPOWAY Sri Lanka database:\n\n` +
        sample.map(p => {
          const f = p.accessibilityFeature || {};
          return (
            `• **${p.name}** (${p.cityOrArea})\n` +
            `  - Status: ${p.accessibilityStatus === 'VERIFIED' ? 'Verified Audit' : 'Community Reported'}\n` +
            `  - Entrance: ${p.numberOfSteps === 0 ? 'Step-Free' : `${p.numberOfSteps} step(s)`}\n` +
            `  - Ramp: ${f.wheelchairRamp === 'AVAILABLE' ? 'Permanent Ramp' : f.wheelchairRamp === 'NOT_AVAILABLE' ? 'No Ramp' : 'Needs Verification'}\n` +
            `  - Elevator: ${f.elevator === 'AVAILABLE' ? 'Operating' : f.elevator === 'NOT_AVAILABLE' ? 'No Elevator' : 'Unknown'}`
          );
        }).join('\n\n') +
        `\n\n*All information is sourced strictly from our PostgreSQL audit records without inventing details.*`;

      return res.json({
        success: true,
        reply,
        suggestions: [
          `Compare ${sample[0]?.name || 'two places'}`,
          'How does verification work?',
          'Report a broken ramp'
        ],
        timestamp: new Date().toISOString()
      });
    }

    // 7. Standards and Regulations
    if (lower.includes('standard') || lower.includes('gradient') || lower.includes('law') || lower.includes('regulation') || lower.includes('gazette')) {
      const reply =
        `### Sri Lankan Physical Accessibility Regulations (Gazette No. 1467/15)\n\n` +
        `1. **Ramp Gradient**: Legal maximum is **1:12** (8.33% slope); 1:15 recommended for independent wheelchair use.\n` +
        `2. **Clear Doorway Width**: Minimum **900 mm** (35.4 inches) clear opening to permit standard and power chairs.\n` +
        `3. **Handrails**: Continuous dual-height handrails at **850 mm - 900 mm** with slip-resistant tactile grip.\n` +
        `4. **Accessible Restrooms**: Minimum dimensions **1500 mm × 1750 mm**, outward swinging doors, grab bars at 800 mm, and emergency pull cord.\n` +
        `5. **Parking Bays**: Dedicated extra-wide parking space (3600 mm width) within 50 m of accessible building entrance.\n\n` +
        `EMPOWAY audits public facilities directly against these Gazette specifications.`;

      return res.json({
        success: true,
        reply,
        suggestions: [
          'Find verified hospitals in Colombo',
          'How do I report a building without a ramp?',
          'What is the scorecard formula?'
        ],
        timestamp: new Date().toISOString()
      });
    }

    // 8. If Gemini API Key is available, use Gemini with strict DB Grounding
    if (process.env.GEMINI_API_KEY) {
      try {
        const apiKey = process.env.GEMINI_API_KEY;
        const groundedContext = allApprovedPlaces.slice(0, 10).map(p => `${p.name} (${p.cityOrArea}): status=${p.accessibilityStatus}, steps=${p.numberOfSteps}, ramp=${p.accessibilityFeature?.wheelchairRamp}`).join('\n');
        
        const systemPrompt = `You are the EMPOWAY AI Accessibility Assistant for Sri Lanka.
Strict Grounding Rules:
- Answer based ONLY on the database records provided below or Sri Lankan accessibility standards (Gazette 1467/15).
- DO NOT invent places, addresses, or accessibility features.
- If information is missing or unverified, explicitly state that it is unavailable in the database.
- Never claim a place is wheelchair accessible without supporting data.

Database Context:
${groundedContext}`;

        const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              { role: 'user', parts: [{ text: `${systemPrompt}\n\nUser Question: ${trimmed}` }] }
            ]
          })
        });

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const generatedText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (generatedText) {
            return res.json({
              success: true,
              reply: generatedText,
              suggestions: [
                'Find accessible hospitals',
                'Compare two places',
                'How does verification work?'
              ],
              timestamp: new Date().toISOString()
            });
          }
        }
      } catch (geminiErr) {
        console.error('Gemini call error:', geminiErr);
        // Fall back gracefully to default grounded response
      }
    }

    // 9. Default Grounded Fallback
    const reply =
      `Ayubowan! I am the **EMPOWAY Assistant – Your Guide to Accessible Places** in Sri Lanka.\n\n` +
      `I can help you with:\n` +
      `• **Discovering Public Places**: Search hospitals, banks, universities, transport hubs, and restaurants audited for wheelchair accessibility.\n` +
      `• **Factual Feature Queries**: Check step counts, ramp slopes, elevator operations, and accessible toilets without false claims.\n` +
      `• **Comparing Two Places**: Request a side-by-side comparison of any locations in Colombo.\n` +
      `• **Understanding Verification**: Learn how physical audits differ from unverified community reports.\n` +
      `• **Reporting Problems**: Guidance on logging broken ramps, blocked doors, or broken elevators.\n\n` +
      `What destination or accessibility feature would you like to check?`;

    return res.json({
      success: true,
      reply,
      suggestions: [
        'Find accessible hospitals in Colombo',
        'Compare NHSL and Asiri Central',
        'How does verification work?',
        'How do I report a broken ramp?'
      ],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('chatWithAssistant error:', error);
    return res.status(500).json({ success: false, message: 'Failed to process assistant query.', error: error.message });
  }
};
