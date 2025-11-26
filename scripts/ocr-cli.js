#!/usr/bin/env node

/**
 * OCR CLI - Interactive Command Line Interface
 * Easy-to-use menu for OCR operations
 */

import readline from 'readline';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function showMenu() {
  console.clear();
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║            OCR Command Line Tool                 ║');
  console.log('╚══════════════════════════════════════════════════╝');
  console.log('');
  console.log('What would you like to do?');
  console.log('');
  console.log('  1. 📄 Extract text from a single file');
  console.log('  2. 📚 Process multiple files (batch)');
  console.log('  3. 🧪 Test OCR setup');
  console.log('  4. 🌍 Change language settings');
  console.log('  5. ℹ️  View help and documentation');
  console.log('  6. 🚪 Exit');
  console.log('');
}

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function runCommand(command, args = []) {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, {
      stdio: 'inherit',
      shell: true
    });
    
    proc.on('close', code => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });
  });
}

async function singleFileExtraction() {
  console.log('\n📄 Single File Extraction\n');
  
  const filePath = await question('Enter the path to your image/PDF: ');
  
  if (!fs.existsSync(filePath)) {
    console.log('❌ File not found!');
    await question('\nPress Enter to continue...');
    return;
  }
  
  const saveToFile = await question('Save to file? (y/n, default: n): ');
  
  let args = [filePath];
  
  if (saveToFile.toLowerCase() === 'y') {
    const defaultOutput = path.basename(filePath, path.extname(filePath)) + '.txt';
    const outputPath = await question(`Output file (default: ${defaultOutput}): `);
    args.push('--output', outputPath || defaultOutput);
  }
  
  const lang = await question('Language (default: eng, or spa, fra, deu, etc.): ');
  if (lang) {
    args.push('--lang', lang);
  }
  
  console.log('\n⏳ Processing...\n');
  
  try {
    await runCommand('node', ['scripts/ocr-extract.js', ...args]);
    await question('\nPress Enter to continue...');
  } catch (error) {
    console.error('❌ Error:', error.message);
    await question('\nPress Enter to continue...');
  }
}

async function batchProcessing() {
  console.log('\n📚 Batch Processing\n');
  
  const inputDir = await question('Enter the input directory path: ');
  
  if (!fs.existsSync(inputDir)) {
    console.log('❌ Directory not found!');
    await question('\nPress Enter to continue...');
    return;
  }
  
  const outputDir = await question('Output directory (default: ./ocr-output): ');
  
  let args = [inputDir];
  if (outputDir) {
    args.push(outputDir);
  }
  
  const lang = await question('Language (default: eng): ');
  if (lang) {
    args.push('--lang', lang);
  }
  
  console.log('\n⏳ Processing multiple files...\n');
  
  try {
    await runCommand('node', ['scripts/ocr-batch.js', ...args]);
    await question('\nPress Enter to continue...');
  } catch (error) {
    console.error('❌ Error:', error.message);
    await question('\nPress Enter to continue...');
  }
}

async function testSetup() {
  console.log('\n🧪 Testing OCR Setup\n');
  
  try {
    await runCommand('node', ['scripts/ocr-test.js']);
    await question('\nPress Enter to continue...');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    await question('\nPress Enter to continue...');
  }
}

async function languageSettings() {
  console.log('\n🌍 Language Settings\n');
  console.log('Common language codes:');
  console.log('  eng - English (default)');
  console.log('  spa - Spanish');
  console.log('  fra - French');
  console.log('  deu - German');
  console.log('  ita - Italian');
  console.log('  por - Portuguese');
  console.log('  rus - Russian');
  console.log('  ara - Arabic');
  console.log('  chi_sim - Chinese (Simplified)');
  console.log('  jpn - Japanese');
  console.log('');
  console.log('To use a language, add --lang <code> to your command');
  console.log('Example: node scripts/ocr-extract.js file.jpg --lang spa');
  
  await question('\nPress Enter to continue...');
}

async function viewHelp() {
  console.log('\n📖 Help & Documentation\n');
  console.log('For detailed documentation, see: OCR-SETUP.md');
  console.log('');
  console.log('Quick Commands:');
  console.log('  npm run ocr:test                    - Test OCR setup');
  console.log('  npm run ocr:extract <file>          - Extract text from file');
  console.log('  npm run ocr:batch <dir>             - Process directory');
  console.log('');
  console.log('Direct Script Usage:');
  console.log('  node scripts/ocr-extract.js <file> [options]');
  console.log('  node scripts/ocr-batch.js <dir> [output-dir] [options]');
  console.log('');
  console.log('Options:');
  console.log('  --lang <code>     OCR language');
  console.log('  --output <file>   Save to file');
  console.log('  --json           JSON output');
  console.log('  --help           Show help');
  
  await question('\nPress Enter to continue...');
}

async function main() {
  while (true) {
    showMenu();
    const choice = await question('Choose an option (1-6): ');
    
    switch (choice.trim()) {
      case '1':
        await singleFileExtraction();
        break;
      case '2':
        await batchProcessing();
        break;
      case '3':
        await testSetup();
        break;
      case '4':
        await languageSettings();
        break;
      case '5':
        await viewHelp();
        break;
      case '6':
        console.log('\n👋 Goodbye!\n');
        rl.close();
        return;
      default:
        console.log('\n❌ Invalid option. Please choose 1-6.');
        await question('Press Enter to continue...');
    }
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  rl.close();
  process.exit(1);
});
