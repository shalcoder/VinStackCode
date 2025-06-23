/*
  # Setup Demo User and Sample Data

  1. Demo User Setup
    - Creates a demo user account for testing
    - Sets up profile with sample data
    - Creates sample snippets for demonstration

  2. Sample Data
    - Creates various code snippets in different languages
    - Sets up proper visibility and tags
    - Demonstrates platform capabilities
*/

-- Insert demo user profile (this will be created after auth user is created)
-- The actual auth user creation needs to be done through Supabase Auth API

-- Create some sample public snippets for demonstration
-- These will be owned by the demo user once they sign up

-- Function to create demo data after user signup
CREATE OR REPLACE FUNCTION create_demo_data_for_user(user_id uuid, user_email text)
RETURNS void AS $$
BEGIN
  -- Create demo snippets
  INSERT INTO snippets (title, description, content, language, tags, visibility, owner_id) VALUES
  (
    'React Custom Hook - useLocalStorage',
    'A reusable React hook for managing localStorage with TypeScript support',
    'import { useState, useEffect } from ''react'';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState''s setter function that persists the new value to localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
}',
    'typescript',
    ARRAY['react', 'hooks', 'typescript', 'localstorage', 'custom-hook'],
    'public',
    user_id
  ),
  (
    'Python Data Analysis Helper',
    'Utility functions for common data analysis tasks with pandas',
    'import pandas as pd
import numpy as np
from typing import List, Dict, Any

def clean_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    """
    Clean a dataframe by removing duplicates and handling missing values
    """
    # Remove duplicates
    df_clean = df.drop_duplicates()
    
    # Handle missing values
    numeric_columns = df_clean.select_dtypes(include=[np.number]).columns
    categorical_columns = df_clean.select_dtypes(include=[''object'']).columns
    
    # Fill numeric columns with median
    df_clean[numeric_columns] = df_clean[numeric_columns].fillna(
        df_clean[numeric_columns].median()
    )
    
    # Fill categorical columns with mode
    for col in categorical_columns:
        mode_value = df_clean[col].mode()
        if not mode_value.empty:
            df_clean[col] = df_clean[col].fillna(mode_value[0])
    
    return df_clean

def get_summary_stats(df: pd.DataFrame) -> Dict[str, Any]:
    """
    Get comprehensive summary statistics for a dataframe
    """
    return {
        ''shape'': df.shape,
        ''missing_values'': df.isnull().sum().to_dict(),
        ''data_types'': df.dtypes.to_dict(),
        ''numeric_summary'': df.describe().to_dict(),
        ''memory_usage'': df.memory_usage(deep=True).sum()
    }',
    'python',
    ARRAY['python', 'pandas', 'data-analysis', 'data-science', 'utilities'],
    'public',
    user_id
  ),
  (
    'JavaScript Debounce Function',
    'A utility function to debounce function calls for performance optimization',
    'function debounce(func, wait, immediate = false) {
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

// TypeScript version
function debounceTS<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate: boolean = false
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    
    const callNow = immediate && !timeout;
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func(...args);
  };
}

// Usage examples
const debouncedSearch = debounce((query) => {
  console.log(''Searching for:'', query);
}, 300);

