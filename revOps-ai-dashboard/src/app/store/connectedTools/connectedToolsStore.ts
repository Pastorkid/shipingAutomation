import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ConnectedToolsState, ConnectedTool, POPULAR_TOOLS, ToolConfig } from './connectedToolsInteface';
import toast from 'react-hot-toast';

// Helper function to get session cookie
const getSessionCookie = (): string => {
  // Check cookies first
  if (document.cookie) {
    const cookies = document.cookie.split(';');
    const sessionCookie = cookies.find(c => c.trim().startsWith('session='));
    if (sessionCookie) {
      return sessionCookie.split('=')[1];
    }
  }
  
  // Fallback to localStorage
  const localSession = localStorage.getItem('session') || localStorage.getItem('auth-token') || localStorage.getItem('token');
  if (localSession) {
    return localSession;
  }
  
  return '';
};

export const useConnectedToolsStore = create<ConnectedToolsState>()(
  persist(
    (set, get) => ({
      // Initial state
      isLoading: false,
      error: null,
      tools: [],
      selectedTools: [],
      currentStep: 0,
      setupMethod: 'connect',
      
      // OAuth Flow State
      oauthState: {
        isConnecting: false,
        pendingTool: null,
        returnUrl: null,
        connectionStartTime: null,
      },
      
      // UI State
      uiState: {
        activeView: 'selection',
        recentlyConnected: [],
        connectionHistory: [],
      },

      // Actions
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      
      setError: (error: string | null) => set({ error }),

      setTools: (tools: ConnectedTool[]) => set({ tools }),

      addTool: (tool: ConnectedTool) => set((state) => ({ 
        tools: [...state.tools, tool] 
      })),

      updateTool: (id: string, updates: Partial<ConnectedTool>) => set((state) => ({
        tools: state.tools.map(tool => 
          tool.id === id ? { ...tool, ...updates } : tool
        )
      })),

      removeTool: (id: string) => set((state) => ({
        tools: state.tools.filter(tool => tool.id !== id),
        selectedTools: state.selectedTools.filter(toolId => toolId !== id)
      })),

      setSelectedTools: (toolIds: string[]) => set({ selectedTools: toolIds }),

      toggleToolSelection: (toolId: string) => set((state) => ({
        selectedTools: state.selectedTools.includes(toolId)
          ? state.selectedTools.filter(id => id !== toolId)
          : [...state.selectedTools, toolId]
      })),

      setCurrentStep: (step: number) => set({ currentStep: step }),

      setSetupMethod: (method: 'connect' | 'upload' | 'manual') => set({ setupMethod: method }),

      connectTool: async (toolType: string, config: ToolConfig) => {
        set({ isLoading: true, error: null });
        
        try {
          const sessionValue = getSessionCookie();

          const response = await fetch('/api/connectTools', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Cookie': `session=${sessionValue}`,
            },
            credentials: 'include',
            body: JSON.stringify({
              action: 'connect',
              toolType,
              config
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to connect tool');
          }

          const result = await response.json();
          
          if (result.success) {
            const newTool: ConnectedTool = {
              id: result.data.toolId,
              name: toolType,
              type: toolType as any,
              category: result.data.category,
              status: 'connected',
              connectedAt: new Date(),
              config,
              syncSettings: {
                frequency: 'manual',
                isActive: true
              }
            };

            get().addTool(newTool);
            
            toast.success(`${toolType} connected successfully!`, {
              duration: 3000,
              style: {
                background: '#10b981',
                color: 'white',
              },
            });
          } else {
            throw new Error(result.message || 'Failed to connect tool');
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to connect tool';
          set({ error: errorMessage });
          
          toast.error(errorMessage, {
            duration: 5000,
            style: {
              background: '#ef4444',
              color: 'white',
            },
          });
        } finally {
          set({ isLoading: false });
        }
      },

      disconnectTool: async (toolId: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch('/api/connectTools', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
              action: 'disconnect',
              toolId
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to disconnect tool');
          }

          const result = await response.json();
          
          if (result.success) {
            get().removeTool(toolId);
            
            toast.success('Tool disconnected successfully!', {
              duration: 3000,
              style: {
                background: '#10b981',
                color: 'white',
              },
            });
          } else {
            throw new Error(result.message || 'Failed to disconnect tool');
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to disconnect tool';
          set({ error: errorMessage });
          
          toast.error(errorMessage, {
            duration: 5000,
            style: {
              background: '#ef4444',
              color: 'white',
            },
          });
        } finally {
          set({ isLoading: false });
        }
      },

      testConnection: async (toolId: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch('/api/connectTools', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
              action: 'test',
              toolId
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Connection test failed');
          }

          const result = await response.json();
          
          if (result.success) {
            toast.success('Connection test successful!', {
              duration: 3000,
              style: {
                background: '#10b981',
                color: 'white',
              },
            });

            return true;
          } else {
            throw new Error(result.message || 'Connection test failed');
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Connection test failed';
          
          toast.error(errorMessage, {
            duration: 5000,
            style: {
              background: '#ef4444',
              color: 'white',
            },
          });
          
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      syncTool: async (toolId: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch('/api/connectTools', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
              action: 'sync',
              toolId
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Sync failed');
          }

          const result = await response.json();
          
          if (result.success) {
            get().updateTool(toolId, {
              lastSyncAt: new Date(),
              status: 'connected'
            });
            
            toast.success('Tool synced successfully!', {
              duration: 3000,
              style: {
                background: '#10b981',
                color: 'white',
              },
            });
          } else {
            throw new Error(result.message || 'Sync failed');
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Sync failed';
          set({ error: errorMessage });
          
          toast.error(errorMessage, {
            duration: 5000,
            style: {
              background: '#ef4444',
              color: 'white',
            },
          });
        } finally {
          set({ isLoading: false });
        }
      },

      // Refresh tools from backend
      refreshTools: async () => {
        set({ isLoading: true, error: null });
        try {
          const sessionCookie = getSessionCookie();
          const apiUrl = process.env.NEXT_PUBLIC_SERVER_LOCAL_URL || 'http://localhost:3001';
          
          // Prepare headers
          const headers: Record<string, string> = {
            'Content-Type': 'application/json',
          };
          
          if (sessionCookie) {
            headers['Cookie'] = `session=${sessionCookie}`;
          }
          
          const response = await fetch(`${apiUrl}/api/connectTools`, {
            method: 'GET',
            credentials: 'include',
            headers,
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            set({ error: data.message || 'Failed to fetch connected tools' });
            return;
          }
          
          if (data.success && Array.isArray(data.data)) {
            set({ tools: data.data, error: null });
          } else {
            set({ error: 'Invalid response format from server' });
          }
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch tools';
          set({ 
            error: errorMessage, 
            isLoading: false 
          });
        } finally {
          set({ isLoading: false });
        }
      },

      completeToolsSetup: () => {
        set({ 
          currentStep: 2, // Move to next step after tools setup
          isLoading: false,
          error: null
        });
        
        toast.success('Tools setup completed!', {
          duration: 3000,
          style: {
            background: '#10b981',
            color: 'white',
          },
        });
      },

      // OAuth Flow Actions
      initiateOAuthConnection: (toolId: string, returnUrl: string = '/onboarding') => {
        set((state) => ({
          oauthState: {
            ...state.oauthState,
            isConnecting: true,
            pendingTool: toolId,
            returnUrl,
            connectionStartTime: Date.now(),
          },
          uiState: {
            ...state.uiState,
            activeView: 'configuration',
          }
        }));
      },

      completeOAuthConnection: (toolId: string, success: boolean, error?: string) => {
        const state = get();
        
        // Add to connection history
        const historyEntry = {
          toolId,
          timestamp: Date.now(),
          status: success ? 'success' as const : 'error' as const,
          error: error || undefined,
        };
        
        set((newState) => ({
          oauthState: {
            ...newState.oauthState,
            isConnecting: false,
            pendingTool: null,
            connectionStartTime: null,
          },
          uiState: {
            ...newState.uiState,
            activeView: success ? 'success' : 'selection',
            recentlyConnected: success 
              ? [...newState.uiState.recentlyConnected, toolId]
              : newState.uiState.recentlyConnected,
            connectionHistory: [historyEntry, ...newState.uiState.connectionHistory].slice(0, 10), // Keep last 10
          }
        }));

        // Show appropriate toast
        if (success) {
          toast.success(`${toolId.charAt(0).toUpperCase() + toolId.slice(1)} connected successfully!`, {
            duration: 4000,
            style: {
              background: '#10b981',
              color: 'white',
            },
          });
        } else {
          toast.error(`${toolId.charAt(0).toUpperCase() + toolId.slice(1)} connection failed: ${error || 'Unknown error'}`, {
            duration: 5000,
            style: {
              background: '#ef4444',
              color: 'white',
            },
          });
        }
      },

      clearOAuthState: () => {
        set((state) => ({
          oauthState: {
            ...state.oauthState,
            isConnecting: false,
            pendingTool: null,
            returnUrl: null,
            connectionStartTime: null,
          }
        }));
      },

      // UI Actions
      setActiveView: (view: 'selection' | 'configuration' | 'success') => {
        set((state) => ({
          uiState: {
            ...state.uiState,
            activeView: view,
          }
        }));
      },

      addToRecentlyConnected: (toolId: string) => {
        set((state) => ({
          uiState: {
            ...state.uiState,
            recentlyConnected: [...state.uiState.recentlyConnected, toolId],
          }
        }));
      },

      addConnectionHistory: (entry: { toolId: string; timestamp: number; status: 'success' | 'error'; error?: string }) => {
        set((state) => ({
          uiState: {
            ...state.uiState,
            connectionHistory: [entry, ...state.uiState.connectionHistory].slice(0, 10),
          }
        }));
      },
    }),
    {
      name: 'connected-tools-storage',
      partialize: (state: ConnectedToolsState) => ({
        tools: state.tools,
        selectedTools: state.selectedTools,
        currentStep: state.currentStep,
        setupMethod: state.setupMethod,
      }),
    }
  )
);
