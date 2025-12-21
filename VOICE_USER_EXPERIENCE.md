# Voice Recognition - Visual User Experience Guide

## 🎯 What Users Will See

### Scenario 1: Clear Speech (High Confidence)

```
┌─────────────────────────────────────────────────────────┐
│                      CHATBOT INTERFACE                   │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  Language: [English ▼]                                   │
│                                                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Previous response from AI...                     │   │
│  └──────────────────────────────────────────────────┘   │
│                                                           │
│  🎤 Listening... Speak clearly! (Avoid background       │
│     noise)                                               │
│  ↓                                                       │
│  [after speech recognized...]                           │
│  ✅ Recording stopped. Review your text above.         │
│                                                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │ 📝 You said: "What is the best fertilizer?"      │   │
│  │ ✅ Confidence: 92%                               │   │
│  └──────────────────────────────────────────────────┘   │
│                                                           │
│  Input: [What is the best fertilizer?] [🎤]  [Ask ▶]  │
│                                                           │
│                                                           │
│  → User clicks [Ask ▶]                                  │
│  → Chatbot sends query to Groq                          │
│  → Response appears below                               │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### Scenario 2: Unclear Speech (Low Confidence - Auto Retry)

```
┌─────────────────────────────────────────────────────────┐
│                      CHATBOT INTERFACE                   │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  🎤 Listening...                                         │
│  ↓                                                       │
│  [speech recognized but confidence is low]              │
│                                                           │
│  ⚠️ Low confidence (35%). Retrying... (1/3)            │
│                                                           │
│  [2 seconds wait...]                                    │
│                                                           │
│  🎤 Listening... (Retry attempt 2)                      │
│  ↓                                                       │
│  [better recognition]                                   │
│                                                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │ 📝 You said: "నీ చక్కుబీ ఉపయోగం"                │
│  │ 📊 Confidence: 68%                               │   │
│  │ ✏️ Edit above and click Ask, or use voice button │   │
│  │    again                                          │   │
│  └──────────────────────────────────────────────────┘   │
│                                                           │
│  Input: [నీ చక్కుబీ ఉపయోగం] [🎤]  [Ask ▶]           │
│                                                           │
│  Note: Input field is editable! User can:               │
│  - Click in field                                        │
│  - Edit misrecognized words                             │
│  - Click Ask when ready                                 │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### Scenario 3: User Edits Text (NEW Feature)

```
Before:
┌──────────────────────────────────────────────────┐
│ Input: [నీ చక్క బీ ఉపయోగం] [🎤]  [Ask ▶]     │
│ 📝 Recognized: "నీ చక్క బీ ఉపయోగం"            │
└──────────────────────────────────────────────────┘

User clicks in input field and edits...
↓

After:
┌──────────────────────────────────────────────────┐
│ Input: [నీ చక్కుబీ ఉపయోగం] [🎤]  [Ask ▶]      │
│ 📝 You corrected to: "నీ చక్కుబీ ఉపయోగం"       │
│ ✏️ Ready to send!                               │
└──────────────────────────────────────────────────┘

User clicks [Ask ▶]
↓
Query sent to chatbot with CORRECTED text!
```

### Scenario 4: Error Scenarios

```
NO MICROPHONE:
┌──────────────────────────────────────────────────┐
│ ❌ Microphone not found or not working.          │
│    Check your device settings.                   │
└──────────────────────────────────────────────────┘

PERMISSION DENIED:
┌──────────────────────────────────────────────────┐
│ ❌ Microphone permission denied.                 │
│    Enable microphone access in browser settings. │
└──────────────────────────────────────────────────┘

NO SPEECH DETECTED:
┌──────────────────────────────────────────────────┐
│ ⚠️ No speech detected. Please speak louder and   │
│    try again. (Retry 1/3)                       │
│                                                  │
│ [after retry]                                    │
│ 🎤 Listening... (Retry 2)                       │
└──────────────────────────────────────────────────┘

NETWORK ERROR:
┌──────────────────────────────────────────────────┐
│ ❌ Network error. Check your internet            │
│    connection.                                   │
└──────────────────────────────────────────────────┘
```

---

## 🔄 Voice Button States

### Normal State
```
[🎤] - Green button, says "Click to start voice recording"
```

### Recording State
```
[🎤] - Red button with pulse animation
     Text: "🎤 Listening..."
     Visual: Pulsing dot animation
```

