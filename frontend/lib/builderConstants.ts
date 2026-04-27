export const defaultSettings = {
  font: 'inter',
  fontStyle: 'Inter, sans-serif',
  theme: 'premium-indigo',
  colors: {
    id: 'premium-indigo',
    label: 'Indigo Royale',
    primary: '#4f46e5',
    bg: '#ffffff',
    text: '#1e1e2e',
    gradient: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)'
  },
  spacing: 'normal',
  spacingValue: '16px',
  radius: 'medium',
  radiusValue: '12px',
  columns: 3,
};

export const initialMockPosts = [
  {
    id: 1,
    title: 'Getting Started with React',
    excerpt: 'Learn the fundamentals of React and start building amazing web applications.',
    author: 'John Doe',
    date: '2024-02-10',
    image: 'https://picsum.photos/400/250?random=1',
    category: 'Development'
  },
  {
    id: 2,
    title: 'Advanced CSS Techniques',
    excerpt: 'Master modern CSS features and create stunning designs with ease.',
    author: 'Jane Smith',
    date: '2024-02-12',
    image: 'https://picsum.photos/400/250?random=2',
    category: 'Design'
  },
  {
    id: 3,
    title: 'JavaScript ES2024 Features',
    excerpt: 'Explore the latest features in JavaScript and how to use them effectively.',
    author: 'Mike Johnson',
    date: '2024-02-13',
    image: 'https://picsum.photos/400/250?random=3',
    category: 'Development'
  }
];

export const cmsFieldConfig = {
  post: ['Title', 'Excerpt', 'Content', 'Featured Image', 'Category', 'Tags'],
  author: ['Name', 'Bio', 'Avatar', 'Social Links'],
  seo: ['Meta Title', 'Meta Description', 'Keywords', 'OG Image']
};
