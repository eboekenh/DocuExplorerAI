// Performance monitoring and analytics utilities
// analytics.js

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      pageLoadTime: 0,
      timeToInteractive: 0,
      aiResponseTimes: [],
      errors: [],
      userInteractions: []
    };
    
    this.initializePerformanceTracking();
  }

  initializePerformanceTracking() {
    // Track page load time
    if (typeof window !== 'undefined' && window.performance) {
      window.addEventListener('load', () => {
        const loadTime = performance.now();
        this.metrics.pageLoadTime = loadTime;
        this.trackEvent('page_load', { loadTime });
      });

      // Track long tasks (performance issues)
      if ('PerformanceObserver' in window) {
        try {
          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (entry.duration > 50) { // Tasks longer than 50ms
                this.trackEvent('long_task', {
                  duration: entry.duration,
                  startTime: entry.startTime
                });
              }
            }
          });
          observer.observe({ entryTypes: ['longtask'] });
        } catch (e) {
          console.warn('PerformanceObserver not supported:', e);
        }
      }
    }
  }

  // Track AI response times
  trackAIResponse(provider, responseTime, success = true, errorType = null) {
    const metric = {
      provider,
      responseTime,
      success,
      errorType,
      timestamp: Date.now()
    };
    
    this.metrics.aiResponseTimes.push(metric);
    
    // Keep only last 100 entries
    if (this.metrics.aiResponseTimes.length > 100) {
      this.metrics.aiResponseTimes.shift();
    }
    
    this.trackEvent('ai_response', metric);
  }

  // Track user interactions
  trackUserInteraction(action, details = {}) {
    const interaction = {
      action,
      details,
      timestamp: Date.now(),
      url: window.location.href
    };
    
    this.metrics.userInteractions.push(interaction);
    
    // Keep only last 50 interactions
    if (this.metrics.userInteractions.length > 50) {
      this.metrics.userInteractions.shift();
    }
    
    this.trackEvent('user_interaction', interaction);
  }

  // Track errors
  trackError(error, context = {}) {
    const errorMetric = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };
    
    this.metrics.errors.push(errorMetric);
    
    // Keep only last 20 errors
    if (this.metrics.errors.length > 20) {
      this.metrics.errors.shift();
    }
    
    this.trackEvent('error', errorMetric);
    console.error('Tracked error:', errorMetric);
  }

  // Generic event tracking
  trackEvent(eventName, properties = {}) {
    // Add common properties
    const enrichedProperties = {
      ...properties,
      timestamp: Date.now(),
      session_id: this.getSessionId(),
      user_agent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };

    // Console logging for development
    if (import.meta.env.DEV) {
      console.log(`📊 Analytics Event: ${eventName}`, enrichedProperties);
    }

    // Here you would send to your analytics service
    // For now, we'll store locally and could batch send later
    this.storeEventLocally(eventName, enrichedProperties);
  }

  // Get or create session ID
  getSessionId() {
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }

  // Store events locally (could be sent to server periodically)
  storeEventLocally(eventName, properties) {
    try {
      const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
      events.push({ eventName, properties });
      
      // Keep only last 100 events
      if (events.length > 100) {
        events.splice(0, events.length - 100);
      }
      
      localStorage.setItem('analytics_events', JSON.stringify(events));
    } catch (e) {
      console.warn('Failed to store analytics event:', e);
    }
  }

  // Get performance summary
  getPerformanceSummary() {
    const aiResponseTimes = this.metrics.aiResponseTimes.filter(r => r.success);
    const avgResponseTime = aiResponseTimes.length > 0 
      ? aiResponseTimes.reduce((sum, r) => sum + r.responseTime, 0) / aiResponseTimes.length 
      : 0;

    const errorRate = this.metrics.aiResponseTimes.length > 0
      ? (this.metrics.aiResponseTimes.filter(r => !r.success).length / this.metrics.aiResponseTimes.length) * 100
      : 0;

    return {
      pageLoadTime: this.metrics.pageLoadTime,
      totalInteractions: this.metrics.userInteractions.length,
      totalErrors: this.metrics.errors.length,
      aiMetrics: {
        totalRequests: this.metrics.aiResponseTimes.length,
        averageResponseTime: Math.round(avgResponseTime),
        errorRate: Math.round(errorRate * 10) / 10,
        successfulRequests: aiResponseTimes.length
      }
    };
  }

  // Export data for debugging
  exportPerformanceData() {
    return {
      metrics: this.metrics,
      summary: this.getPerformanceSummary(),
      storedEvents: JSON.parse(localStorage.getItem('analytics_events') || '[]')
    };
  }
}

// Error boundary utility
export class ErrorBoundary {
  constructor(monitor) {
    this.monitor = monitor;
    this.setupGlobalErrorHandlers();
  }

  setupGlobalErrorHandlers() {
    // Catch unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.monitor.trackError(
        new Error(event.reason), 
        { type: 'unhandled_promise_rejection' }
      );
    });

    // Catch global JavaScript errors
    window.addEventListener('error', (event) => {
      this.monitor.trackError(
        new Error(event.message), 
        { 
          type: 'javascript_error',
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        }
      );
    });
  }
}

// Create and export singleton instance
export const performanceMonitor = new PerformanceMonitor();
export const errorBoundary = new ErrorBoundary(performanceMonitor);

// Utility functions for easy use in components
export const trackAIResponse = (provider, responseTime, success, errorType) => {
  performanceMonitor.trackAIResponse(provider, responseTime, success, errorType);
};

export const trackUserAction = (action, details) => {
  performanceMonitor.trackUserInteraction(action, details);
};

export const trackError = (error, context) => {
  performanceMonitor.trackError(error, context);
};

export const getPerformanceInsights = () => {
  return performanceMonitor.getPerformanceSummary();
};