import { io, Socket } from 'socket.io-client';
import { Player, Quest, MultiplayerSession } from '../types/game';

// Socket.io configuration
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'https://vinstack-code-socket.herokuapp.com';

interface SocketEvents {
  // Player events
  'player:join': (player: Player) => void;
  'player:leave': (playerId: string) => void;
  'player:move': (playerId: string, position: { x: number; y: number }) => void;
  'player:update': (player: Player) => void;
  
  // Quest events
  'quest:start': (playerId: string, questId: string) => void;
  'quest:complete': (playerId: string, questId: string, score: number) => void;
  'quest:progress': (playerId: string, questId: string, progress: number) => void;
  
  // Multiplayer events
  'multiplayer:create': (session: MultiplayerSession) => void;
  'multiplayer:join': (sessionId: string, player: Player) => void;
  'multiplayer:leave': (sessionId: string, playerId: string) => void;
  'multiplayer:update': (session: MultiplayerSession) => void;
  'multiplayer:chat': (sessionId: string, playerId: string, message: string) => void;
  
  // Game world events
  'world:interact': (playerId: string, objectId: string) => void;
  'world:area-change': (playerId: string, areaId: string) => void;
  
  // System events
  'system:error': (error: string) => void;
  'system:notification': (message: string) => void;
}

class SocketService {
  private socket: Socket | null = null;
  private connected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private listeners: Map<string, Function[]> = new Map();
  
  /**
   * Connect to the Socket.io server
   */
  connect(playerId: string, playerData: Partial<Player>) {
    if (this.socket) {
      console.log('Socket already connected');
      return;
    }
    
    // For the hackathon, we'll mock the socket connection
    console.log(`Connecting to socket server: ${SOCKET_URL}`);
    console.log(`Player ID: ${playerId}`);
    
    // In a real implementation, this would connect to a Socket.io server
    // this.socket = io(SOCKET_URL, {
    //   query: { playerId },
    //   auth: { playerData },
    //   reconnection: true,
    //   reconnectionAttempts: this.maxReconnectAttempts,
    // });
    
    // Mock socket events
    this.mockSocketConnection();
    
    return this;
  }
  
  /**
   * Disconnect from the Socket.io server
   */
  disconnect() {
    if (!this.socket) return;
    
    console.log('Disconnecting from socket server');
    this.socket.disconnect();
    this.socket = null;
    this.connected = false;
    this.reconnectAttempts = 0;
    this.listeners.clear();
  }
  
  /**
   * Emit an event to the Socket.io server
   */
  emit<T extends keyof SocketEvents>(event: T, ...args: Parameters<SocketEvents[T]>) {
    if (!this.socket) {
      console.warn('Socket not connected, cannot emit event:', event);
      return;
    }
    
    console.log(`Emitting event: ${event}`, args);
    this.socket.emit(event as string, ...args);
  }
  
  /**
   * Listen for an event from the Socket.io server
   */
  on<T extends keyof SocketEvents>(event: T, callback: SocketEvents[T]) {
    if (!this.listeners.has(event as string)) {
      this.listeners.set(event as string, []);
    }
    
    this.listeners.get(event as string)?.push(callback as Function);
    
    if (this.socket) {
      this.socket.on(event as string, callback as any);
    }
    
    return this;
  }
  
  /**
   * Remove an event listener
   */
  off<T extends keyof SocketEvents>(event: T, callback?: SocketEvents[T]) {
    if (!this.socket) return this;
    
    if (callback) {
      const callbacks = this.listeners.get(event as string) || [];
      const index = callbacks.indexOf(callback as Function);
      if (index !== -1) {
        callbacks.splice(index, 1);
        this.listeners.set(event as string, callbacks);
      }
      
      this.socket.off(event as string, callback as any);
    } else {
      this.listeners.delete(event as string);
      this.socket.off(event as string);
    }
    
    return this;
  }
  
  /**
   * Join a multiplayer session
   */
  joinMultiplayerSession(sessionId: string, player: Player) {
    this.emit('multiplayer:join', sessionId, player);
    return this;
  }
  
  /**
   * Leave a multiplayer session
   */
  leaveMultiplayerSession(sessionId: string, playerId: string) {
    this.emit('multiplayer:leave', sessionId, playerId);
    return this;
  }
  
  /**
   * Send a chat message in a multiplayer session
   */
  sendChatMessage(sessionId: string, playerId: string, message: string) {
    this.emit('multiplayer:chat', sessionId, playerId, message);
    return this;
  }
  
  /**
   * Update player position
   */
  updatePlayerPosition(playerId: string, position: { x: number; y: number }) {
    this.emit('player:move', playerId, position);
    return this;
  }
  
  /**
   * Mock socket connection for the hackathon
   */
  private mockSocketConnection() {
    // Simulate connection events
    setTimeout(() => {
      this.connected = true;
      this.triggerEvent('connect');
      console.log('Socket connected (mock)');
      
      // Simulate receiving player updates
      setInterval(() => {
        const mockPlayers = [
          { id: 'player1', username: 'CodeNinja', position: { x: Math.random() * 500, y: Math.random() * 500 } },
          { id: 'player2', username: 'ByteWizard', position: { x: Math.random() * 500, y: Math.random() * 500 } },
          { id: 'player3', username: 'AlgoMaster', position: { x: Math.random() * 500, y: Math.random() * 500 } },
        ];
        
        mockPlayers.forEach(player => {
          this.triggerEvent('player:move', player.id, player.position);
        });
      }, 5000);
      
      // Simulate system notifications
      setTimeout(() => {
        this.triggerEvent('system:notification', 'CodeNinja just completed the "Functions Fundamentals" quest!');
      }, 10000);
      
      setTimeout(() => {
        this.triggerEvent('system:notification', 'ByteWizard joined the multiplayer arena!');
      }, 15000);
    }, 1000);
  }
  
  /**
   * Trigger an event for all registered listeners
   */
  private triggerEvent(event: string, ...args: any[]) {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach(callback => {
      try {
        callback(...args);
      } catch (error) {
        console.error(`Error in ${event} listener:`, error);
      }
    });
  }
}

// Create a singleton instance
export const socketService = new SocketService();

export default socketService;