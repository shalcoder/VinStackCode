export const CODE_LANGUAGES: CodeLanguage[] = [
  // Popular Languages
  { id: 'javascript', name: 'JavaScript', extension: '.js', monacoId: 'javascript', color: '#f7df1e', category: 'Web', isPopular: true },
  { id: 'typescript', name: 'TypeScript', extension: '.ts', monacoId: 'typescript', color: '#3178c6', category: 'Web', isPopular: true },
  { id: 'python', name: 'Python', extension: '.py', monacoId: 'python', color: '#3776ab', category: 'General', isPopular: true },
  { id: 'java', name: 'Java', extension: '.java', monacoId: 'java', color: '#ed8b00', category: 'General', isPopular: true },
  { id: 'cpp', name: 'C++', extension: '.cpp', monacoId: 'cpp', color: '#00599c', category: 'Systems', isPopular: true },
  { id: 'react', name: 'React JSX', extension: '.jsx', monacoId: 'javascript', color: '#61dafb', category: 'Web', isPopular: true },
  
  // System Languages
  { id: 'c', name: 'C', extension: '.c', monacoId: 'c', color: '#a8b9cc', category: 'Systems', isPopular: false },
  { id: 'csharp', name: 'C#', extension: '.cs', monacoId: 'csharp', color: '#239120', category: 'General', isPopular: true },
  { id: 'go', name: 'Go', extension: '.go', monacoId: 'go', color: '#00add8', category: 'Systems', isPopular: true },
  { id: 'rust', name: 'Rust', extension: '.rs', monacoId: 'rust', color: '#ce422b', category: 'Systems', isPopular: true },
  
  // Web Languages
  { id: 'php', name: 'PHP', extension: '.php', monacoId: 'php', color: '#777bb4', category: 'Web', isPopular: true },
  { id: 'ruby', name: 'Ruby', extension: '.rb', monacoId: 'ruby', color: '#cc342d', category: 'Web', isPopular: false },
  { id: 'html', name: 'HTML', extension: '.html', monacoId: 'html', color: '#e34f26', category: 'Web', isPopular: true },
  { id: 'css', name: 'CSS', extension: '.css', monacoId: 'css', color: '#1572b6', category: 'Web', isPopular: true },
  { id: 'scss', name: 'SCSS', extension: '.scss', monacoId: 'scss', color: '#cf649a', category: 'Web', isPopular: false },
  { id: 'vue', name: 'Vue', extension: '.vue', monacoId: 'html', color: '#4fc08d', category: 'Web', isPopular: false },
  
  // Mobile Languages
  { id: 'swift', name: 'Swift', extension: '.swift', monacoId: 'swift', color: '#fa7343', category: 'Mobile', isPopular: false },
  { id: 'kotlin', name: 'Kotlin', extension: '.kt', monacoId: 'kotlin', color: '#7f52ff', category: 'Mobile', isPopular: false },
  { id: 'dart', name: 'Dart', extension: '.dart', monacoId: 'dart', color: '#0175c2', category: 'Mobile', isPopular: false },
  
  // Data & Config
  { id: 'sql', name: 'SQL', extension: '.sql', monacoId: 'sql', color: '#336791', category: 'Data', isPopular: true },
  { id: 'json', name: 'JSON', extension: '.json', monacoId: 'json', color: '#000000', category: 'Data', isPopular: true },
  { id: 'yaml', name: 'YAML', extension: '.yml', monacoId: 'yaml', color: '#cb171e', category: 'Data', isPopular: false },
  { id: 'xml', name: 'XML', extension: '.xml', monacoId: 'xml', color: '#0060ac', category: 'Data', isPopular: false },
  { id: 'toml', name: 'TOML', extension: '.toml', monacoId: 'toml', color: '#9c4221', category: 'Data', isPopular: false },
  
  // Documentation
  { id: 'markdown', name: 'Markdown', extension: '.md', monacoId: 'markdown', color: '#083fa1', category: 'Docs', isPopular: true },
  { id: 'latex', name: 'LaTeX', extension: '.tex', monacoId: 'latex', color: '#008080', category: 'Docs', isPopular: false },
  
  // Shell & Scripts
  { id: 'bash', name: 'Bash', extension: '.sh', monacoId: 'shell', color: '#4eaa25', category: 'Scripts', isPopular: true },
  { id: 'powershell', name: 'PowerShell', extension: '.ps1', monacoId: 'powershell', color: '#012456', category: 'Scripts', isPopular: false },
  { id: 'dockerfile', name: 'Dockerfile', extension: 'Dockerfile', monacoId: 'dockerfile', color: '#384d54', category: 'DevOps', isPopular: false },
  
  // Functional Languages
  { id: 'haskell', name: 'Haskell', extension: '.hs', monacoId: 'haskell', color: '#5d4f85', category: 'Functional', isPopular: false },
  { id: 'scala', name: 'Scala', extension: '.scala', monacoId: 'scala', color: '#dc322f', category: 'Functional', isPopular: false },
  { id: 'clojure', name: 'Clojure', extension: '.clj', monacoId: 'clojure', color: '#5881d8', category: 'Functional', isPopular: false },
  { id: 'elixir', name: 'Elixir', extension: '.ex', monacoId: 'elixir', color: '#6e4a7e', category: 'Functional', isPopular: false },
  
  // Other Languages
  { id: 'r', name: 'R', extension: '.r', monacoId: 'r', color: '#198ce7', category: 'Data Science', isPopular: false },
  { id: 'matlab', name: 'MATLAB', extension: '.m', monacoId: 'matlab', color: '#e16737', category: 'Scientific', isPopular: false },
  { id: 'lua', name: 'Lua', extension: '.lua', monacoId: 'lua', color: '#000080', category: 'Scripting', isPopular: false },
  { id: 'perl', name: 'Perl', extension: '.pl', monacoId: 'perl', color: '#0073a1', category: 'Scripting', isPopular: false },
];

