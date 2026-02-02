import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChatInterface from './ChatInterface';

describe('ChatInterface', () => {
  it('should render the chat header', () => {
    render(<ChatInterface onMessage={vi.fn()} messages={[]} />);
    
    expect(screen.getByText('Tell us what you need')).toBeInTheDocument();
    expect(screen.getByText('Describe your ideal bike in natural language')).toBeInTheDocument();
  });

  it('should display suggestion buttons when messages are empty', () => {
    render(<ChatInterface onMessage={vi.fn()} messages={[]} />);
    
    expect(screen.getByText('"I want something affordable for commuting"')).toBeInTheDocument();
    expect(screen.getByText('"I\'m a beginner with bad knees"')).toBeInTheDocument();
  });

  it('should call onMessage when suggestion is clicked', async () => {
    const onMessage = vi.fn();
    render(<ChatInterface onMessage={onMessage} messages={[]} />);
    
    const suggestion = screen.getByText('"I want something affordable for commuting"');
    await userEvent.click(suggestion);
    
    expect(onMessage).toHaveBeenCalledWith('I want something affordable for commuting');
  });

  it('should hide suggestions when messages exist', () => {
    const messages = [{ type: 'user', text: 'Hello' }];
    render(<ChatInterface onMessage={vi.fn()} messages={messages} />);
    
    expect(screen.queryByText('"I want something affordable for commuting"')).not.toBeInTheDocument();
  });

  it('should display user messages correctly', () => {
    const messages = [{ type: 'user', text: 'I need a bike' }];
    render(<ChatInterface onMessage={vi.fn()} messages={messages} />);
    
    expect(screen.getByText('I need a bike')).toBeInTheDocument();
  });

  it('should display system messages with AI badge', () => {
    const messages = [{ type: 'system', text: 'Here are your recommendations' }];
    render(<ChatInterface onMessage={vi.fn()} messages={messages} />);
    
    expect(screen.getByText('Here are your recommendations')).toBeInTheDocument();
    expect(screen.getByText('🤖 AI + Bayesian')).toBeInTheDocument();
  });

  it('should have an input field', () => {
    render(<ChatInterface onMessage={vi.fn()} messages={[]} />);
    
    expect(screen.getByPlaceholderText(/describe what you're looking for/i)).toBeInTheDocument();
  });

  it('should call onMessage when form is submitted', async () => {
    const onMessage = vi.fn();
    render(<ChatInterface onMessage={onMessage} messages={[]} />);
    
    const input = screen.getByPlaceholderText(/describe what you're looking for/i);
    await userEvent.type(input, 'I want a road bike');
    
    const submitButton = screen.getByRole('button', { name: /send/i });
    await userEvent.click(submitButton);
    
    expect(onMessage).toHaveBeenCalledWith('I want a road bike');
  });

  it('should clear input after submission', async () => {
    const onMessage = vi.fn();
    render(<ChatInterface onMessage={onMessage} messages={[]} />);
    
    const input = screen.getByPlaceholderText(/describe what you're looking for/i);
    await userEvent.type(input, 'test message');
    
    const submitButton = screen.getByRole('button', { name: /send/i });
    await userEvent.click(submitButton);
    
    expect(input).toHaveValue('');
  });

  it('should not submit empty messages', async () => {
    const onMessage = vi.fn();
    render(<ChatInterface onMessage={onMessage} messages={[]} />);
    
    const submitButton = screen.getByRole('button', { name: /send/i });
    await userEvent.click(submitButton);
    
    expect(onMessage).not.toHaveBeenCalled();
  });

  it('should not submit whitespace-only messages', async () => {
    const onMessage = vi.fn();
    render(<ChatInterface onMessage={onMessage} messages={[]} />);
    
    const input = screen.getByPlaceholderText(/describe what you're looking for/i);
    await userEvent.type(input, '   ');
    
    const submitButton = screen.getByRole('button', { name: /send/i });
    await userEvent.click(submitButton);
    
    expect(onMessage).not.toHaveBeenCalled();
  });

  it('should display evidence badges when provided in message', () => {
    const messages = [{
      type: 'system',
      text: 'Got it!',
      evidence: { TERRAIN: 'ROAD', BUDGET: 'LOW' }
    }];
    render(<ChatInterface onMessage={vi.fn()} messages={messages} />);
    
    expect(screen.getByText('Extracted evidence:')).toBeInTheDocument();
  });

  it('should render multiple messages in order', () => {
    const messages = [
      { type: 'user', text: 'First message' },
      { type: 'system', text: 'Second message' },
      { type: 'user', text: 'Third message' }
    ];
    render(<ChatInterface onMessage={vi.fn()} messages={messages} />);
    
    expect(screen.getByText('First message')).toBeInTheDocument();
    expect(screen.getByText('Second message')).toBeInTheDocument();
    expect(screen.getByText('Third message')).toBeInTheDocument();
  });
});
