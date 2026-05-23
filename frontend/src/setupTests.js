import '@testing-library/jest-dom';

// High-fidelity ResizeObserver mock to prevent Framer Motion rendering crashes in jsdom environment
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = ResizeObserverMock;

// High-fidelity IntersectionObserver mock to prevent Framer Motion inView viewport crashes in jsdom environment
class IntersectionObserverMock {
  constructor(callback, options) {
    this.callback = callback;
    this.options = options;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.IntersectionObserver = IntersectionObserverMock;
