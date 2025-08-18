# Hooks Belt 🎯

A comprehensive collection of useful React hooks for common use cases. Built with TypeScript and designed for production use.

## ✨ Features

- **10 Custom Hooks** - Covering the most common React development needs
- **Full TypeScript Support** - Complete type definitions and IntelliSense
- **Production Ready** - Well-tested and optimized for real-world usage
- **Zero Dependencies** - Only requires React as a peer dependency
- **Tree Shakeable** - Import only the hooks you need

## 📦 Installation

```bash
npm install hooks-belt
```

or

```bash
yarn add hooks-belt
```

## 🚀 Quick Start

```tsx
import { useDebounce, useLocalStorage, useToggle } from 'hooks-belt'

function MyComponent() {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  
  const [user, setUser] = useLocalStorage('user', { name: 'John' })
  const [isOpen, toggle] = useToggle(false)
  
  // Your component logic here
}
```

## 📚 Available Hooks

### useDebounce
Delays the execution of a function or value update. Perfect for search inputs and API calls.

```tsx
const [searchTerm, setSearchTerm] = useState('')
const debouncedSearchTerm = useDebounce(searchTerm, 500)

useEffect(() => {
  // This will only run after the user stops typing for 500ms
  searchAPI(debouncedSearchTerm)
}, [debouncedSearchTerm])
```

### useThrottle
Limits the rate at which a function can be executed. Great for scroll handlers and resize events.

```tsx
const throttledScrollHandler = useThrottle(() => {
  console.log('Scroll event throttled')
}, 100)

useEffect(() => {
  window.addEventListener('scroll', throttledScrollHandler)
  return () => window.removeEventListener('scroll', throttledScrollHandler)
}, [throttledScrollHandler])
```

### useLocalStorage
Provides a way to persist state in localStorage with automatic JSON serialization.

```tsx
const [user, setUser] = useLocalStorage('user', { name: 'John', age: 30 })

// Update the user
setUser({ name: 'Jane', age: 25 })

// The value is automatically saved to localStorage
```

### useMediaQuery
Responds to media queries and automatically updates when the query matches or doesn't match.

```tsx
const isMobile = useMediaQuery('(max-width: 768px)')
const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

return (
  <div className={isMobile ? 'mobile-layout' : 'desktop-layout'}>
    {isDarkMode ? 'Dark mode' : 'Light mode'}
  </div>
)
```

### usePrevious
Returns the previous value of a state or prop. Useful for comparing current and previous values.

```tsx
const [count, setCount] = useState(0)
const previousCount = usePrevious(count)

useEffect(() => {
  if (previousCount !== undefined && count > previousCount) {
    console.log('Count increased!')
  }
}, [count, previousCount])
```

### useToggle
Provides a boolean state with toggle functionality and additional setter functions.

```tsx
const [isOpen, toggle, setOpen, setClosed] = useToggle(false)

return (
  <div>
    <button onClick={toggle}>Toggle</button>
    <button onClick={setOpen}>Open</button>
    <button onClick={setClosed}>Close</button>
    {isOpen && <Modal />}
  </div>
)
```

### useOnClickOutside
Detects clicks outside of a specified element. Perfect for modals and dropdowns.

```tsx
const modalRef = useRef<HTMLDivElement>(null)
const [isOpen, setIsOpen] = useState(false)

useOnClickOutside(modalRef, () => setIsOpen(false))

return (
  {isOpen && (
    <div ref={modalRef} className="modal">
      Modal content
    </div>
  )}
)
```

### useFetch
Provides a way to fetch data with loading and error states.

```tsx
const { data, loading, error, refetch } = useFetch('/api/users')

if (loading) return <div>Loading...</div>
if (error) return <div>Error: {error.message}</div>

return (
  <div>
    {data?.map(user => <User key={user.id} user={user} />)}
    <button onClick={refetch}>Refresh</button>
  </div>
)
```

### useWindowSize
Tracks the window dimensions and automatically updates when the window is resized.

```tsx
const { width, height } = useWindowSize()

return (
  <div>
    Window size: {width} x {height}
    {width < 768 && <MobileMenu />}
  </div>
)
```

### useInterval
Provides a way to run a function at regular intervals with pause/resume functionality.

```tsx
const [count, setCount] = useState(0)
const [isRunning, setIsRunning] = useState(true)

useInterval(
  () => setCount(c => c + 1),
  isRunning ? 1000 : null
)

return (
  <div>
    Count: {count}
    <button onClick={() => setIsRunning(!isRunning)}>
      {isRunning ? 'Pause' : 'Resume'}
    </button>
  </div>
)
```

## 🧪 Testing

Run the test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Generate coverage report:

```bash
npm run test:coverage
```

## 🏗️ Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone https://github.com/morozander/hooks-belt.git
cd hooks-belt
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Build the library:
```bash
npm run build:lib
```

### Project Structure

```
hooks-belt/
├── src/
│   ├── hooks/           # Individual hook implementations
│   ├── test/            # Test setup and utilities
│   ├── App.tsx          # Demo application
│   └── index.ts         # Main export file
├── dist/                # Built library files
├── tests/               # Unit tests for each hook
├── package.json         # Package configuration
├── tsconfig.json        # TypeScript configuration
├── vitest.config.ts     # Test configuration
└── README.md            # This file
```

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Reporting Issues

- Use the [GitHub issue tracker](https://github.com/morozander/hooks-belt/issues)
- Include a clear description of the problem
- Provide steps to reproduce the issue
- Include your environment details

### Submitting Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass: `npm test`
6. Commit your changes: `git commit -m 'Add amazing feature'`
7. Push to the branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

### Code Style

- Follow the existing TypeScript/React patterns
- Include JSDoc comments for all public APIs
- Write comprehensive tests for new hooks
- Ensure your code passes linting: `npm run lint`

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the React community's need for reusable hooks
- Built with modern tooling (Vite, TypeScript, Vitest)
- Thanks to all contributors and users

---

Made with ❤️ for the React community
