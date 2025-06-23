export const CODE_LANGUAGES: { id: string; name: string; extension: string; monacoId: string; color: string }[] = [
  { id: 'javascript', name: 'JavaScript', extension: '.js', monacoId: 'javascript', color: '#f7df1e' },
  { id: 'typescript', name: 'TypeScript', extension: '.ts', monacoId: 'typescript', color: '#3178c6' },
  { id: 'python', name: 'Python', extension: '.py', monacoId: 'python', color: '#3776ab' },
  { id: 'java', name: 'Java', extension: '.java', monacoId: 'java', color: '#ed8b00' },
  { id: 'cpp', name: 'C++', extension: '.cpp', monacoId: 'cpp', color: '#00599c' },
  { id: 'c', name: 'C', extension: '.c', monacoId: 'c', color: '#a8b9cc' },
  { id: 'csharp', name: 'C#', extension: '.cs', monacoId: 'csharp', color: '#239120' },
  { id: 'go', name: 'Go', extension: '.go', monacoId: 'go', color: '#00add8' },
  { id: 'rust', name: 'Rust', extension: '.rs', monacoId: 'rust', color: '#ce422b' },
  { id: 'php', name: 'PHP', extension: '.php', monacoId: 'php', color: '#777bb4' },
  { id: 'ruby', name: 'Ruby', extension: '.rb', monacoId: 'ruby', color: '#cc342d' },
  { id: 'swift', name: 'Swift', extension: '.swift', monacoId: 'swift', color: '#fa7343' },
  { id: 'kotlin', name: 'Kotlin', extension: '.kt', monacoId: 'kotlin', color: '#7f52ff' },
  { id: 'html', name: 'HTML', extension: '.html', monacoId: 'html', color: '#e34f26' },
  { id: 'css', name: 'CSS', extension: '.css', monacoId: 'css', color: '#1572b6' },
  { id: 'sql', name: 'SQL', extension: '.sql', monacoId: 'sql', color: '#336791' },
  { id: 'json', name: 'JSON', extension: '.json', monacoId: 'json', color: '#000000' },
  { id: 'yaml', name: 'YAML', extension: '.yml', monacoId: 'yaml', color: '#cb171e' },
  { id: 'markdown', name: 'Markdown', extension: '.md', monacoId: 'markdown', color: '#083fa1' },
  { id: 'bash', name: 'Bash', extension: '.sh', monacoId: 'bash', color: '#4eaa25' },
];

export const DEFAULT_SNIPPET_CONTENT = {
  javascript: `// Welcome to VinStackCode!
function greet(name) {
  return \`Hello, \${name}! Welcome to collaborative coding.\`;
}

console.log(greet('Developer'));`,
  
  typescript: `// Welcome to VinStackCode!
interface User {
  name: string;
  role: string;
}

function greet(user: User): string {
  return \`Hello, \${user.name}! You're a \${user.role}.\`;
}

const developer: User = { name: 'Developer', role: 'Coder' };
console.log(greet(developer));`,
  
  python: `# Welcome to VinStackCode!
def greet(name):
    return f"Hello, {name}! Welcome to collaborative coding."

def main():
    print(greet("Developer"))

if __name__ == "__main__":
    main()`,
  
  html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VinStackCode</title>
</head>
<body>
    <h1>Welcome to VinStackCode!</h1>
    <p>Collaborative code snippet management platform.</p>
</body>
</html>`,
};

export const POPULAR_TAGS = [
  'algorithm',
  'data-structure',
  'api',
  'frontend',
  'backend',
  'database',
  'auth',
  'testing',
  'utils',
  'hooks',
  'components',
  'performance',
  'security',
  'deployment',
  'devops',
];