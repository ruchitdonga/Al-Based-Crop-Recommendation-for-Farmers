// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// JSDOM doesn't provide IntersectionObserver, but Framer Motion uses it for
// viewport/scroll animations (whileInView). Mock it so tests can run in CI.
class IntersectionObserverMock {
	constructor(callback) {
		this.callback = callback;
	}

	observe = (target) => {
		this.callback([{ isIntersecting: true, target }]);
	};

	unobserve = () => {};
	disconnect = () => {};
	takeRecords = () => [];
}

Object.defineProperty(window, 'IntersectionObserver', {
	writable: true,
	value: IntersectionObserverMock,
});

Object.defineProperty(global, 'IntersectionObserver', {
	writable: true,
	value: IntersectionObserverMock,
});
