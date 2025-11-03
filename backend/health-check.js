#!/usr/bin/env node

/**
 * Comprehensive Backend Health Check Script
 * Verifies all backend components and system functionality
 */

const fs = require('fs');
const path = require('path');
const db = require('./config/db');
require('dotenv').config({ path: __dirname + '/.env' });

const RESET = '\x1b[0m';
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';

class HealthCheckReport {
  constructor() {
    this.sections = [];
    this.totalIssues = 0;
    this.totalWarnings = 0;
    this.totalErrors = 0;
  }

  addSection(name) {
    const section = {
      name,
      items: [],
      passed: 0,
      failed: 0,
      warnings: 0
    };
    this.sections.push(section);
    return section;
  }

  addCheck(section, name, status, message = '', details = '') {
    const item = { name, status, message, details };
    section.items.push(item);
    
    if (status === 'PASS') {
      section.passed++;
    } else if (status === 'FAIL') {
      section.failed++;
      this.totalErrors++;
    } else if (status === 'WARN') {
      section.warnings++;
      this.totalWarnings++;
    }
    
    // Print immediately
    const icon = status === 'PASS' ? `${GREEN}✓${RESET}` : 
                 status === 'FAIL' ? `${RED}✗${RESET}` : 
                 `${YELLOW}⚠${RESET}`;
    const prefix = status === 'PASS' ? GREEN : status === 'FAIL' ? RED : YELLOW;
    console.log(`  ${icon} ${prefix}${name}${RESET}`);
    if (message) console.log(`    ${prefix}${message}${RESET}`);
    if (details) console.log(`    Details: ${details}`);
  }

  print() {
    console.log('\n' + '='.repeat(80));
    console.log(`${BLUE}BACKEND HEALTH CHECK REPORT${RESET}`);
    console.log('='.repeat(80) + '\n');

    for (const section of this.sections) {
      console.log(`\n${BLUE}${section.name}${RESET}`);
      console.log('-'.repeat(40));
      
      for (const item of section.items) {
        const icon = item.status === 'PASS' ? `${GREEN}✓${RESET}` : 
                     item.status === 'FAIL' ? `${RED}✗${RESET}` : 
                     `${YELLOW}⚠${RESET}`;
        console.log(`${icon} ${item.name}`);
        if (item.message) console.log(`  ${item.message}`);
        if (item.details) console.log(`  Details: ${item.details}`);
      }
      
      const passedStr = `${GREEN}Passed: ${section.passed}${RESET}`;
      const failedStr = section.failed > 0 ? ` | ${RED}Failed: ${section.failed}${RESET}` : '';
      const warnStr = section.warnings > 0 ? ` | ${YELLOW}Warnings: ${section.warnings}${RESET}` : '';
      console.log(`\n  ${passedStr}${failedStr}${warnStr}`);
    }

    console.log('\n' + '='.repeat(80));
    console.log(`${BLUE}SUMMARY${RESET}`);
    console.log('-'.repeat(40));
    console.log(`Total Errors: ${RED}${this.totalErrors}${RESET}`);
    console.log(`Total Warnings: ${YELLOW}${this.totalWarnings}${RESET}`);
    
    if (this.totalErrors === 0 && this.totalWarnings === 0) {
      console.log(`\n${GREEN}✓ All systems operational!${RESET}`);
    } else if (this.totalErrors === 0) {
      console.log(`\n${YELLOW}⚠ System operational with warnings${RESET}`);
    } else {
      console.log(`\n${RED}✗ System has critical issues${RESET}`);
    }
    console.log('='.repeat(80));
  }

  toMarkdown() {
    let md = '# Backend Health Check Report\n\n';
    md += `Generated: ${new Date().toISOString()}\n\n`;
    md += `**Summary:** ${this.totalErrors} Errors | ${this.totalWarnings} Warnings\n\n`;

    for (const section of this.sections) {
      md += `## ${section.name}\n\n`;
      md += `- ✓ Passed: ${section.passed}\n`;
      if (section.failed > 0) md += `- ✗ Failed: ${section.failed}\n`;
      if (section.warnings > 0) md += `- ⚠ Warnings: ${section.warnings}\n`;
      md += '\n';

      for (const item of section.items) {
        const icon = item.status === 'PASS' ? '✓' : item.status === 'FAIL' ? '✗' : '⚠';
        md += `### ${icon} ${item.name}\n\n`;
        if (item.message) md += `${item.message}\n\n`;
        if (item.details) md += `**Details:** ${item.details}\n\n`;
      }
    }

    return md;
  }
}

