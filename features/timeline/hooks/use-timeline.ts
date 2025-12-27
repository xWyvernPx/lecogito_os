import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchNodes, fetchConnections, createNode } from '../api';
import { NodeData } from '../types';

export const useNodes = () => {
  return useQuery({
    queryKey: ['timeline-nodes'],
    queryFn: fetchNodes,
    staleTime: Infinity, // Keep data fresh in this session unless invalidated
  });
};

export const useConnections = () => {
    return useQuery({
      queryKey: ['timeline-connections'],
      queryFn: fetchConnections,
      staleTime: Infinity,
    });
};

export const useCreateNode = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: createNode,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['timeline-nodes'] });
        }
    });
};