const debouncedResize = debounce(() => {
  console.log(''Window resized'');
}, 100);',
    'javascript',
    ARRAY['javascript', 'typescript', 'performance', 'utilities', 'debounce'],
    'public',
    user_id
  ),
  (
    'CSS Grid Layout System',
    'A flexible CSS Grid system for responsive layouts',
    '.grid-container {
  display: grid;
  gap: 1rem;
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

/* Auto-fit columns with minimum width */
.grid-auto-fit {
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

/* Auto-fill columns */
.grid-auto-fill {
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}

/* Explicit grid areas */
.grid-layout {
  grid-template-areas:
    "header header header"
    "sidebar main aside"
    "footer footer footer";
  grid-template-rows: auto 1fr auto;
  grid-template-columns: 200px 1fr 200px;
  min-height: 100vh;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.aside { grid-area: aside; }
.footer { grid-area: footer; }

/* Responsive grid */
@media (max-width: 768px) {
  .grid-layout {
    grid-template-areas:
      "header"
      "main"
      "sidebar"
      "aside"
      "footer";
    grid-template-columns: 1fr;
  }
}

/* Grid item utilities */
.span-2 { grid-column: span 2; }
.span-3 { grid-column: span 3; }
.span-full { grid-column: 1 / -1; }

.row-span-2 { grid-row: span 2; }
.row-span-3 { grid-row: span 3; }

/* Alignment utilities */
.justify-center { justify-self: center; }
.justify-end { justify-self: end; }
.align-center { align-self: center; }
.align-end { align-self: end; }',
    'css',
    ARRAY['css', 'grid', 'layout', 'responsive', 'frontend'],
    'public',
    user_id
  ),
  (
    'SQL Query Optimization Tips',
    'Common SQL optimization techniques and best practices',
    '-- Index optimization
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_orders_user_date ON orders(user_id, created_at);
CREATE INDEX idx_products_category_price ON products(category_id, price);

-- Composite index for multi-column queries
CREATE INDEX idx_user_orders_composite ON orders(user_id, status, created_at);

-- Partial index for specific conditions
CREATE INDEX idx_active_users ON users(email) WHERE is_active = true;

-- Query optimization examples

-- Bad: Using functions in WHERE clause
SELECT * FROM orders 
WHERE YEAR(created_at) = 2024;

-- Good: Use date ranges instead
SELECT * FROM orders 
WHERE created_at >= ''2024-01-01'' 
  AND created_at < ''2025-01-01'';

-- Bad: SELECT *
SELECT * FROM users u
JOIN orders o ON u.id = o.user_id;

-- Good: Select only needed columns
SELECT u.name, u.email, o.total, o.created_at
FROM users u
JOIN orders o ON u.id = o.user_id;

-- Use EXISTS instead of IN for better performance
-- Bad:
SELECT * FROM users 
WHERE id IN (SELECT user_id FROM orders WHERE total > 100);

-- Good:
SELECT * FROM users u
WHERE EXISTS (
  SELECT 1 FROM orders o 
  WHERE o.user_id = u.id AND o.total > 100
);

-- Window functions for analytics
SELECT 
  user_id,
  order_date,
  total,
  SUM(total) OVER (PARTITION BY user_id ORDER BY order_date) as running_total,
  ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY order_date DESC) as order_rank,
  LAG(total) OVER (PARTITION BY user_id ORDER BY order_date) as previous_order_total
FROM orders;

-- Common Table Expressions (CTEs) for complex queries
WITH monthly_sales AS (
  SELECT 
    DATE_TRUNC(''month'', order_date) as month,
    SUM(total) as monthly_total,
    COUNT(*) as order_count
  FROM orders
  GROUP BY DATE_TRUNC(''month'', order_date)
),
sales_growth AS (
  SELECT 
    month,
    monthly_total,
    LAG(monthly_total) OVER (ORDER BY month) as previous_month,
    ROUND(
      ((monthly_total - LAG(monthly_total) OVER (ORDER BY month)) / 
       LAG(monthly_total) OVER (ORDER BY month)) * 100, 2
    ) as growth_percentage
  FROM monthly_sales
)
SELECT * FROM sales_growth
WHERE growth_percentage IS NOT NULL
ORDER BY month;',
    'sql',
    ARRAY['sql', 'optimization', 'performance', 'database', 'indexing'],
    'public',
    user_id
  );

  -- Create a sample folder
  INSERT INTO folders (name, description, owner_id, is_public) VALUES
  ('Web Development', 'Frontend and backend web development snippets', user_id, true);

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Create profile
  INSERT INTO profiles (id, username, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  
  -- Create subscription
  INSERT INTO subscriptions (user_id, plan, status)
  VALUES (NEW.id, 'free', 'active');
  
  -- Create demo data if this is the demo user
  IF NEW.email = 'developer@vinstack.com' THEN
    PERFORM create_demo_data_for_user(NEW.id, NEW.email);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();