export const DEFAULT_SNIPPET_CONTENT = {
  javascript: `// Welcome to VinStackCode!
// Create, share, and collaborate on code snippets

function greet(name) {
  return \`Hello, \${name}! Welcome to collaborative coding.\`;
}

// Example usage
console.log(greet('Developer'));

// Try these features:
// - Real-time collaboration
// - Version history
// - Comments and discussions
// - Advanced search
// - Team management`,
  
  typescript: `// Welcome to VinStackCode!
// Type-safe collaborative coding platform

interface User {
  name: string;
  role: string;
  skills: string[];
}

function greet(user: User): string {
  return \`Hello, \${user.name}! You're a \${user.role}.\`;
}

const developer: User = { 
  name: 'Developer', 
  role: 'Full Stack Engineer',
  skills: ['TypeScript', 'React', 'Node.js']
};

console.log(greet(developer));`,
  
  python: `# Welcome to VinStackCode!
# Collaborative Python development made easy

def greet(name: str, role: str = "Developer") -> str:
    """
    Greet a user with their name and role.
    
    Args:
        name: The user's name
        role: The user's role (default: "Developer")
    
    Returns:
        A personalized greeting message
    """
    return f"Hello, {name}! Welcome to collaborative coding as a {role}."

def main():
    # Example usage
    print(greet("Alice", "Data Scientist"))
    print(greet("Bob"))
    
    # Features you'll love:
    features = [
        "Real-time collaboration",
        "Version control",
        "Code execution",
        "Team management",
        "Advanced search"
    ]
    
    print("\\nVinStackCode Features:")
    for i, feature in enumerate(features, 1):
        print(f"{i}. {feature}")

if __name__ == "__main__":
    main()`,
  
  html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VinStackCode - Collaborative Coding</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .container {
            background: rgba(255, 255, 255, 0.1);
            padding: 30px;
            border-radius: 15px;
            backdrop-filter: blur(10px);
        }
        .feature {
            margin: 15px 0;
            padding: 10px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 8px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Welcome to VinStackCode!</h1>
        <p>The ultimate collaborative code snippet management platform</p>
        
        <h2>✨ Key Features</h2>
        <div class="feature">
            <strong>Real-time Collaboration:</strong> Edit code together with your team
        </div>
        <div class="feature">
            <strong>Version Control:</strong> Track changes and restore previous versions
        </div>
        <div class="feature">
            <strong>Advanced Search:</strong> Find snippets instantly with powerful filters
        </div>
        <div class="feature">
            <strong>Team Management:</strong> Organize your development teams efficiently
        </div>
        
        <h2>🎯 Perfect For</h2>
        <ul>
            <li>Individual developers building their code library</li>
            <li>Teams sharing best practices and standards</li>
            <li>Organizations maintaining knowledge bases</li>
            <li>Students learning and collaborating on projects</li>
        </ul>
    </div>
</body>
</html>`,

  css: `/* Welcome to VinStackCode! */
/* Beautiful, collaborative CSS development */

:root {
  /* Color Palette */
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --accent-color: #f093fb;
  --text-color: #333;
  --bg-color: #f8f9fa;
  
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 2rem;
  --spacing-xl: 3rem;
  
  /* Typography */
  --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'Fira Code', 'Monaco', 'Consolas', monospace;
}

/* Modern Reset */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-primary);
  line-height: 1.6;
  color: var(--text-color);
  background: var(--bg-color);
}

/* Collaborative Coding Card */
.snippet-card {
  background: white;
  border-radius: 12px;
  padding: var(--spacing-lg);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 1px solid #e1e5e9;
}

.snippet-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* Gradient Button */
.btn-primary {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  padding: var(--spacing-sm) var(--spacing-lg);
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

/* Code Block Styling */
.code-block {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: var(--spacing-md);
  border-radius: 8px;
  font-family: var(--font-mono);
  overflow-x: auto;
  border-left: 4px solid var(--primary-color);
}

/* Responsive Grid */
.snippet-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
  margin: var(--spacing-xl) 0;
}

/* Animation */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-in {
  animation: fadeInUp 0.6s ease-out;
}

/* Utility Classes */
.text-center { text-align: center; }
.text-primary { color: var(--primary-color); }
.mb-lg { margin-bottom: var(--spacing-lg); }
.p-md { padding: var(--spacing-md); }

/* Responsive Design */
@media (max-width: 768px) {
  .snippet-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }
  
  .snippet-card {
    padding: var(--spacing-md);
  }
}`,

  react: `import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Welcome to VinStackCode!
// Build amazing React components collaboratively

interface SnippetCardProps {
  title: string;
  description: string;
  language: string;
  author: string;
  likes: number;
  onLike: () => void;
}

