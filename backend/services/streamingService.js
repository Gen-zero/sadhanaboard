const RedisService = require('./redisService');

// Streaming service with improved scalability
class StreamingService {
  // Configuration
  static config = {
    // Batch size for message processing
    batchSize: parseInt(process.env.STREAMING_BATCH_SIZE) || 100,
    // Throttling interval in milliseconds
    throttleInterval: parseInt(process.env.STREAMING_THROTTLE_INTERVAL) || 1000,
    // Maximum queue size before dropping messages
    maxQueueSize: parseInt(process.env.STREAMING_MAX_QUEUE_SIZE) || 10000
  };

  // Message queues for different channels
  static queues = new Map();
  
  // Throttling timers
  static timers = new Map();
  
  // Statistics
  static stats = {
    published: 0,
    dropped: 0,
    errors: 0
  };

  // Initialize queue for a channel
  static initQueue(channel) {
    if (!this.queues.has(channel)) {
      this.queues.set(channel, []);
    }
  }

  // Add message to queue
  static addToQueue(channel, message) {
    this.initQueue(channel);
    const queue = this.queues.get(channel);
    
    // Check queue size and drop oldest messages if needed
    if (queue.length >= this.config.maxQueueSize) {
      queue.shift(); // Remove oldest message
      this.stats.dropped++;
    }
    
    queue.push(message);
    this.stats.published++;
  }

  // Process queue for a channel
  static async processQueue(channel) {
    this.initQueue(channel);
    const queue = this.queues.get(channel);
    
    if (queue.length === 0) {
      return;
    }
    
    // Take a batch of messages
    const batch = queue.splice(0, Math.min(this.config.batchSize, queue.length));
    
    try {
      // Publish batch as a single message
      const message = {
        type: `batch:${channel}`,
        data: batch,
        timestamp: new Date().toISOString(),
        count: batch.length
      };
      
      await RedisService.publish(channel, JSON.stringify(message));
    } catch (error) {
      console.error(`Failed to publish batch for channel ${channel}:`, error);
      this.stats.errors++;
      // Re-add messages to queue for retry
      queue.unshift(...batch);
    }
  }

  // Start throttled processing for a channel
  static startThrottledProcessing(channel) {
    if (this.timers.has(channel)) {
      return; // Already started
    }
    
    const timer = setInterval(() => {
      this.processQueue(channel);
    }, this.config.throttleInterval);
    
    this.timers.set(channel, timer);
  }

  // Stop throttled processing for a channel
  static stopThrottledProcessing(channel) {
    if (this.timers.has(channel)) {
      clearInterval(this.timers.get(channel));
      this.timers.delete(channel);
    }
  }

  // Generic publish function with batching and throttling
  static async publish(channel, data) {
    try {
      // Add to queue
      this.addToQueue(channel, data);
      
      // Start throttled processing if not already started
      this.startThrottledProcessing(channel);
      
      return true;
    } catch (error) {
      console.error(`Failed to publish to channel ${channel}:`, error);
      this.stats.errors++;
      return false;
    }
  }

  // Generic subscribe function
  static async subscribe(channel, callback) {
    try {
      const subscription = await RedisService.subscribe(channel, async (message) => {
        try {
          const parsed = JSON.parse(message);
          
          // Handle batched messages
          if (parsed.type && parsed.type.startsWith('batch:')) {
            for (const item of parsed.data) {
              await callback(item);
            }
          } else {
            // Handle single messages
            await callback(parsed.data);
          }
        } catch (error) {
          console.error(`Failed to parse message from channel ${channel}:`, error);
        }
      });
      return subscription;
    } catch (error) {
      console.error(`Failed to subscribe to channel ${channel}:`, error);
      return null;
    }
  }

  // Dashboard stats streaming
  static async publishDashboardStats(stats) {
    return this.publish('dashboard-stats', stats);
  }
  
  static async subscribeToDashboardStats(callback) {
    return this.subscribe('dashboard-stats', callback);
  }
  
  // BI KPI streaming
  static async publishBIKPIs(kpis) {
    return this.publish('bi-kpis', kpis);
  }
  
  static async subscribeToBIKPIs(callback) {
    return this.subscribe('bi-kpis', callback);
  }
  
  // System metrics streaming
  static async publishSystemMetrics(metrics) {
    return this.publish('system-metrics', metrics);
  }
  
  static async subscribeToSystemMetrics(callback) {
    return this.subscribe('system-metrics', callback);
  }
  
  // User activity streaming
  static async publishUserActivity(activity) {
    return this.publish('users-stream', activity);
  }
  
  static async subscribeToUserActivity(callback) {
    return this.subscribe('users-stream', callback);
  }
  
  // Library updates streaming
  static async publishLibraryUpdates(update) {
    return this.publish('library-stream', update);
  }
  
  static async subscribeToLibraryUpdates(callback) {
    return this.subscribe('library-stream', callback);
  }
  
  // Security events streaming
  static async publishSecurityEvent(event) {
    return this.publish('security-events', event);
  }
  
  static async subscribeToSecurityEvents(callback) {
    return this.subscribe('security-events', callback);
  }
  
  // Logs streaming
  static async publishLog(log) {
    return this.publish('logs-stream', log);
  }
  
  static async subscribeToLogs(callback) {
    return this.subscribe('logs-stream', callback);
  }
  
  // Get streaming statistics
  static getStats() {
    return {
      ...this.stats,
      queues: Array.from(this.queues.entries()).map(([channel, queue]) => ({
        channel,
        size: queue.length
      })),
      timers: Array.from(this.timers.keys())
    };
  }
  
  // Reset statistics
  static resetStats() {
    this.stats = {
      published: 0,
      dropped: 0,
      errors: 0
    };
  }
}

module.exports = StreamingService;