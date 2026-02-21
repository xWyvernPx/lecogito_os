/**
 * Timeline data hooks — facade that selects mock or real API layer.
 * Currently no real API exists for timeline, so mock is always used.
 * When a real API is added, create services/hooks/use-timeline.ts and wire it here.
 */
export { useNodes, useConnections, useCreateNode } from './use-timeline-mock';