const SnippetCard: React.FC<SnippetCardProps> = ({
  title,
  description,
  language,
  author,
  likes,
  onLike
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    onLike();
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-lg shadow-lg p-6 border border-gray-200"
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
          {language}
        </span>
      </div>
      
      <p className="text-gray-600 mb-4">{description}</p>
      
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">by {author}</span>
        
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleLike}
          className={\`flex items-center space-x-2 px-3 py-1 rounded-full transition-colors \${
            isLiked 
              ? 'bg-red-100 text-red-600' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }\`}
        >
          <span>{isLiked ? '❤️' : '🤍'}</span>
          <span>{likeCount}</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

// Example usage component
const SnippetGallery: React.FC = () => {
  const [snippets, setSnippets] = useState([
    {
      id: 1,
      title: "React Custom Hook",
      description: "A powerful custom hook for managing local storage",
      language: "TypeScript",
      author: "Alice Johnson",
      likes: 42
    },
    {
      id: 2,
      title: "API Data Fetcher",
      description: "Reusable component for fetching and displaying API data",
      language: "JavaScript",
      author: "Bob Smith",
      likes: 28
    }
  ]);

  const handleLike = (id: number) => {
    console.log(\`Liked snippet \${id}\`);
    // In real app: update backend, sync with team
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        🚀 VinStackCode Snippets
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {snippets.map(snippet => (
          <SnippetCard
            key={snippet.id}
            title={snippet.title}
            description={snippet.description}
            language={snippet.language}
            author={snippet.author}
            likes={snippet.likes}
            onLike={() => handleLike(snippet.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default SnippetGallery;`,

  sql: `-- Welcome to VinStackCode!
-- Collaborative SQL development and sharing

-- Create a comprehensive database schema for VinStackCode
-- This demonstrates advanced SQL features and best practices

-- Users table with comprehensive profile information
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    profile_picture_url TEXT,
    preferred_languages TEXT[] DEFAULT '{}',
    theme VARCHAR(20) DEFAULT 'dark',
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    
    -- Constraints
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'),
    CONSTRAINT valid_username CHECK (username ~* '^[a-zA-Z0-9_]{3,50}$'),
    CONSTRAINT valid_theme CHECK (theme IN ('dark', 'light'))
);

-- Snippets table with advanced features
CREATE TABLE snippets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    content TEXT NOT NULL,
    language VARCHAR(50) NOT NULL,
    tags TEXT[] DEFAULT '{}',
    visibility VARCHAR(20) DEFAULT 'private',
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    folder_id UUID REFERENCES folders(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    views_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    forks_count INTEGER DEFAULT 0,
    is_archived BOOLEAN DEFAULT false,
    custom_fields JSONB DEFAULT '{}',
    
    -- Full-text search
    search_vector tsvector GENERATED ALWAYS AS (
        to_tsvector('english', title || ' ' || COALESCE(description, '') || ' ' || content)
    ) STORED,
    
    -- Constraints
    CONSTRAINT valid_visibility CHECK (visibility IN ('public', 'private', 'team')),
    CONSTRAINT valid_title_length CHECK (char_length(title) BETWEEN 3 AND 200),
    CONSTRAINT valid_content_length CHECK (char_length(content) <= 50000)
);

-- Advanced query examples for VinStackCode

-- 1. Find popular snippets with full-text search
SELECT 
    s.id,
    s.title,
    s.description,
    s.language,
    s.tags,
    s.likes_count,
    s.views_count,
    u.username as author,
    ts_rank(s.search_vector, plainto_tsquery('react hooks')) as relevance
FROM snippets s
JOIN users u ON s.owner_id = u.id
WHERE s.visibility = 'public'
    AND s.search_vector @@ plainto_tsquery('react hooks')
    AND s.is_archived = false
ORDER BY relevance DESC, s.likes_count DESC
LIMIT 20;

-- 2. Get user statistics with window functions
SELECT 
    u.username,
    u.email,
    COUNT(s.id) as total_snippets,
    COUNT(CASE WHEN s.visibility = 'public' THEN 1 END) as public_snippets,
    SUM(s.views_count) as total_views,
    SUM(s.likes_count) as total_likes,
    AVG(s.likes_count) as avg_likes_per_snippet,
    RANK() OVER (ORDER BY SUM(s.likes_count) DESC) as likes_rank,
    PERCENT_RANK() OVER (ORDER BY COUNT(s.id) DESC) as productivity_percentile
FROM users u
LEFT JOIN snippets s ON u.id = s.owner_id AND s.is_archived = false
WHERE u.is_active = true
GROUP BY u.id, u.username, u.email
HAVING COUNT(s.id) > 0
ORDER BY total_likes DESC;

-- 3. Language popularity analysis with CTEs
WITH language_stats AS (
    SELECT 
        language,
        COUNT(*) as snippet_count,
        AVG(likes_count) as avg_likes,
        SUM(views_count) as total_views,
        COUNT(DISTINCT owner_id) as unique_authors
    FROM snippets 
    WHERE visibility = 'public' 
        AND is_archived = false
        AND created_at >= NOW() - INTERVAL '30 days'
    GROUP BY language
),
ranked_languages AS (
    SELECT 
        *,
        ROW_NUMBER() OVER (ORDER BY snippet_count DESC) as popularity_rank,
        ROUND((snippet_count::DECIMAL / SUM(snippet_count) OVER()) * 100, 2) as market_share
    FROM language_stats
)
SELECT 
    language,
    snippet_count,
    ROUND(avg_likes, 2) as avg_likes,
    total_views,
    unique_authors,
    popularity_rank,
    market_share || '%' as market_share_percent
FROM ranked_languages
WHERE popularity_rank <= 10
ORDER BY popularity_rank;

-- 4. Collaborative activity analysis
SELECT 
    DATE_TRUNC('day', created_at) as date,
    COUNT(*) as daily_snippets,
    COUNT(DISTINCT owner_id) as active_users,
    AVG(char_length(content)) as avg_snippet_length,
    COUNT(*) FILTER (WHERE visibility = 'public') as public_snippets,
    ROUND(
        COUNT(*) FILTER (WHERE visibility = 'public')::DECIMAL / COUNT(*) * 100, 
        2
    ) as public_percentage
FROM snippets
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY date DESC;

-- 5. Performance optimization indexes
CREATE INDEX CONCURRENTLY idx_snippets_search ON snippets USING GIN(search_vector);
CREATE INDEX CONCURRENTLY idx_snippets_owner_visibility ON snippets(owner_id, visibility) WHERE is_archived = false;
CREATE INDEX CONCURRENTLY idx_snippets_language_created ON snippets(language, created_at DESC) WHERE visibility = 'public';
CREATE INDEX CONCURRENTLY idx_snippets_tags ON snippets USING GIN(tags);

-- 6. Materialized view for dashboard analytics
CREATE MATERIALIZED VIEW snippet_analytics AS
SELECT 
    language,
    COUNT(*) as total_count,
    COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') as weekly_count,
    COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') as monthly_count,
    AVG(likes_count) as avg_likes,
    MAX(likes_count) as max_likes,
    COUNT(DISTINCT owner_id) as unique_authors,
    SUM(views_count) as total_views
FROM snippets 
WHERE visibility = 'public' AND is_archived = false
GROUP BY language
ORDER BY total_count DESC;

-- Refresh the materialized view (run periodically)
-- REFRESH MATERIALIZED VIEW CONCURRENTLY snippet_analytics;`,

  json: `{
  "name": "vinstack-code-config",
  "version": "1.0.0",
  "description": "VinStackCode configuration and data examples",
  "author": "VinStackCode Team",
  "license": "MIT",
  
  "application": {
    "name": "VinStackCode",
    "tagline": "Collaborative Code Snippet Management",
    "version": "1.0.0",
    "environment": "production",
    "features": {
      "realTimeCollaboration": true,
      "versionControl": true,
      "advancedSearch": true,
      "teamManagement": true,
      "codeExecution": true,
      "integrations": true
    }
  },
  
  "database": {
    "primary": {
      "type": "postgresql",
      "host": "localhost",
      "port": 5432,
      "database": "vinstack_code",
      "ssl": true,
      "poolSize": 20,
      "connectionTimeout": 30000
    },
    "cache": {
      "type": "redis",
      "host": "localhost",
      "port": 6379,
      "ttl": 3600,
      "maxMemory": "256mb"
    }
  },
  
  "authentication": {
    "providers": ["email", "github", "google", "microsoft"],
    "jwt": {
      "expiresIn": "24h",
      "refreshTokenExpiry": "7d"
    },
    "mfa": {
      "enabled": true,
      "methods": ["totp", "sms", "email"]
    },
    "passwordPolicy": {
      "minLength": 8,
      "requireUppercase": true,
      "requireLowercase": true,
      "requireNumbers": true,
      "requireSpecialChars": true,
      "maxAge": 90
    }
  },
  
  "collaboration": {
    "realTime": {
      "provider": "socket.io",
      "maxConcurrentUsers": 10,
      "syncInterval": 100,
      "conflictResolution": "operational-transformation"
    },
    "comments": {
      "maxDepth": 5,
      "allowMarkdown": true,
      "mentionsEnabled": true,
      "moderationEnabled": false
    },
    "permissions": {
      "levels": ["view", "comment", "edit", "admin"],
      "inheritance": true,
      "teamOverride": true
    }
  },
  
  "codeEditor": {
    "provider": "monaco",
    "themes": ["vs-dark", "vs-light", "high-contrast"],
    "features": {
      "autoComplete": true,
      "syntaxHighlighting": true,
      "errorDetection": true,
      "codeFormatting": true,
      "multipleCursors": true,
      "minimap": true,
      "wordWrap": true
    },
    "languages": [
      "javascript", "typescript", "python", "java", "cpp", "csharp",
      "go", "rust", "php", "ruby", "swift", "kotlin", "html", "css",
      "sql", "json", "yaml", "markdown", "bash"
    ]
  },
  
  "search": {
    "engine": "elasticsearch",
    "features": {
      "fullText": true,
      "fuzzySearch": true,
      "facetedSearch": true,
      "autoComplete": true,
      "searchSuggestions": true
    },
    "indexing": {
      "realTime": true,
      "batchSize": 1000,
      "refreshInterval": "1s"
    },
    "filters": [
      "language", "tags", "author", "dateRange", 
      "visibility", "hasComments", "isArchived"
    ]
  },
  
  "storage": {
    "snippets": {
      "maxSize": "50KB",
      "versioning": {
        "enabled": true,
        "maxVersions": 10,
        "compressionEnabled": true
      }
    },
    "assets": {
      "provider": "aws-s3",
      "bucket": "vinstack-assets",
      "cdn": "cloudfront",
      "maxFileSize": "10MB",
      "allowedTypes": ["image/png", "image/jpeg", "image/gif", "image/webp"]
    }
  },
  
  "integrations": {
    "github": {
      "enabled": true,
      "scopes": ["repo", "user:email"],
      "webhooks": ["push", "pull_request"]
    },
    "gitlab": {
      "enabled": true,
      "scopes": ["read_user", "read_repository"]
    },
    "vscode": {
      "extensionId": "vinstack.code-snippets",
      "features": ["sync", "search", "create", "share"]
    },
    "slack": {
      "enabled": true,
      "notifications": ["mentions", "comments", "shares"]
    }
  },
  
  "pricing": {
    "plans": [
      {
        "id": "free",
        "name": "Free",
        "price": 0,
        "interval": "month",
        "features": {
          "maxSnippets": 10,
          "maxCollaborators": 0,
          "privateSnippets": false,
          "versionHistory": false,
          "teamFeatures": false,
          "prioritySupport": false
        }
      },
      {
        "id": "pro",
        "name": "Pro",
        "price": 9.99,
        "interval": "month",
        "features": {
          "maxSnippets": 500,
          "maxCollaborators": 5,
          "privateSnippets": true,
          "versionHistory": true,
          "teamFeatures": false,
          "prioritySupport": true
        }
      },
      {
        "id": "team",
        "name": "Team",
        "price": 29.99,
        "interval": "month",
        "features": {
          "maxSnippets": -1,
          "maxCollaborators": -1,
          "privateSnippets": true,
          "versionHistory": true,
          "teamFeatures": true,
          "prioritySupport": true
        }
      }
    ]
  },
  
  "monitoring": {
    "metrics": {
      "provider": "datadog",
      "customMetrics": [
        "snippets.created",
        "snippets.viewed",
        "snippets.liked",
        "users.active",
        "collaboration.sessions"
      ]
    },
    "logging": {
      "level": "info",
      "structured": true,
      "retention": "30d"
    },
    "alerts": {
      "errorRate": {
        "threshold": 1,
        "window": "5m"
      },
      "responseTime": {
        "threshold": 2000,
        "window": "5m"
      },
      "uptime": {
        "threshold": 99.9,
        "window": "1h"
      }
    }
  },
  
  "security": {
    "encryption": {
      "algorithm": "AES-256-GCM",
      "keyRotation": "quarterly"
    },
    "rateLimit": {
      "api": "1000/hour",
      "auth": "5/minute",
      "search": "100/minute"
    },
    "cors": {
      "origins": ["https://vinstack.dev", "https://app.vinstack.dev"],
      "credentials": true
    },
    "csp": {
      "defaultSrc": "'self'",
      "scriptSrc": "'self' 'unsafe-inline'",
      "styleSrc": "'self' 'unsafe-inline'",
      "imgSrc": "'self' data: https:"
    }
  },
  
  "deployment": {
    "strategy": "blue-green",
    "environments": ["development", "staging", "production"],
    "ci": {
      "provider": "github-actions",
      "triggers": ["push", "pull_request"],
      "tests": ["unit", "integration", "e2e"],
      "coverage": {
        "threshold": 90
      }
    },
    "infrastructure": {
      "provider": "aws",
      "regions": ["us-east-1", "eu-west-1", "ap-southeast-1"],
      "autoScaling": true,
      "loadBalancer": "application"
    }
  },
  
  "analytics": {
    "provider": "mixpanel",
    "events": [
      "snippet_created",
      "snippet_viewed",
      "snippet_liked",
      "snippet_shared",
      "user_registered",
      "user_upgraded",
      "collaboration_started"
    ],
    "retention": "2y",
    "privacy": {
      "anonymizeIp": true,
      "respectDnt": true,
      "gdprCompliant": true
    }
  }
}`,

  bash: `#!/bin/bash

# VinStackCode - Deployment and Management Scripts
# Welcome to collaborative DevOps!

set -euo pipefail

# Configuration
readonly SCRIPT_DIR="$(cd "$(dirname "\${BASH_SOURCE[0]}")" && pwd)"
readonly PROJECT_NAME="vinstack-code"
readonly DOCKER_IMAGE="vinstack/code-platform"
readonly VERSION="\${VERSION:-latest}"

# Colors for output
readonly RED='\\033[0;31m'
readonly GREEN='\\033[0;32m'
readonly YELLOW='\\033[1;33m'
readonly BLUE='\\033[0;34m'
readonly NC='\\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "\${BLUE}[INFO]\${NC} $1"
}

log_success() {
    echo -e "\${GREEN}[SUCCESS]\${NC} $1"
}

log_warning() {
    echo -e "\${YELLOW}[WARNING]\${NC} $1"
}

log_error() {
    echo -e "\${RED}[ERROR]\${NC} $1" >&2
}

# Check if required tools are installed
check_dependencies() {
    local deps=("docker" "docker-compose" "node" "npm")
    local missing=()
    
    for dep in "\${deps[@]}"; do
        if ! command -v "$dep" &> /dev/null; then
            missing+=("$dep")
        fi
    done
    
    if [[ \${#missing[@]} -gt 0 ]]; then
        log_error "Missing dependencies: \${missing[*]}"
        log_info "Please install the missing dependencies and try again."
        exit 1
    fi
    
    log_success "All dependencies are installed"
}

# Setup development environment
setup_dev() {
    log_info "Setting up VinStackCode development environment..."
    
    # Create necessary directories
    mkdir -p {logs,data,backups,uploads}
    
    # Copy environment file if it doesn't exist
    if [[ ! -f .env ]]; then
        if [[ -f .env.example ]]; then
            cp .env.example .env
            log_warning "Created .env from .env.example. Please update with your values."
        else
            log_error ".env.example not found. Please create .env manually."
            exit 1
        fi
    fi
    
    # Install dependencies
    log_info "Installing Node.js dependencies..."
    npm install
    
    # Setup database
    setup_database
    
    log_success "Development environment setup complete!"
    log_info "Run 'npm run dev' to start the development server"
}

# Database setup and migrations
setup_database() {
    log_info "Setting up database..."
    
    # Check if PostgreSQL is running
    if ! pg_isready -h localhost -p 5432 &> /dev/null; then
        log_warning "PostgreSQL is not running. Starting with Docker..."
        docker-compose up -d postgres redis
        
        # Wait for database to be ready
        local retries=30
        while ! pg_isready -h localhost -p 5432 &> /dev/null && [[ $retries -gt 0 ]]; do
            log_info "Waiting for database to be ready... ($retries retries left)"
            sleep 2
            ((retries--))
        done
        
        if [[ $retries -eq 0 ]]; then
            log_error "Database failed to start"
            exit 1
        fi
    fi
    
    # Run migrations
    log_info "Running database migrations..."
    npm run db:migrate
    
    # Seed development data
    if [[ "\${NODE_ENV:-development}" == "development" ]]; then
        log_info "Seeding development data..."
        npm run db:seed
    fi
    
    log_success "Database setup complete"
}

# Build application
build_app() {
    log_info "Building VinStackCode application..."
    
    # Clean previous builds
    rm -rf dist build
    
    # Build frontend
    log_info "Building frontend..."
    npm run build
    
    # Build Docker image
    log_info "Building Docker image..."
    docker build -t "\${DOCKER_IMAGE}:\${VERSION}" .
    docker tag "\${DOCKER_IMAGE}:\${VERSION}" "\${DOCKER_IMAGE}:latest"
    
    log_success "Application build complete"
}

# Deploy application
deploy() {
    local environment="\${1:-staging}"
    
    log_info "Deploying VinStackCode to $environment..."
    
    case "$environment" in
        "staging")
            deploy_staging
            ;;
        "production")
            deploy_production
            ;;
        *)
            log_error "Unknown environment: $environment"
            log_info "Available environments: staging, production"
            exit 1
            ;;
    esac
}

# Deploy to staging
deploy_staging() {
    log_info "Deploying to staging environment..."
    
    # Build application
    build_app
    
    # Deploy with docker-compose
    docker-compose -f docker-compose.staging.yml up -d
    
    # Run health checks
    health_check "http://localhost:3000"
    
    log_success "Staging deployment complete"
}

# Deploy to production
deploy_production() {
    log_info "Deploying to production environment..."
    
    # Confirmation prompt
    read -p "Are you sure you want to deploy to production? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "Production deployment cancelled"
        exit 0
    fi
    
    # Create backup
    backup_database
    
    # Build and push image
    build_app
    docker push "\${DOCKER_IMAGE}:\${VERSION}"
    
    # Deploy using blue-green strategy
    blue_green_deploy
    
    log_success "Production deployment complete"
}

# Blue-green deployment
blue_green_deploy() {
    log_info "Performing blue-green deployment..."
    
    # Determine current and new environments
    local current_env
    current_env=$(docker-compose -f docker-compose.prod.yml ps --services --filter "status=running" | grep -E "(blue|green)" | head -1)
    local new_env
    
    if [[ "$current_env" == "blue" ]]; then
        new_env="green"
    else
        new_env="blue"
    fi
    
    log_info "Current environment: $current_env, deploying to: $new_env"
    
    # Deploy to new environment
    docker-compose -f docker-compose.prod.yml up -d "$new_env"
    
    # Health check
    local new_port
    if [[ "$new_env" == "blue" ]]; then
        new_port=3001
    else
        new_port=3002
    fi
    
    health_check "http://localhost:$new_port"
    
    # Switch traffic
    log_info "Switching traffic to $new_env environment..."
    # Update load balancer configuration here
    
    # Stop old environment
    if [[ -n "$current_env" ]]; then
        log_info "Stopping $current_env environment..."
        docker-compose -f docker-compose.prod.yml stop "$current_env"
    fi
    
    log_success "Blue-green deployment complete"
}

# Health check
health_check() {
    local url="$1"
    local max_attempts=30
    local attempt=1
    
    log_info "Performing health check on $url..."
    
    while [[ $attempt -le $max_attempts ]]; do
        if curl -f -s "$url/health" > /dev/null; then
            log_success "Health check passed"
            return 0
        fi
        
        log_info "Health check attempt $attempt/$max_attempts failed, retrying..."
        sleep 5
        ((attempt++))
    done
    
    log_error "Health check failed after $max_attempts attempts"
    return 1
}

# Backup database
backup_database() {
    local timestamp
    timestamp=$(date +"%Y%m%d_%H%M%S")
    local backup_file="backups/vinstack_backup_$timestamp.sql"
    
    log_info "Creating database backup: $backup_file"
    
    pg_dump -h localhost -U postgres -d vinstack_code > "$backup_file"
    
    # Compress backup
    gzip "$backup_file"
    
    # Keep only last 10 backups
    find backups/ -name "vinstack_backup_*.sql.gz" -type f | sort -r | tail -n +11 | xargs rm -f
    
    log_success "Database backup created: $backup_file.gz"
}

# Restore database from backup
restore_database() {
    local backup_file="$1"
    
    if [[ -z "$backup_file" ]]; then
        log_error "Please specify a backup file"
        log_info "Available backups:"
        ls -la backups/vinstack_backup_*.sql.gz 2>/dev/null || log_info "No backups found"
        exit 1
    fi
    
    if [[ ! -f "$backup_file" ]]; then
        log_error "Backup file not found: $backup_file"
        exit 1
    fi
    
    log_warning "This will overwrite the current database!"
    read -p "Are you sure you want to restore from $backup_file? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "Database restore cancelled"
        exit 0
    fi
    
    log_info "Restoring database from $backup_file..."
    
    # Drop and recreate database
    dropdb -h localhost -U postgres vinstack_code --if-exists
    createdb -h localhost -U postgres vinstack_code
    
    # Restore from backup
    if [[ "$backup_file" == *.gz ]]; then
        gunzip -c "$backup_file" | psql -h localhost -U postgres -d vinstack_code
    else
        psql -h localhost -U postgres -d vinstack_code < "$backup_file"
    fi
    
    log_success "Database restored from $backup_file"
}

# Monitor application
monitor() {
    log_info "Monitoring VinStackCode application..."
    
    # Show running containers
    echo "=== Running Containers ==="
    docker-compose ps
    echo
    
    # Show logs
    echo "=== Recent Logs ==="
    docker-compose logs --tail=50 --follow
}

# Cleanup old resources
cleanup() {
    log_info "Cleaning up old resources..."
    
    # Remove old Docker images
    docker image prune -f
    
    # Remove old backups (older than 30 days)
    find backups/ -name "vinstack_backup_*.sql.gz" -type f -mtime +30 -delete
    
    # Clean npm cache
    npm cache clean --force
    
    log_success "Cleanup complete"
}

# Show usage information
usage() {
    cat << EOF
VinStackCode Management Script

Usage: $0 <command> [options]

Commands:
    setup           Setup development environment
    build           Build application
    deploy <env>    Deploy to environment (staging|production)
    backup          Create database backup
    restore <file>  Restore database from backup
    monitor         Monitor application
    cleanup         Cleanup old resources
    help            Show this help message

Examples:
    $0 setup                                    # Setup development environment
    $0 build                                    # Build application
    $0 deploy staging                           # Deploy to staging
    $0 deploy production                        # Deploy to production
    $0 backup                                   # Create database backup
    $0 restore backups/vinstack_backup_20240115_143022.sql.gz
    $0 monitor                                  # Monitor application
    $0 cleanup                                  # Cleanup old resources

Environment Variables:
    VERSION         Application version (default: latest)
    NODE_ENV        Node environment (development|staging|production)

EOF
}

# Main function
main() {
    local command="\${1:-}"
    
    case "$command" in
        "setup")
            check_dependencies
            setup_dev
            ;;
        "build")
            build_app
            ;;
        "deploy")
            deploy "\${2:-staging}"
            ;;
        "backup")
            backup_database
            ;;
        "restore")
            restore_database "\${2:-}"
            ;;
        "monitor")
            monitor
            ;;
        "cleanup")
            cleanup
            ;;
        "help"|"--help"|"-h")
            usage
            ;;
        "")
            log_error "No command specified"
            usage
            exit 1
            ;;
        *)
            log_error "Unknown command: $command"
            usage
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"`
};

export const POPULAR_TAGS = [
  // Programming Concepts
  'algorithm', 'data-structure', 'design-pattern', 'best-practices', 'performance',
  'optimization', 'debugging', 'testing', 'security', 'authentication',
  
  // Web Development
  'frontend', 'backend', 'fullstack', 'api', 'rest', 'graphql', 'websocket',
  'responsive', 'pwa', 'spa', 'ssr', 'seo', 'accessibility',
  
  // Frameworks & Libraries
  'react', 'vue', 'angular', 'svelte', 'next', 'nuxt', 'gatsby',
  'express', 'fastify', 'koa', 'nestjs', 'django', 'flask', 'rails',
  'spring', 'laravel', 'symfony', 'asp-net',
  
  // Database & Storage
  'database', 'sql', 'nosql', 'mongodb', 'postgresql', 'mysql', 'redis',
  'elasticsearch', 'orm', 'migration', 'indexing', 'query-optimization',
  
  // DevOps & Infrastructure
  'devops', 'docker', 'kubernetes', 'ci-cd', 'deployment', 'monitoring',
  'logging', 'backup', 'scaling', 'load-balancing', 'microservices',
  
  // Cloud & Services
  'aws', 'azure', 'gcp', 'serverless', 'lambda', 'cloud-functions',
  'cdn', 'storage', 'messaging', 'queue', 'cache',
  
  // Mobile Development
  'mobile', 'ios', 'android', 'react-native', 'flutter', 'ionic',
  'cordova', 'xamarin', 'native',
  
  // Data & Analytics
  'data-science', 'machine-learning', 'ai', 'analytics', 'visualization',
  'etl', 'big-data', 'streaming', 'real-time',
  
  // Tools & Utilities
  'utils', 'helper', 'library', 'plugin', 'extension', 'cli', 'automation',
  'scripting', 'configuration', 'environment',
  
  // Specific Technologies
  'typescript', 'javascript', 'python', 'java', 'go', 'rust', 'cpp',
  'csharp', 'php', 'ruby', 'swift', 'kotlin', 'dart',
  
  // Development Practices
  'agile', 'scrum', 'tdd', 'bdd', 'code-review', 'refactoring',
  'documentation', 'version-control', 'git', 'collaboration'
];

export const SNIPPET_CATEGORIES = [
  { id: 'web', name: 'Web Development', icon: '🌐', color: '#3b82f6' },
  { id: 'mobile', name: 'Mobile Development', icon: '📱', color: '#10b981' },
  { id: 'backend', name: 'Backend & APIs', icon: '⚙️', color: '#8b5cf6' },
  { id: 'database', name: 'Database & Storage', icon: '🗄️', color: '#f59e0b' },
  { id: 'devops', name: 'DevOps & Infrastructure', icon: '🚀', color: '#ef4444' },
  { id: 'data-science', name: 'Data Science & ML', icon: '📊', color: '#06b6d4' },
  { id: 'algorithms', name: 'Algorithms & DS', icon: '🧮', color: '#84cc16' },
  { id: 'utilities', name: 'Utilities & Tools', icon: '🔧', color: '#6b7280' },
  { id: 'ui-ux', name: 'UI/UX Components', icon: '🎨', color: '#ec4899' },
  { id: 'security', name: 'Security & Auth', icon: '🔒', color: '#dc2626' },
];

export const EDITOR_THEMES = [
  { id: 'vs-dark', name: 'Dark (VS Code)', type: 'dark' },
  { id: 'vs-light', name: 'Light (VS Code)', type: 'light' },
  { id: 'hc-black', name: 'High Contrast Dark', type: 'dark' },
  { id: 'hc-light', name: 'High Contrast Light', type: 'light' },
];

export const KEYBOARD_SHORTCUTS = {
  global: {
    'Ctrl+K': 'Open command palette',
    'Ctrl+/': 'Toggle search',
    'Ctrl+N': 'Create new snippet',
    'Ctrl+Shift+N': 'Create new folder',
    'Ctrl+B': 'Toggle sidebar',
    'Ctrl+Shift+P': 'Open settings',
    'Esc': 'Close modal/cancel',
  },
  editor: {
    'Ctrl+S': 'Save snippet',
    'Ctrl+Z': 'Undo',
    'Ctrl+Y': 'Redo',
    'Ctrl+F': 'Find in code',
    'Ctrl+H': 'Find and replace',
    'Ctrl+D': 'Select next occurrence',
    'Ctrl+Shift+L': 'Select all occurrences',
    'Alt+Up/Down': 'Move line up/down',
    'Shift+Alt+Up/Down': 'Copy line up/down',
    'Ctrl+/': 'Toggle line comment',
    'Shift+Alt+A': 'Toggle block comment',
    'Ctrl+Shift+K': 'Delete line',
    'Ctrl+Enter': 'Insert line below',
    'Ctrl+Shift+Enter': 'Insert line above',
  },
  snippetList: {
    'Enter': 'Open selected snippet',
    'Space': 'Preview snippet',
    'Delete': 'Delete snippet',
    'F2': 'Rename snippet',
    'Ctrl+C': 'Copy snippet',
    'Ctrl+V': 'Paste snippet',
    'Ctrl+A': 'Select all snippets',
  },
};

export const FILE_EXTENSIONS = {
  javascript: ['.js', '.mjs', '.cjs'],
  typescript: ['.ts', '.tsx', '.mts', '.cts'],
  python: ['.py', '.pyw', '.pyi'],
  java: ['.java'],
  cpp: ['.cpp', '.cc', '.cxx', '.c++'],
  c: ['.c', '.h'],
  csharp: ['.cs'],
  go: ['.go'],
  rust: ['.rs'],
  php: ['.php', '.phtml'],
  ruby: ['.rb', '.rbw'],
  swift: ['.swift'],
  kotlin: ['.kt', '.kts'],
  html: ['.html', '.htm'],
  css: ['.css'],
  scss: ['.scss', '.sass'],
  sql: ['.sql'],
  json: ['.json'],
  yaml: ['.yml', '.yaml'],
  xml: ['.xml'],
  markdown: ['.md', '.markdown'],
  bash: ['.sh', '.bash', '.zsh'],
  powershell: ['.ps1', '.psm1'],
  dockerfile: ['Dockerfile', '.dockerfile'],
};

export const COLLABORATION_COLORS = [
  '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57',
  '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43',
  '#10ac84', '#ee5a24', '#0abde3', '#3867d6', '#8854d0',
];

export const NOTIFICATION_TYPES = {
  COMMENT: { icon: '💬', color: '#3b82f6' },
  MENTION: { icon: '@', color: '#10b981' },
  LIKE: { icon: '❤️', color: '#ef4444' },
  FORK: { icon: '🍴', color: '#8b5cf6' },
  COLLABORATION: { icon: '👥', color: '#f59e0b' },
  SYSTEM: { icon: '⚙️', color: '#6b7280' },
  SECURITY: { icon: '🔒', color: '#dc2626' },
  UPDATE: { icon: '🔄', color: '#06b6d4' },
};

export const PLAN_LIMITS = {
  free: {
    maxSnippets: 10,
    maxCollaborators: 0,
    maxFileSize: 1024 * 50, // 50KB
    versionHistory: false,
    privateSnippets: false,
    teamFeatures: false,
    prioritySupport: false,
    apiAccess: false,
    advancedSearch: false,
    customThemes: false,
  },
  pro: {
    maxSnippets: 500,
    maxCollaborators: 5,
    maxFileSize: 1024 * 100, // 100KB
    versionHistory: true,
    privateSnippets: true,
    teamFeatures: false,
    prioritySupport: true,
    apiAccess: true,
    advancedSearch: true,
    customThemes: true,
  },
  team: {
    maxSnippets: -1, // Unlimited
    maxCollaborators: -1, // Unlimited
    maxFileSize: 1024 * 200, // 200KB
    versionHistory: true,
    privateSnippets: true,
    teamFeatures: true,
    prioritySupport: true,
    apiAccess: true,
    advancedSearch: true,
    customThemes: true,
  },
};

export const API_ENDPOINTS = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    logout: '/api/auth/logout',
    refresh: '/api/auth/refresh',
    profile: '/api/auth/profile',
    forgotPassword: '/api/auth/forgot-password',
    resetPassword: '/api/auth/reset-password',
  },
  snippets: {
    list: '/api/snippets',
    create: '/api/snippets',
    get: '/api/snippets/:id',
    update: '/api/snippets/:id',
    delete: '/api/snippets/:id',
    fork: '/api/snippets/:id/fork',
    like: '/api/snippets/:id/like',
    search: '/api/snippets/search',
    versions: '/api/snippets/:id/versions',
  },
  collaboration: {
    comments: '/api/snippets/:id/comments',
    collaborators: '/api/snippets/:id/collaborators',
    permissions: '/api/snippets/:id/permissions',
  },
  teams: {
    list: '/api/teams',
    create: '/api/teams',
    get: '/api/teams/:id',
    update: '/api/teams/:id',
    delete: '/api/teams/:id',
    members: '/api/teams/:id/members',
  },
  integrations: {
    list: '/api/integrations',
    create: '/api/integrations',
    update: '/api/integrations/:id',
    delete: '/api/integrations/:id',
    sync: '/api/integrations/:id/sync',
  },
};