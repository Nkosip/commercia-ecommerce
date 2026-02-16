# ATS Chatbot Component

A beautiful, feature-rich chatbot component for React applications. Easily integrates with any existing project.

## Features

- 🤖 **AI Shopping Assistant** - Ecommerce-focused knowledge base
- 🎨 **Modern UI** - Beautiful gradients, animations, and effects
- 📱 **Responsive Design** - Works on mobile and desktop
- 🌙 **Dark Mode Support** - Automatically adapts to system preferences
- 💬 **Quick Replies** - Common questions as buttons
- ⏱️ **Typing Indicators** - Shows when bot is "thinking"
- 🎯 **Message Categories** - Organized responses by topic
- 🔄 **Minimize/Maximize** - Flexible chat window control

## Installation

1. **Run the PowerShell script** in your project root:
   ```powershell
   # If you get execution policy error:
   Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process -Force
   .\add-ats-chatbot.ps1
Import the component in your main app file (App.js, App.jsx, etc.):

jsx
import ATSChat from './components/ATSChat/ATSChat';

function App() {
  return (
    <div>
      {/* Your existing content */}
      <ATSChat />
    </div>
  );
}
Start your development server:

bash
npm start      # Create React App
npm run dev    # Vite
yarn dev       # Vite with Yarn
Customization
Modify Knowledge Base
Edit the knowledgeBase array in ATSChat.jsx:

javascript
const knowledgeBase = [
  {
    keywords: ['your', 'keywords'],
    response: 'Your custom response',
    category: 'Category Name'
  }
];
Change Colors
Edit the gradient colors in ATSChat.css:

css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
Add Quick Replies
Edit the quickReplies array in ATSChat.jsx:

javascript
const quickReplies = [
  'Your quick reply 1',
  'Your quick reply 2'
];
Files Created
components/ATSChat/ATSChat.jsx - Main component

components/ATSChat/ATSChat.css - Styles

Compatibility
✅ React 16.8+ (uses Hooks)

✅ Create React App

✅ Vite

✅ Next.js

✅ Any React setup

No Dependencies Required
The component uses pure React and CSS - no external libraries needed!

Troubleshooting
Component not showing:

Check import path is correct

Verify component is added to JSX

Check browser console for errors

Styles not loading:

Ensure CSS file is in same directory as JSX

Check class names match

Chat button not working:

Verify React is properly installed

Check for console errors

Support
For questions or issues, contact the ATS development team.

Happy coding! 🚀
