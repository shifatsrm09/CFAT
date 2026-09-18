import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import CustomNavbar from './Navbar';

jest.mock('react-router-dom', () => ({
  Link: ({ to, children, ...props }) => <a href={to} {...props}>{children}</a>,
  NavLink: ({ to, children }) => <a href={to}>{children}</a>,
}), { virtual: true });

beforeEach(() => {
  jest.useFakeTimers();
  window.matchMedia = jest.fn(() => ({ matches: false }));
});
afterEach(() => { jest.clearAllTimers(); jest.useRealTimers(); });

test('briefly previews light, returns to dark, and teases a repeat hover', () => {
  localStorage.setItem('cfat-theme', 'light');
  render(<CustomNavbar />);
  expect(document.documentElement.dataset.theme).toBe('dark');
  const button = screen.getByRole('button', { name: 'Try light mode' });
  fireEvent.click(button);
  expect(document.documentElement.dataset.theme).toBe('light');
  act(() => { jest.advanceTimersByTime(450); });
  expect(document.documentElement.dataset.theme).toBe('dark');
  expect(screen.getByRole('status')).toHaveTextContent('Eww, the big light!');
  fireEvent.pointerEnter(button);
  expect(screen.getByRole('status')).toHaveTextContent('You again?');
  act(() => { jest.advanceTimersByTime(5000); });
  expect(screen.getByRole('status')).toBeEmptyDOMElement();
});

test('rapid clicks do not restart the flash and unmount restores dark', () => {
  const { unmount } = render(<CustomNavbar />);
  const button = screen.getByRole('button', { name: 'Try light mode' });
  fireEvent.click(button);
  act(() => { jest.advanceTimersByTime(300); });
  fireEvent.click(button);
  act(() => { jest.advanceTimersByTime(150); });
  expect(document.documentElement.dataset.theme).toBe('dark');
  fireEvent.click(button);
  expect(document.documentElement.dataset.theme).toBe('dark');
  act(() => { jest.advanceTimersByTime(2050); });
  fireEvent.click(button);
  expect(document.documentElement.dataset.theme).toBe('light');
  unmount();
  expect(document.documentElement.dataset.theme).toBe('dark');
  expect(jest.getTimerCount()).toBe(0);
});

test('reduced motion shows the joke without flashing and allows dismissal', () => {
  window.matchMedia.mockReturnValue({ matches: true });
  render(<CustomNavbar />);
  fireEvent.click(screen.getByRole('button', { name: 'Try light mode' }));
  expect(document.documentElement.dataset.theme).toBe('dark');
  expect(screen.getByRole('status')).toHaveTextContent('Eww, the big light!');
  fireEvent.click(screen.getByRole('button', { name: 'Dismiss message' }));
  expect(screen.getByRole('status')).toBeEmptyDOMElement();
});
