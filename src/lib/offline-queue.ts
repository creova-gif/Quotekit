export interface QueuedAction {
  id: string;
  table: string;
  action: 'insert' | 'update' | 'delete';
  payload: any;
  timestamp: number;
}

const QUEUE_KEY = 'quotekit_offline_queue';

export const OfflineQueue = {
  getQueue(): QueuedAction[] {
    const data = localStorage.getItem(QUEUE_KEY);
    return data ? JSON.parse(data) : [];
  },

  enqueue(action: Omit<QueuedAction, 'id' | 'timestamp'>) {
    const queue = this.getQueue();
    const newAction: QueuedAction = {
      ...action,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    queue.push(newAction);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  },

  dequeue(id: string) {
    const queue = this.getQueue();
    const updatedQueue = queue.filter(action => action.id !== id);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(updatedQueue));
  },

  clear() {
    localStorage.removeItem(QUEUE_KEY);
  }
};
