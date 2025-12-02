/**
 * Utility functions for the legal assistant
 */

/**
 * Format output with colors and styling
 */
function formatOutput(text, style = 'normal') {
  const styles = {
    success: '\x1b[32m',    // Green
    error: '\x1b[31m',      // Red
    warning: '\x1b[33m',    // Yellow
    info: '\x1b[36m',       // Cyan
    highlight: '\x1b[35m',  // Magenta
    bold: '\x1b[1m',
    reset: '\x1b[0m'
  };

  const styleCode = styles[style] || '';
  const reset = styles.reset;

  return `${styleCode}${text}${reset}`;
}

/**
 * Create a simple table for displaying data
 */
function createTable(headers, rows) {
  const columnWidths = headers.map((header, i) => {
    const maxRowWidth = Math.max(...rows.map(row => String(row[i] || '').length));
    return Math.max(header.length, maxRowWidth);
  });

  const separator = '─';
  
  let table = '\n';
  
  // Header
  table += headers.map((header, i) => 
    header.padEnd(columnWidths[i])
  ).join(' │ ');
  table += '\n';
  
  // Separator
  table += columnWidths.map(width => separator.repeat(width)).join('─┼─');
  table += '\n';
  
  // Rows
  rows.forEach(row => {
    table += row.map((cell, i) => 
      String(cell || '').padEnd(columnWidths[i])
    ).join(' │ ');
    table += '\n';
  });
  
  return table;
}

/**
 * Validate date string
 */
function validateDate(dateString) {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

/**
 * Format bytes to human readable size
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Truncate text to specified length
 */
function truncate(text, maxLength = 50) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Display a loading spinner
 */
function createSpinner(message) {
  const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  let i = 0;
  
  const interval = setInterval(() => {
    process.stdout.write(`\r${frames[i]} ${message}`);
    i = (i + 1) % frames.length;
  }, 80);
  
  return {
    stop: () => {
      clearInterval(interval);
      process.stdout.write('\r\x1b[K'); // Clear line
    }
  };
}

/**
 * Prompt for user confirmation
 */
async function confirm(message) {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  try {
    return await new Promise((resolve) => {
      readline.question(`${message} (y/n): `, (answer) => {
        resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
      });
    });
  } finally {
    readline.close();
  }
}

/**
 * Display a box around text
 */
function createBox(text, title = null) {
  const lines = text.split('\n');
  const maxLength = Math.max(...lines.map(l => l.length), title ? title.length : 0);
  
  const topBorder = '╔' + '═'.repeat(maxLength + 2) + '╗';
  const bottomBorder = '╚' + '═'.repeat(maxLength + 2) + '╝';
  
  let box = topBorder + '\n';
  
  if (title) {
    box += '║ ' + title.padEnd(maxLength) + ' ║\n';
    box += '╠' + '═'.repeat(maxLength + 2) + '╣\n';
  }
  
  lines.forEach(line => {
    box += '║ ' + line.padEnd(maxLength) + ' ║\n';
  });
  
  box += bottomBorder;
  
  return box;
}

/**
 * Display progress bar
 */
function createProgressBar(current, total, width = 40) {
  const percentage = (current / total) * 100;
  const filled = Math.round((width * current) / total);
  const empty = width - filled;
  
  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  return `[${bar}] ${Math.round(percentage)}% (${current}/${total})`;
}

/**
 * Parse command line arguments
 */
function parseArgs(args) {
  const parsed = {
    flags: {},
    positional: []
  };
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg.startsWith('--')) {
      const key = arg.substring(2);
      const nextArg = args[i + 1];
      
      if (nextArg && !nextArg.startsWith('-')) {
        parsed.flags[key] = nextArg;
        i++;
      } else {
        parsed.flags[key] = true;
      }
    } else if (arg.startsWith('-')) {
      parsed.flags[arg.substring(1)] = true;
    } else {
      parsed.positional.push(arg);
    }
  }
  
  return parsed;
}

/**
 * Print section header
 */
function printHeader(text) {
  console.log('\n' + formatOutput('═'.repeat(50), 'info'));
  console.log(formatOutput(text.toUpperCase(), 'bold'));
  console.log(formatOutput('═'.repeat(50), 'info') + '\n');
}

/**
 * Print success message
 */
function printSuccess(message) {
  console.log(formatOutput('✓ ' + message, 'success'));
}

/**
 * Print error message
 */
function printError(message) {
  console.error(formatOutput('✗ ' + message, 'error'));
}

/**
 * Print warning message
 */
function printWarning(message) {
  console.log(formatOutput('⚠ ' + message, 'warning'));
}

/**
 * Print info message
 */
function printInfo(message) {
  console.log(formatOutput('ℹ ' + message, 'info'));
}

module.exports = {
  formatOutput,
  createTable,
  validateDate,
  formatBytes,
  truncate,
  createSpinner,
  confirm,
  createBox,
  createProgressBar,
  parseArgs,
  printHeader,
  printSuccess,
  printError,
  printWarning,
  printInfo
};
