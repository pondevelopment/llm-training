import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import BikeRecommendations from './BikeRecommendations';

const mockRecommendations = [
  {
    id: 'bike-1',
    name: 'Test Road Bike',
    type: 'ROAD',
    price: 1299,
    priceRange: 'MIDRANGE',
    suspension: 'NONE',
    comfort: 'BASIC',
    image: '🚴',
    description: 'A test road bike',
    score: 85,
    specs: { weight: '9kg', gears: '22-speed', frame: 'Carbon' }
  },
  {
    id: 'bike-2',
    name: 'Test Mountain Bike',
    type: 'MOUNTAIN',
    price: 999,
    priceRange: 'MIDRANGE',
    suspension: 'FRONT',
    comfort: 'COMFORTABLE',
    image: '🚵',
    description: 'A test mountain bike',
    score: 72,
    specs: { weight: '12kg', gears: '21-speed', frame: 'Aluminum' }
  },
  {
    id: 'bike-3',
    name: 'Test Hybrid Bike',
    type: 'HYBRID',
    price: 599,
    priceRange: 'BUDGET',
    suspension: 'FRONT',
    comfort: 'COMFORTABLE',
    image: '🚲',
    description: 'A test hybrid bike',
    score: 65,
    specs: { weight: '11kg', gears: '18-speed', frame: 'Aluminum' }
  }
];

describe('BikeRecommendations', () => {
  it('should render all recommendations', () => {
    render(<BikeRecommendations recommendations={mockRecommendations} previousScores={{}} />);
    
    expect(screen.getByText('Test Road Bike')).toBeInTheDocument();
    expect(screen.getByText('Test Mountain Bike')).toBeInTheDocument();
    expect(screen.getByText('Test Hybrid Bike')).toBeInTheDocument();
  });

  it('should display the header', () => {
    render(<BikeRecommendations recommendations={mockRecommendations} previousScores={{}} />);
    
    expect(screen.getByText('Top Recommendations')).toBeInTheDocument();
    expect(screen.getByText('Bikes ranked by Bayesian match score')).toBeInTheDocument();
  });

  it('should display "Best Match" badge on first recommendation', () => {
    render(<BikeRecommendations recommendations={mockRecommendations} previousScores={{}} />);
    
    expect(screen.getByText('Best Match')).toBeInTheDocument();
  });

  it('should display bike descriptions', () => {
    render(<BikeRecommendations recommendations={mockRecommendations} previousScores={{}} />);
    
    expect(screen.getByText('A test road bike')).toBeInTheDocument();
    expect(screen.getByText('A test mountain bike')).toBeInTheDocument();
  });

  it('should display bike type badges', () => {
    render(<BikeRecommendations recommendations={mockRecommendations} previousScores={{}} />);
    
    expect(screen.getByText('ROAD')).toBeInTheDocument();
    expect(screen.getByText('MOUNTAIN')).toBeInTheDocument();
    expect(screen.getByText('HYBRID')).toBeInTheDocument();
  });

  it('should display score percentages', () => {
    render(<BikeRecommendations recommendations={mockRecommendations} previousScores={{}} />);
    
    expect(screen.getByText('85%')).toBeInTheDocument();
    expect(screen.getByText('72%')).toBeInTheDocument();
    expect(screen.getByText('65%')).toBeInTheDocument();
  });

  it('should display bike prices', () => {
    render(<BikeRecommendations recommendations={mockRecommendations} previousScores={{}} />);
    
    expect(screen.getByText('$1,299')).toBeInTheDocument();
    expect(screen.getByText('$999')).toBeInTheDocument();
    expect(screen.getByText('$599')).toBeInTheDocument();
  });

  it('should handle empty recommendations', () => {
    render(<BikeRecommendations recommendations={[]} previousScores={{}} />);
    
    expect(screen.getByText('Top Recommendations')).toBeInTheDocument();
  });

  it('should apply correct score color classes', () => {
    const { container } = render(
      <BikeRecommendations recommendations={mockRecommendations} previousScores={{}} />
    );
    
    // Score >= 70 should have green color
    const greenScores = container.querySelectorAll('.text-green-400');
    expect(greenScores.length).toBeGreaterThan(0);
  });

  it('should highlight first bike with ring styling', () => {
    const { container } = render(
      <BikeRecommendations recommendations={mockRecommendations} previousScores={{}} />
    );
    
    const highlightedCard = container.querySelector('.ring-2.ring-blue-500');
    expect(highlightedCard).toBeInTheDocument();
  });
});
