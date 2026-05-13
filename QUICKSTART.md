# Quick Start Guide - M2SQL

## 🚀 Get Up and Running in 3 Steps

### Step 1: Set Your API Key

1. Open the `.env.local` file in the project root
2. Replace `your_api_key_here` with your actual OpenRouter API key
3. If you don't have one, get it from: https://openrouter.ai/keys

```env
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Step 2: Start the Development Server

Open your terminal and run:

```bash
npm run dev
```

Wait for the message: `Local: http://localhost:3000`

### Step 3: Open the Application

Navigate to http://localhost:3000 in your browser

## ✨ Your First Translation

1. **Click the Example Selector** at the top of the left panel
2. **Select** "Basic Column Rename and Filter" from the dropdown
3. **Click "Load Example"** to populate the M Code editor
4. **Press Ctrl+Enter** (or click the "Translate" button)
5. **Watch** as your M Code transforms into optimized T-SQL!

## 🎯 Tips for Best Results

- **Start Simple**: Try the basic examples first to understand the translation style
- **Break Down Complex Queries**: Very large M Code blocks work better when split into logical sections
- **Review Explanations**: Check the "Translation Details" panel for optimization insights
- **Use Keyboard Shortcuts**: Ctrl+Enter to translate, Ctrl+K to clear

## 📝 Example Categories

- **Basic**: Simple transformations (renames, filters, type changes)
- **Intermediate**: Joins, groupings, and aggregations
- **Advanced**: Complex multi-step queries with window functions

## 🛠 Troubleshooting

**Translation not working?**
- Check that your `.env.local` file has the correct API key
- Restart the dev server after changing environment variables
- Make sure you have an active internet connection

**Build errors?**
- Run `npm install` to ensure all packages are installed
- Delete the `.next` folder and run `npm run build` again

**TypeScript errors?**
- These are mostly resolved, but if you see any, run `npx tsc --noEmit` to check

## 🎨 Customize Your Experience

- **Toggle Layout**: Click the button in the header to switch between horizontal/vertical split
- **Dark Mode**: The app uses your system's dark mode preference
- **Export**: Use Copy or Download buttons to save your translated SQL

## 📚 Next Steps

1. Try all 8 examples to see different translation patterns
2. Paste your own M Code from Power Query
3. Compare the SQL output with your expectations
4. Review the optimization notes to learn best practices

## 🆘 Need Help?

- Review the full README.md for detailed documentation
- Check PROMPT.md for translation requirements
- Review DESIGN.md for architecture details

Happy translating! 🎉