### Processing State
```
[🎤] - Yellow/orange button
     Text: "⚠️ Low confidence. Retrying..."
```

### Done State
```
[🎤] - Green button
     Text: "⏸️ Recording stopped. Review your text above."
     Recognized text box shows with confidence %
```

---

## 📱 Language-Specific Tips

### For English Users
(No tips shown - voice works best for English)

### For Telugu/Hindi/Tamil/Kannada/Marathi Users
```
┌──────────────────────────────────────────────────┐
│ 💡 Voice Input Tips for Better Accuracy:         │
│ • Speak clearly and slowly                       │
│ • Minimize background noise                      │
│ • Use a good microphone                          │
│ • Use standard language (not dialect-heavy)      │
│ • Review before sending                          │
│ • If accuracy is still low, use text input       │
└──────────────────────────────────────────────────┘
[Tips shown above chat form only for non-English]
```

---

## 🎯 Confidence Color Coding

```
Confidence < 50%:
├─ 📊 Color: Orange
├─ Icon: ⚠️
├─ Action: Auto-retry or ask user to edit
└─ Message: "Low confidence. Retrying..."

Confidence 50-80%:
├─ 📊 Color: Orange/Yellow  
├─ Icon: 📊
├─ Action: Show for user review
└─ Message: "Edit above and click Ask"

Confidence > 80%:
├─ 📊 Color: Green
├─ Icon: ✅
├─ Action: Ready to send
└─ Message: "Confidence: 92%"
```

---

## 💬 User Flows

### Flow 1: Happy Path (Clear Speech)
```
Click 🎤 
  ↓
Speak clearly: "నీ చక్కుబీ ఉపయోగం"
  ↓
System recognizes with 85% confidence
  ↓
Shows: "📝 You said: ... ✅ Confidence: 85%"
  ↓
User clicks Ask
  ↓
✅ Success - Chatbot responds
```

### Flow 2: Edit Path (Unclear Speech)
```
Click 🎤
  ↓
Speak unclearly: "నీ చక్క... బీ"
  ↓
System recognizes with 45% confidence
  ↓
Auto-retries (shows "Retrying... 1/3")
  ↓
System recognizes with 62% confidence
  ↓
Shows: "📝 You said: నీ చక్క బీ ఉపయోగం"
        "⚠️ Edit above..."
  ↓
User clicks in input field
  ↓
User edits: "నీ చక్కుబీ ఉపయోగం" (fixes the word)
  ↓
User clicks Ask
  ↓
✅ Success - Chatbot responds to CORRECTED query
```

### Flow 3: Error Path (No Microphone)
```
Click 🎤
  ↓
Browser asks for microphone permission
  ↓
User denies or no microphone available
  ↓
Shows: "❌ Microphone permission denied/not found"
  ↓
User falls back to text input
  ↓
Manually types question
  ↓
User clicks Ask
  ↓
✅ Success - Works fine with text
```

---

## 🌐 Multilingual Interface

### English
- Labels: "Ask a farming question..."
- Voice button: "Click to record"
- Message: "You said: ..."

### Telugu (తెలుగు)
```
Language selector shows: తెలుగు
Voice tips: "స్పష్టంగా మరియు నెమ్మదిగా మాట్లాడండి"
Button shows: 🎤
Message: "మీరు చెప్పారు: ..."
```

### Hindi (हिंदी)
```
Language selector shows: हिंदी
Voice tips: "स्पष्ट रूप से और धीरे बोलें"
Button shows: 🎤
Message: "आपने कहा: ..."
```

### Tamil (தமிழ்)
```
Language selector shows: தமிழ்
Voice tips: "தெளிவாகவும் மெதுவாகவும் பேசுங்கள்"
Button shows: 🎤
Message: "நீங்கள் கூறினீர்கள்: ..."
```

### Kannada (ಕನ್ನಡ)
```
Language selector shows: ಕನ್ನಡ
Voice tips: "ಸ್ಪಷ್ಟವಾಗಿ ಮತ್ತು ನಿಧಾನವಾಗಿ ಮಾತನಾಡಿ"
Button shows: 🎤
Message: "ನೀವು ಹೇಳಿದ್ದು: ..."
```

### Marathi (मराठी)
```
Language selector shows: मराठी
Voice tips: "स्पष्टपणे आणि हळूहळू बोला"
Button shows: 🎤
Message: "आपण सांगितलं: ..."
```

---

