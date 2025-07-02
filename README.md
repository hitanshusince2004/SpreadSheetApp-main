# React Spreadsheet Intern Assignment 02/07/2025

A pixel-perfect React spreadsheet application built with TypeScript, Tailwind CSS, and modern React patterns.

## 🚀 Features

- **Pixel-perfect UI** matching the Figma design
- **Google Sheets/Excel-like experience** with full spreadsheet functionality
- **Interactive cells** with real-time editing
- **Advanced filtering** by status and priority
- **Sorting capabilities** for all columns
- **Search functionality** across all data
- **Keyboard navigation** with arrow keys (stretch goal)
- **Column visibility toggles** (stretch goal)
- **Responsive design** that works on all devices

## 🛠 Tech Stack

- **React 18** with TypeScript (strict mode)
- **Next.js 14** with App Router
- **Tailwind CSS** for utility-first styling
- **Radix UI** for accessible components
- **Lucide React** for consistent icons

## 📦 Installation & Setup

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd react-spreadsheet-intern
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Run development server**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🧪 Quality Assurance

- **Linting**: `npm run lint`
- **Type checking**: `npm run type-check`
- **Code formatting**: `npm run format`

## 🎯 Key Features Implemented

### Core Requirements ✅
- [x] Pixel-perfect layout matching Figma design
- [x] Google Sheets/Excel-like spreadsheet experience
- [x] All buttons/tabs functional with state changes and console logging
- [x] TypeScript strict mode enabled
- [x] Tailwind CSS for styling
- [x] Clean, modular component architecture

### Interactive Features ✅
- [x] **Editable cells** - Click any cell to edit content
- [x] **Real-time search** - Search across tasks, submitters, and assignees
- [x] **Advanced filtering** - Filter by status and priority
- [x] **Column sorting** - Click headers to sort ascending/descending
- [x] **Tab navigation** - Switch between All Orders, Pending, and Completed
- [x] **Add new rows** - Click "New Action" to add entries
- [x] **Toolbar actions** - All buttons log actions to console

### Stretch Goals ✅
- [x] **Keyboard navigation** - Use arrow keys to navigate cells
- [x] **Column hide/show** - Toggle column visibility
- [x] **Cell selection** - Visual feedback for selected cells
- [x] **Responsive design** - Works on all screen sizes

## 🏗 Architecture & Trade-offs

### Component Structure
\`\`\`
components/
├── SpreadsheetApp.tsx      # Main container with state management
├── SpreadsheetHeader.tsx   # Top navigation and search
├── SpreadsheetToolbar.tsx  # Action buttons and tools
├── SpreadsheetFilters.tsx  # Filter dropdowns
├── SpreadsheetTable.tsx    # Main data grid
└── SpreadsheetTabs.tsx     # Bottom tab navigation
\`\`\`

### State Management
- **Local component state** using React hooks
- **No external state library** - keeps bundle size minimal
- **Efficient re-renders** with useMemo and useCallback

### Trade-offs Made
1. **Custom table vs react-table**: Built custom table component for better control over styling and behavior
2. **Client-side filtering/sorting**: All data operations happen in memory for better performance
3. **Static data**: Using mock data instead of API integration for demo purposes
4. **Simplified keyboard navigation**: Basic arrow key support without complex cell editing modes

## 🎨 Design Decisions

- **Consistent spacing** using Tailwind's spacing scale
- **Accessible color palette** with proper contrast ratios
- **Responsive breakpoints** for mobile and desktop
- **Semantic HTML** for better accessibility
- **Focus management** for keyboard users

## 🚀 Performance Optimizations

- **Memoized calculations** for filtered and sorted data
- **Efficient re-renders** with React.memo and useCallback
- **Minimal bundle size** with tree-shaking
- **Optimized images** and icons

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🔧 Development

The application follows modern React best practices:
- **Functional components** with hooks
- **TypeScript strict mode** for type safety
- **ESLint + Prettier** for code quality
- **Modular architecture** for maintainability

## 📄 License

This project is created for the React Intern Assignment.
