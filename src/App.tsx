import React, { useRef, useState } from 'react'
import {
  useDebounce,
  useThrottle,
  useLocalStorage,
  useMediaQuery,
  usePrevious,
  useToggle,
  useOnClickOutside,
  useFetch,
  useWindowSize,
  useInterval
} from './index'
import './App.css'

function App() {
  // useDebounce example
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  // useThrottle example
  const throttledLog = useThrottle(() => {
    console.log('Throttled log at:', new Date().toLocaleTimeString())
  }, 1000)

  // useLocalStorage example
  const [user, setUser] = useLocalStorage('user', { name: 'John Doe', age: 30 })

  // useMediaQuery example
  const isMobile = useMediaQuery('(max-width: 768px)')
  const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  // usePrevious example
  const [count, setCount] = useState(0)
  const previousCount = usePrevious(count)

  // useToggle example
  const [isModalOpen, toggleModal, openModal, closeModal] = useToggle(false)

  // useOnClickOutside example
  const modalRef = useRef<HTMLDivElement>(null)
  useOnClickOutside(modalRef as React.RefObject<HTMLElement>, closeModal)

  // useFetch example
  const { data: posts, loading, error, refetch } = useFetch('https://jsonplaceholder.typicode.com/posts?_limit=3')

  // useWindowSize example
  const { width, height } = useWindowSize()

  // useInterval example
  const [timer, setTimer] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  useInterval(
    () => setTimer(t => t + 1),
    isTimerRunning ? 1000 : null
  )

  return (
    <div className="App">
      <header className="App-header">
        <h1>Hooks Belt - Custom React Hooks Demo</h1>
        <p>A collection of useful React hooks for common use cases</p>
      </header>

      <main className="App-main">
        {/* useDebounce Demo */}
        <section className="hook-demo">
          <h2>useDebounce</h2>
          <p>Type in the input below to see debouncing in action:</p>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Type here..."
            className="demo-input"
          />
          <p>Current value: <strong>{searchTerm}</strong></p>
          <p>Debounced value: <strong>{debouncedSearchTerm}</strong></p>
        </section>

        {/* useThrottle Demo */}
        <section className="hook-demo">
          <h2>useThrottle</h2>
          <p>Click the button below to see throttling (max once per second):</p>
          <button onClick={throttledLog} className="demo-button">
            Throttled Log
          </button>
          <p>Check the console to see throttled logs</p>
        </section>

        {/* useLocalStorage Demo */}
        <section className="hook-demo">
          <h2>useLocalStorage</h2>
          <p>Current user: <strong>{user.name}</strong> (age: {user.age})</p>
          <button 
            onClick={() => setUser({ name: 'Jane Smith', age: 25 })}
            className="demo-button"
          >
            Change User
          </button>
          <button 
            onClick={() => setUser({ name: 'John Doe', age: 30 })}
            className="demo-button"
          >
            Reset User
          </button>
        </section>

        {/* useMediaQuery Demo */}
        <section className="hook-demo">
          <h2>useMediaQuery</h2>
          <p>Device type: <strong>{isMobile ? 'Mobile' : 'Desktop'}</strong></p>
          <p>Color scheme: <strong>{isDarkMode ? 'Dark' : 'Light'}</strong></p>
          <p>Resize your browser window to see changes</p>
        </section>

        {/* usePrevious Demo */}
        <section className="hook-demo">
          <h2>usePrevious</h2>
          <p>Current count: <strong>{count}</strong></p>
          <p>Previous count: <strong>{previousCount ?? 'None'}</strong></p>
          <button onClick={() => setCount(c => c + 1)} className="demo-button">
            Increment
          </button>
          <button onClick={() => setCount(c => c - 1)} className="demo-button">
            Decrement
          </button>
        </section>

        {/* useToggle Demo */}
        <section className="hook-demo">
          <h2>useToggle</h2>
          <p>Modal is: <strong>{isModalOpen ? 'Open' : 'Closed'}</strong></p>
          <button onClick={toggleModal} className="demo-button">
            Toggle Modal
          </button>
          <button onClick={openModal} className="demo-button">
            Open Modal
          </button>
          <button onClick={closeModal} className="demo-button">
            Close Modal
          </button>
        </section>

        {/* useOnClickOutside Demo */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div ref={modalRef} className="modal">
              <h3>Modal Content</h3>
              <p>Click outside this modal to close it!</p>
              <p>Or use the close button below:</p>
              <button onClick={closeModal} className="demo-button">
                Close
              </button>
            </div>
          </div>
        )}

        {/* useFetch Demo */}
        <section className="hook-demo">
          <h2>useFetch</h2>
          {loading && <p>Loading posts...</p>}
          {error && <p>Error: {error.message}</p>}
          {posts && (
            <div>
              <h3>Posts:</h3>
              <ul className="posts-list">
                {posts.map((post: any) => (
                  <li key={post.id}>
                    <strong>{post.title}</strong>
                    <p>{post.body}</p>
                  </li>
                ))}
              </ul>
              <button onClick={refetch} className="demo-button">
                Refresh Posts
              </button>
            </div>
          )}
        </section>

        {/* useWindowSize Demo */}
        <section className="hook-demo">
          <h2>useWindowSize</h2>
          <p>Window dimensions: <strong>{width} x {height}</strong></p>
          <p>Resize your browser window to see real-time updates</p>
        </section>

        {/* useInterval Demo */}
        <section className="hook-demo">
          <h2>useInterval</h2>
          <p>Timer: <strong>{timer}</strong> seconds</p>
          <button 
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className="demo-button"
          >
            {isTimerRunning ? 'Pause Timer' : 'Start Timer'}
          </button>
          <button 
            onClick={() => setTimer(0)}
            className="demo-button"
          >
            Reset Timer
          </button>
        </section>
      </main>
    </div>
  )
}

export default App