## ✨ Visual Indicators

### Voice Button Animation During Recording
```
Frame 1: 🎤 (normal)
Frame 2: 🎤● (pulse out)
Frame 3: 🎤●● (pulse out more)
Frame 4: 🎤● (pulse in)
Frame 5: 🎤 (normal)
[Repeat - creates listening effect]
```

### Recognized Text Box Appearance
```
┌─────────────────────────────────────┐
│ 📝 You said: "..."                  │
│ ✅ Confidence: X%                   │
│                                      │
│ [Optional: ✏️ Edit hint]            │
└─────────────────────────────────────┘
[Green border, slides in smoothly]
```

### Status Messages Color Coding
```
🎤 Listening... (BLUE)
   └─ Info: Currently recording

⚠️ Low confidence (ORANGE)
   └─ Warning: System uncertain, will retry

✅ Confidence: 92% (GREEN)
   └─ Success: Ready to send

❌ Error: ... (RED)
   └─ Error: Something went wrong
```

---

## 🎮 Interactive Elements

### Voice Button Features
- **Normal:** Clickable, shows "Click to start"
- **Recording:** Red pulsing animation, shows "Stop recording"
- **Processing:** Disabled, shows "Processing..."
- **Done:** Shows confidence and recognized text

### Input Field Features
- **After voice:** Automatically focuses
- **Text is editable:** User can change anything
- **Cursor visible:** Shows user can edit
- **Ready for submit:** Ask button remains clickable

### Status Div Features
- **Auto-hides:** After 3 seconds if successful
- **Stays visible:** If error occurred
- **Color-coded:** Blue/Orange/Green/Red
- **Smooth animations:** Slides in/fades out

---

## 📊 Confidence Meter (Visual)

```
Confidence Scale:

0% ────────────────────────────────── 100%
❌  ⚠️  📊  ✅
Low   Med  Good  High

0-40%:   ❌ Very Low - Will auto-retry
40-50%:  ❌ Low - Will auto-retry  
50-70%:  ⚠️  Medium - Can edit
70-85%:  📊 Good - Mostly ready
85-100%: ✅ Excellent - Safe to send
```

---

## 🧪 Testing Checklist for Users

- [ ] Can I click voice button?
- [ ] Does microphone permission appear?
- [ ] Can I speak and see text appear?
- [ ] Does confidence percentage show?
- [ ] Can I edit the recognized text?
- [ ] Does edited text send to chatbot?
- [ ] Does auto-retry happen for low confidence?
- [ ] Do error messages make sense?
- [ ] Can I switch languages and voice still works?
- [ ] Do tips appear for non-English?

---

## 📝 Example Scenarios

### Scenario A: Farmer in Field (Noisy)
```
Farmer: "నీ చక్కుబీ సేద్యం ఏ నెల?"
[Background: Tractor noise, birds, wind]

System hears: "నీ చక్కు సేద్యం ఏ" (partial)
Confidence: 38%

Action: Auto-retries (message shows "Retrying 1/3")
↓
Farmer repeats louder: "నీ చక్కుబీ సేద్యం?"
System hears: "నీ చక్కుబీ సేద్యం?" (better)
Confidence: 72%

Farmer sees: "📝 You said: నీ చక్కుబీ సేద్యం?"
           "⚠️ Edit above and click Ask"

Farmer clicks Ask (text is good)
↓
✅ Chatbot responds with seeding information
```

### Scenario B: Office Worker (Clear Environment)
```
Worker: "What's the best fertilizer for rice?"
[Office: Quiet, good microphone]

System hears: "What's the best fertilizer for rice?"
Confidence: 94%

Worker sees: "📝 You said: What's the best fertilizer for rice?"
            "✅ Confidence: 94%"

Worker clicks Ask
↓
✅ Chatbot responds immediately
```

### Scenario C: User with Accent
```
Farmer: "నీ... చక్కుబీ... ఉపయోగం" (slow, accent)
[Speaker slowly enunciates each word]

System hears: "నీ చక్కుబీ ఉపయోగం" (clear)
Confidence: 78%

Farmer sees: "📝 You said: నీ చక్కుబీ ఉపయోగం"
            "📊 Confidence: 78%"

Farmer clicks Ask
↓
✅ Chatbot responds (accent handling worked!)
```

---

**This is what farmers will experience with the improved voice feature!**

Version: 1.1.3  
Status: ✅ Live on GitHub
