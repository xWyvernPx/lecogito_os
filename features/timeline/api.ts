import { NodeData, Connection } from './types';

// Initial Data moved here
let MOCK_NODES: NodeData[] = [
  { 
      id: 1, 
      title: 'The Awakening', 
      year: '2019', 
      boardX: 100, boardY: 100,
      lat: 10.762622, lng: 106.660172, 
      color: '#ef4444', 
      note: 'Subject discovers React.js.', 
      description: 'Subject made initial contact with the "React" entity. Observed rapid consumption of documentation and tutorials. Initial prototypes were unstable but showed promise.',
      fullDate: '14 OCT 2019',
      location: 'Ho Chi Minh City, VN',
      status: 'DECLASSIFIED',
      images: [
          { url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=400&auto=format&fit=crop', caption: 'Initial React Experiment', isHighlight: true },
          { url: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=400&auto=format&fit=crop', caption: 'Workspace Setup' }
      ]
  },
  { 
      id: 2, 
      title: 'First Gig', 
      year: '2020', 
      boardX: 400, boardY: 150,
      lat: 16.0544, lng: 108.2022, 
      color: '#3b82f6', 
      note: 'Freelance operation.', 
      description: 'Subject accepted a contract for a local bakery website. First exchange of code for currency. The "Imposter Syndrome" effect was detected at high levels.',
      fullDate: '02 FEB 2020',
      location: 'Remote Uplink (VN)',
      status: 'SOLVED',
      images: [
          { url: 'https://images.unsplash.com/photo-1517292987719-0369a794ec0f?q=80&w=400&auto=format&fit=crop', caption: 'The Bakery Site', isHighlight: true }
      ]
  },
  { 
      id: 3, 
      title: 'The Monolith', 
      year: '2021', 
      boardX: 150, boardY: 400,
      lat: 37.5665, lng: 126.9780, 
      color: '#10b981', 
      note: 'Infiltration of Hanbiro HQ.', 
      description: 'Subject infiltrated Hanbiro Corporation. Assignment: Maintain and modernize a 10-year-old Java legacy codebase. Hostile environment detected (Spaghetti Code).',
      fullDate: '15 JUN 2021',
      location: 'Seoul, South Korea',
      status: 'DECLASSIFIED',
      images: [
          { url: 'https://images.unsplash.com/photo-1593642632823-8f78536709c7?q=80&w=400&auto=format&fit=crop', caption: 'Legacy Servers', isHighlight: true },
          { url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=400&auto=format&fit=crop', caption: 'Debugging Session' }
      ]
  },
  { 
      id: 4, 
      title: 'Microservices', 
      year: '2022', 
      boardX: 500, boardY: 350,
      lat: 37.4, lng: 127.1, 
      color: '#f59e0b', 
      note: 'The Great Decoupling.', 
      description: 'Subject successfully decoupled the auth module from the monolith. System stability increased by 40%. The "Docker" artifact was utilized heavily.',
      fullDate: '10 MAR 2022',
      location: 'Server Room B',
      status: 'SOLVED',
      images: []
  },
  { 
      id: 5, 
      title: 'Netcompany', 
      year: '2023', 
      boardX: 800, boardY: 200,
      lat: 10.7769, lng: 106.7009, 
      color: '#8b5cf6', 
      note: 'Deep cover sector.', 
      description: 'Agent deployed to corporate sector (Netcompany). Currently engaged in the SCOT project. Handling supply chain logic for Roche. Complexity level: Extreme.',
      fullDate: '01 JAN 2023',
      location: 'Ho Chi Minh City',
      status: 'ONGOING',
      images: [
          { url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400&auto=format&fit=crop', caption: 'Corporate HQ', isHighlight: true },
          { url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=400&auto=format&fit=crop', caption: 'Team Meeting' }
      ]
  },
  { 
    id: 7, 
    title: 'Operation: Viking', 
    year: '2023', 
    boardX: 600, boardY: 80,
    lat: 55.6761, lng: 12.5683, 
    color: '#ef4444', 
    note: 'Denmark Deployment.', 
    description: 'Strategic deployment to Copenhagen for the "Nordic Summit". Objectives: Knowledge transfer, architecture alignment, and cultural integration. Mission success verified.',
    fullDate: '15 NOV 2023',
    location: 'Copenhagen, Denmark',
    status: 'DECLASSIFIED',
    images: [
        { url: 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1200&auto=format&fit=crop', caption: 'Target Location: Nyhavn', isHighlight: true },
        { url: 'https://images.unsplash.com/photo-1496417263034-38ec4f0d6b21?q=80&w=1200&auto=format&fit=crop', caption: 'The Bridge', isHighlight: true },
        { url: 'https://images.unsplash.com/photo-1574359414214-4a47b42774a3?q=80&w=800&auto=format&fit=crop', caption: 'Local Transport' },
        { url: 'https://images.unsplash.com/photo-1605527876805-467389e67d26?q=80&w=800&auto=format&fit=crop', caption: 'Office View' },
        { url: 'https://images.unsplash.com/photo-1601053748281-79738c8c50e3?q=80&w=800&auto=format&fit=crop', caption: 'Strategy Session' },
        { url: 'https://images.unsplash.com/photo-1588619460503-46a480aa2b20?q=80&w=800&auto=format&fit=crop', caption: 'Base of Operations' }
    ]
  },
  { 
      id: 6, 
      title: 'DesignerOS', 
      year: '2024', 
      boardX: 750, boardY: 500,
      lat: 13.7563, lng: 100.5018, 
      color: '#ff7e33', 
      note: 'The ultimate weapon.', 
      description: 'Subject began construction of a "Portfolio Operating System". Purpose: To showcase skills in a non-linear format. Status: Deployment imminent.',
      fullDate: 'PRESENT DAY',
      location: 'Localhost:3000',
      status: 'CLASSIFIED',
      images: [
          { url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=400&auto=format&fit=crop', caption: 'System Architecture', isHighlight: true }
      ]
  },
];

export const CONNECTIONS: Connection[] = [
  { from: 1, to: 2 },
  { from: 2, to: 3 },
  { from: 3, to: 4 },
  { from: 4, to: 5 },
  { from: 5, to: 7 }, 
  { from: 7, to: 6 }, 
  { from: 5, to: 6 },
];

export const fetchNodes = async (): Promise<NodeData[]> => {
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...MOCK_NODES];
};

export const createNode = async (newNode: Omit<NodeData, 'id'>): Promise<NodeData> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const node: NodeData = {
        ...newNode,
        id: Math.max(...MOCK_NODES.map(n => n.id)) + 1
    };
    
    MOCK_NODES.push(node);
    return node;
};

export const fetchConnections = async (): Promise<Connection[]> => {
    return CONNECTIONS;
};
