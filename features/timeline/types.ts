
export interface EvidenceImage {
  url: string;
  caption?: string;
  isHighlight?: boolean;
  gps?: {
      lat: number;
      lng: number;
  };
}

export interface NodeData {
  id: number;
  title: string;
  year: string;
  // Artistic positions (Board Mode)
  boardX: number;
  boardY: number;
  // Geographic positions (Map Mode)
  lat: number;
  lng: number;
  
  color: string;
  note: string;
  description: string;
  images: EvidenceImage[];
  fullDate: string;
  location: string;
  status: 'CLASSIFIED' | 'DECLASSIFIED' | 'ONGOING' | 'SOLVED';
}

export interface Connection {
  from: number;
  to: number;
}