// Health check functions
const healthChecks = {
  async checkEnvironment(report) {
    const section = report.addSection('Environment Configuration');
    
    const requiredEnvVars = [
      'DATABASE_URL',
      'PORT',
      'JWT_SECRET',
      'SUPABASE_URL',
      'SUPABASE_ANON_KEY'
    ];

    for (const envVar of requiredEnvVars) {
      if (process.env[envVar]) {
        report.addCheck(section, `${envVar} configured`, 'PASS');
      } else {
        report.addCheck(section, `${envVar} configured`, 'FAIL', `Missing required environment variable: ${envVar}`);
      }
    }

    // Check JWT_SECRET strength
    const jwtSecret = process.env.JWT_SECRET;
    if (jwtSecret && jwtSecret.length < 32) {
      report.addCheck(section, 'JWT_SECRET strength', 'WARN', 
        `JWT_SECRET is less than 32 characters (current: ${jwtSecret.length})`,
        'Consider using a longer, more secure secret');
    } else if (jwtSecret) {
      report.addCheck(section, 'JWT_SECRET strength', 'PASS');
    }

    // Check NODE_ENV
    if (!process.env.NODE_ENV) {
      report.addCheck(section, 'NODE_ENV configured', 'WARN', 
        'NODE_ENV not set, defaults to development mode');
    } else {
      report.addCheck(section, 'NODE_ENV configured', 'PASS', `Mode: ${process.env.NODE_ENV}`);
    }
  },

  async checkDatabaseConnection(report) {
    const section = report.addSection('Database Connection');
    
    try {
      const result = await db.getConnectionTestResult();
      if (result.success) {
        report.addCheck(section, 'PostgreSQL connection', 'PASS', 
          `Successfully connected via ${result.method}`);
        
        // Try a simple query
        try {
          const queryResult = await db.query('SELECT NOW()');
          report.addCheck(section, 'Query execution', 'PASS', 'Successfully executed test query');
        } catch (queryError) {
          report.addCheck(section, 'Query execution', 'WARN', 
            'Test query failed but connection is active', queryError.message);
        }
      } else {
        report.addCheck(section, 'PostgreSQL connection', 'FAIL', 
          'Failed to establish database connection', result.error);
      }
    } catch (error) {
      report.addCheck(section, 'Database connection test', 'FAIL', 
        'Error running database tests', error.message);
    }

    // Check pool status
    try {
      const totalCount = db.totalCount();
      const idleCount = db.idleCount();
      const waitingCount = db.waitingCount();
      
      report.addCheck(section, 'Connection pool status', 'PASS',
        `Total: ${totalCount} | Idle: ${idleCount} | Waiting: ${waitingCount}`);
    } catch (error) {
      report.addCheck(section, 'Connection pool status', 'WARN', 
        'Could not retrieve pool statistics');
    }
  },

  async checkFileStructure(report) {
    const section = report.addSection('File Structure');
    
    const requiredDirs = [
      'config',
      'controllers',
      'middleware',
      'routes',
      'services',
      'models',
      'utils'
    ];

    for (const dir of requiredDirs) {
      const dirPath = path.join(__dirname, dir);
      if (fs.existsSync(dirPath)) {
        const files = fs.readdirSync(dirPath).length;
        report.addCheck(section, `${dir}/ directory`, 'PASS', `Contains ${files} files`);
      } else {
        report.addCheck(section, `${dir}/ directory`, 'FAIL', `Directory not found: ${dirPath}`);
      }
    }

    // Check critical files
    const criticalFiles = [
      'package.json',
      'config/db.js',
      'config/db-supabase.js'
    ];

    for (const file of criticalFiles) {
      const filePath = path.join(__dirname, file);
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        report.addCheck(section, `${file} exists`, 'PASS', `Size: ${stats.size} bytes`);
      } else {
        report.addCheck(section, `${file} exists`, 'FAIL', `File not found: ${filePath}`);
      }
    }
  },

  async checkDependencies(report) {
    const section = report.addSection('Dependencies');
    
    try {
      const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf-8'));
      const dependencies = packageJson.dependencies || {};
      const devDependencies = packageJson.devDependencies || {};
      
      report.addCheck(section, 'package.json readable', 'PASS', 
        `${Object.keys(dependencies).length} dependencies, ${Object.keys(devDependencies).length} dev dependencies`);

      // Check critical dependencies
      const criticalDeps = ['express', 'pg', 'jsonwebtoken', 'bcrypt', 'cors', 'dotenv'];
      for (const dep of criticalDeps) {
        if (dependencies[dep]) {
          report.addCheck(section, `${dep} installed`, 'PASS', `Version: ${dependencies[dep]}`);
        } else {
          report.addCheck(section, `${dep} installed`, 'FAIL', `Required dependency not found`);
        }
      }
    } catch (error) {
      report.addCheck(section, 'Dependencies check', 'FAIL', 'Could not read package.json', error.message);
    }
  },

  async checkRoutes(report) {
    const section = report.addSection('Routes Configuration');
    
    const routesDir = path.join(__dirname, 'routes');
    if (!fs.existsSync(routesDir)) {
      report.addCheck(section, 'Routes directory', 'FAIL', 'Routes directory not found');
      return;
    }

    const routeFiles = fs.readdirSync(routesDir).filter(f => f.endsWith('.js'));
    report.addCheck(section, 'Route files found', 'PASS', `${routeFiles.length} route files`);

    for (const file of routeFiles) {
      const filePath = path.join(routesDir, file);
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        if (content.includes('module.exports') || content.includes('router')) {
          report.addCheck(section, `routes/${file}`, 'PASS');
        } else {
          report.addCheck(section, `routes/${file}`, 'WARN', 'File does not appear to export a router');
        }
      } catch (error) {
        report.addCheck(section, `routes/${file}`, 'WARN', 'Error reading file', error.message);
      }
    }
  },

  async checkMiddleware(report) {
    const section = report.addSection('Middleware');
    
    const middlewareDir = path.join(__dirname, 'middleware');
    const requiredMiddleware = ['auth.js', 'errorHandler.js'];

    for (const file of requiredMiddleware) {
      const filePath = path.join(middlewareDir, file);
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        if (stats.size > 0) {
          report.addCheck(section, `${file}`, 'PASS', `Size: ${stats.size} bytes`);
        } else {
          report.addCheck(section, `${file}`, 'FAIL', 'File is empty');
        }
      } else {
        report.addCheck(section, `${file}`, 'FAIL', 'File not found');
      }
    }
  },

  async checkServices(report) {
    const section = report.addSection('Services');
    
    const servicesDir = path.join(__dirname, 'services');
    if (!fs.existsSync(servicesDir)) {
      report.addCheck(section, 'Services directory', 'FAIL', 'Services directory not found');
      return;
    }

    const serviceFiles = fs.readdirSync(servicesDir).filter(f => f.endsWith('.js'));
    report.addCheck(section, 'Service files count', 'PASS', `${serviceFiles.length} service files`);

    // Check critical services
    const criticalServices = ['authService.js', 'adminAuthService.js'];
    for (const service of criticalServices) {
      const filePath = path.join(servicesDir, service);
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        if (stats.size > 0) {
          report.addCheck(section, `${service}`, 'PASS');
        } else {
          report.addCheck(section, `${service}`, 'FAIL', 'File is empty');
        }
      } else {
        report.addCheck(section, `${service}`, 'FAIL', 'File not found');
      }
    }
  },

  async checkControllers(report) {
    const section = report.addSection('Controllers');
    
    const controllersDir = path.join(__dirname, 'controllers');
    if (!fs.existsSync(controllersDir)) {
      report.addCheck(section, 'Controllers directory', 'FAIL', 'Controllers directory not found');
      return;
    }

    const controllerFiles = fs.readdirSync(controllersDir).filter(f => f.endsWith('.js'));
    report.addCheck(section, 'Controller files count', 'PASS', `${controllerFiles.length} controller files`);

    // Check critical controllers
    const criticalControllers = ['authController.js'];
    for (const controller of criticalControllers) {
      const filePath = path.join(controllersDir, controller);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        if (content.includes('module.exports')) {
          report.addCheck(section, `${controller}`, 'PASS');
        } else {
          report.addCheck(section, `${controller}`, 'WARN', 'Does not appear to export a class/object');
        }
      } else {
        report.addCheck(section, `${controller}`, 'FAIL', 'File not found');
      }
    }
  },

  async checkServerSetup(report) {
    const section = report.addSection('Server Setup');
    
    const serverPath = path.join(__dirname, 'server.js');
    const stats = fs.statSync(serverPath);
    
    if (stats.size === 0) {
      report.addCheck(section, 'server.js exists', 'FAIL', 
        'server.js is empty and needs to be implemented',
        'The main server file is not configured');
    } else {
      const content = fs.readFileSync(serverPath, 'utf-8');
      if (content.includes('require') || content.includes('import')) {
        report.addCheck(section, 'server.js initialization', 'PASS');
      } else {
        report.addCheck(section, 'server.js initialization', 'FAIL', 
          'server.js does not contain proper Express configuration');
      }
    }

    // Check for .env file
    const envPath = path.join(__dirname, '.env');
    if (fs.existsSync(envPath)) {
      report.addCheck(section, '.env file exists', 'PASS');
    } else {
      report.addCheck(section, '.env file exists', 'FAIL', 
        '.env file not found - configuration is missing');
    }
  }
};

// Run all health checks
async function runHealthCheck() {
  console.log(`${BLUE}Starting Backend Health Check...${RESET}\n`);

  const report = new HealthCheckReport();

  // Run all checks
  await healthChecks.checkEnvironment(report);
  await healthChecks.checkDatabaseConnection(report);
  await healthChecks.checkFileStructure(report);
  await healthChecks.checkDependencies(report);
  await healthChecks.checkRoutes(report);
  await healthChecks.checkMiddleware(report);
  await healthChecks.checkServices(report);
  await healthChecks.checkControllers(report);
  await healthChecks.checkServerSetup(report);

  // Print report
  report.print();

  // Save markdown report
  const mdReport = report.toMarkdown();
  const reportPath = path.join(__dirname, '..', 'BACKEND_HEALTH_CHECK.md');
  fs.writeFileSync(reportPath, mdReport);
  console.log(`\n${GREEN}Detailed report saved to: BACKEND_HEALTH_CHECK.md${RESET}`);

  return report.totalErrors === 0;
}

// Run the health check
runHealthCheck().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error(`${RED}Health check failed:${RESET}`, error);
  process.exit(1);
});
