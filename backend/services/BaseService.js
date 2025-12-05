/**
 * Base service class providing common functionality for all services
 */
class BaseService {
  /**
   * Execute a database query with error handling
   * Note: This method is deprecated. Use Mongoose directly instead.
   * @param {string} query - SQL query to execute
   * @param {Array} params - Query parameters
   * @returns {Promise} - Query result
   * @deprecated Use Mongoose schemas directly
   */
  static async executeQuery(query, params = []) {
    try {
      console.warn('WARNING: executeQuery() is deprecated. Use Mongoose schemas directly instead.');
      throw new Error('executeQuery() has been deprecated. Please refactor to use Mongoose schemas.');
    } catch (error) {
      console.error('Database query failed:', error);
      throw error;
    }
  }

  /**
   * Parse JSON field from database result
   * @param {string} jsonField - JSON field value
   * @param {any} defaultValue - Default value if parsing fails
   * @returns {any} - Parsed JSON or default value
   */
  static parseJsonField(jsonField, defaultValue = null) {
    if (!jsonField) return defaultValue;
    
    try {
      return JSON.parse(jsonField);
    } catch (error) {
      console.warn('Failed to parse JSON field:', error);
      return defaultValue;
    }
  }

  /**
   * Stringify object to JSON for database storage
   * @param {any} obj - Object to stringify
   * @returns {string} - JSON string
   */
  static stringifyJson(obj) {
    if (obj === null || obj === undefined) return null;
    
    try {
      return JSON.stringify(obj);
    } catch (error) {
      console.warn('Failed to stringify object to JSON:', error);
      return null;
    }
  }

  /**
   * Build WHERE clause from filters
   * @param {Object} filters - Filter object
   * @param {Array} params - Parameter array to populate
   * @param {number} startIndex - Starting parameter index
   * @returns {Object} - Object with whereClause and nextIndex
   */
  static buildWhereClause(filters, params, startIndex = 1) {
    const filterConditions = [];
    let paramIndex = startIndex;
    
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null) {
        // Handle special filter types
        if (key.endsWith('DateRange') && typeof value === 'object') {
          const field = key.replace('DateRange', '');
          if (value.start) {
            filterConditions.push(`${field} >= $${paramIndex}`);
            params.push(value.start);
            paramIndex++;
          }
          if (value.end) {
            filterConditions.push(`${field} <= $${paramIndex}`);
            params.push(value.end);
            paramIndex++;
          }
        } else {
          filterConditions.push(`${key} = $${paramIndex}`);
          params.push(value);
          paramIndex++;
        }
      }
    }
    
    const whereClause = filterConditions.length > 0 
      ? `WHERE ${filterConditions.join(' AND ')}` 
      : '';
    
    return {
      whereClause,
      nextIndex: paramIndex
    };
  }

  /**
   * Paginate results
   * @param {Array} items - Array of items
   * @param {number} limit - Number of items per page
   * @param {number} offset - Offset for pagination
   * @returns {Object} - Paginated result
   */
  static paginateResults(items, limit, offset) {
    const total = items.length;
    const paginatedItems = items.slice(offset, offset + limit);
    
    return {
      items: paginatedItems,
      total,
      limit,
      offset,
      hasNext: offset + limit < total,
      hasPrevious: offset > 0
    };
  }

  /**
   * Log service operation
   * @param {string} operation - Operation name
   * @param {Object} data - Operation data
   */
  static logOperation(operation, data = {}) {
    console.log(`[Service Operation] ${this.name}.${operation}`, data);
  }

  /**
   * Handle service error
   * @param {Error} error - Error object
   * @param {string} operation - Operation name
   * @param {Object} context - Context data
   */
  static handleError(error, operation, context = {}) {
    console.error(`[Service Error] ${this.name}.${operation}`, {
      error: error.message,
      stack: error.stack,
      context
    });
    
    // Re-throw the error for proper handling upstream
    throw error;
  }
}

module.exports = BaseService;