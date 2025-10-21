import React from 'react';
/*
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
*/
import BadgeGallery from './BadgeGallery';

// Mock badge data
const mockBadges = [
  {
    id: 'nitya-sadhaka',
    title: 'Nitya Sādhaka',
    description: 'Completed daily sādhanas for 7 consecutive days',
    icon: ' diyā',
    criteria: 'dailyStreak >= 7',
    category: 'consistency'
  },
  {
    id: 'kalīs-flame',
    title: 'Kālī\'s Flame',
    description: 'Completed 3 intense sādhana challenges',
    icon: ' red-black-flame',
    criteria: 'intenseChallengesCompleted >= 3',
    category: 'discipline'
  }
];

/*
describe('BadgeGallery', () => {
  it('renders badges correctly', () => {
    render(
      <BadgeGallery 
        allBadges={mockBadges} 
        earnedBadges={['nitya-sadhaka']} 
      />
    );
    
    // Check if badges are rendered
    expect(screen.getByText('Nitya Sādhaka')).toBeInTheDocument();
    expect(screen.getByText('Kālī\'s Flame')).toBeInTheDocument();
    
    // Check if earned badge is marked as earned
    expect(screen.getByText('Earned')).toBeInTheDocument();
    
    // Check if unearned badge is marked as locked
    expect(screen.getByText('Locked')).toBeInTheDocument();
  });

  it('toggles between English and Hinglish', () => {
    render(
      <BadgeGallery 
        allBadges={mockBadges} 
        earnedBadges={['nitya-sadhaka']} 
      />
    );
    
    // Initially should show English
    expect(screen.getByText('Nitya Sādhaka')).toBeInTheDocument();
    expect(screen.queryByText('Nitya Sādhaka (Regular Practitioner)')).not.toBeInTheDocument();
    
    // Find and click the toggle button
    const toggleButton = screen.getByText('Show Hinglish');
    fireEvent.click(toggleButton);
    
    // Should now show Hinglish
    expect(screen.getByText('Nitya Sādhaka (Regular Practitioner)')).toBeInTheDocument();
    expect(screen.queryByText('Nitya Sādhaka')).not.toBeInTheDocument();
    
    // Click again to toggle back to English
    fireEvent.click(toggleButton);
    expect(screen.getByText('Show Hinglish')).toBeInTheDocument();
  });

  it('shows category filters', () => {
    render(
      <BadgeGallery 
        allBadges={mockBadges} 
        earnedBadges={['nitya-sadhaka']} 
      />
    );
    
    // Check if category filters are rendered
    expect(screen.getByText('All Badges')).toBeInTheDocument();
    expect(screen.getByText('consistency')).toBeInTheDocument();
    expect(screen.getByText('discipline')).toBeInTheDocument();
  });
});
*/