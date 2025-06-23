import { create } from 'zustand';
import { SnippetState, Snippet, User } from '../types';
import { generateId } from '../utils';

// Mock data for demonstration
const mockUser: User = {
  id: '1',
  username: 'developer',
  email: 'developer@vinstack.com',
  preferredLanguages: ['javascript', 'typescript'],
  theme: 'dark',
  createdAt: new Date('2024-01-01'),
};

const mockSnippets: Snippet[] = [
  {
    id: '1',
    title: 'React Custom Hook - useLocalStorage',
    description: 'A custom React hook for managing localStorage with TypeScript support',
    content: `import { useState, useEffect } from 'react';

function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}

export default useLocalStorage;`,
    language: 'typescript',
    tags: ['react', 'hooks', 'localStorage', 'typescript'],
    visibility: 'public',
    ownerId: '1',
    owner: mockUser,
    collaborators: [],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    views: 245,
    likes: 18,
  },
  {
    id: '2',
    title: 'Python Data Validation Decorator',
    description: 'A decorator for validating function parameters with custom rules',
    content: `from functools import wraps
from typing import Any, Callable, Dict

def validate_params(**validators):
    """Decorator for validating function parameters"""
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Get function signature
            import inspect
            sig = inspect.signature(func)
            bound_args = sig.bind(*args, **kwargs)
            bound_args.apply_defaults()
            
            # Validate each parameter
            for param_name, validator in validators.items():
                if param_name in bound_args.arguments:
                    value = bound_args.arguments[param_name]
                    if not validator(value):
                        raise ValueError(f"Invalid value for {param_name}: {value}")
            
            return func(*args, **kwargs)
        return wrapper
    return decorator

# Example usage
@validate_params(
    age=lambda x: isinstance(x, int) and x >= 0,
    name=lambda x: isinstance(x, str) and len(x) > 0
)
def create_user(name: str, age: int):
    return f"User {name} is {age} years old"`,
    language: 'python',
    tags: ['python', 'decorators', 'validation', 'functions'],
    visibility: 'public',
    ownerId: '1',
    owner: mockUser,
    collaborators: [],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-12'),
    views: 156,
    likes: 12,
  },
  {
    id: '3',
    title: 'JavaScript Debounce Utility',
    description: 'Efficient debounce function for optimizing event handlers',
    content: `/**
 * Creates a debounced function that delays invoking func until after wait milliseconds
 * have elapsed since the last time the debounced function was invoked
 */
function debounce(func, wait, immediate = false) {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(this, args);
    };
    
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func.apply(this, args);
  };
}

// Example usage
const debouncedSearch = debounce((query) => {
  console.log('Searching for:', query);
  // Perform search operation
}, 300);

// Usage in event handlers
document.getElementById('search').addEventListener('input', (e) => {
  debouncedSearch(e.target.value);
});`,
    language: 'javascript',
    tags: ['javascript', 'utils', 'performance', 'events'],
    visibility: 'public',
    ownerId: '1',
    owner: mockUser,
    collaborators: [],
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08'),
    views: 189,
    likes: 15,
  },
];

export const useSnippetStore = create<SnippetState>((set, get) => ({
  snippets: mockSnippets,
  currentSnippet: null,
  isLoading: false,
  filters: {
    query: '',
    language: '',
    tags: [],
    visibility: 'all',
    sortBy: 'newest',
  },

  createSnippet: async (snippetData) => {
    set({ isLoading: true });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newSnippet: Snippet = {
      ...snippetData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      views: 0,
      likes: 0,
    };
    
    set(state => ({
      snippets: [newSnippet, ...state.snippets],
      isLoading: false,
    }));
  },

  updateSnippet: async (id, updates) => {
    set({ isLoading: true });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    set(state => ({
      snippets: state.snippets.map(snippet =>
        snippet.id === id
          ? { ...snippet, ...updates, updatedAt: new Date() }
          : snippet
      ),
      currentSnippet: state.currentSnippet?.id === id
        ? { ...state.currentSnippet, ...updates, updatedAt: new Date() }
        : state.currentSnippet,
      isLoading: false,
    }));
  },

  deleteSnippet: async (id) => {
    set({ isLoading: true });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    set(state => ({
      snippets: state.snippets.filter(snippet => snippet.id !== id),
      currentSnippet: state.currentSnippet?.id === id ? null : state.currentSnippet,
      isLoading: false,
    }));
  },

  setCurrentSnippet: (snippet) => {
    set({ currentSnippet: snippet });
  },

  setFilters: (filters) => {
    set(state => ({
      filters: { ...state.filters, ...filters },
    }));
  },

  fetchSnippets: async () => {
    set({ isLoading: true });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    set({ isLoading: false });
  },
}));