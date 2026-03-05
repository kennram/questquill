/**
 * QuestQuill Pre-Deployment Health Check 🚀
 * 
 * Run this script to verify your Supabase configuration and environment 
 * variables are ready for production.
 * 
 * Usage: node scripts/health-check.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const chalk = {
  blue: (t) => `\x1b[34m${t}\x1b[0m`,
  green: (t) => `\x1b[32m${t}\x1b[0m`,
  red: (t) => `\x1b[31m${t}\x1b[0m`,
  yellow: (t) => `\x1b[33m${t}\x1b[0m`,
  bold: (t) => `\x1b[1m${t}\x1b[22m`
};

async function checkHealth() {
  console.log(chalk.bold('\n🖋️ QuestQuill Pre-Deployment Health Check\n'));

  const envs = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'GEMINI_API_KEY',
    'ELEVENLABS_API_KEY',
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET'
  ];

  let envOk = true;
  console.log(chalk.blue('🔍 Checking Environment Variables...'));
  envs.forEach(env => {
    if (process.env[env]) {
      console.log(`  ${chalk.green('✓')} ${env} is set`);
    } else {
      console.log(`  ${chalk.red('✗')} ${env} is MISSING`);
      envOk = false;
    }
  });

  if (!envOk) {
    console.log(chalk.yellow('\n⚠️ Warning: Some critical environment variables are missing.\n'));
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.log(chalk.red('CRITICAL: Cannot connect to Supabase without URL and Service Role Key.'));
    return;
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  console.log(chalk.blue('\n🗄️ Checking Database Schema...'));
  const tables = ['profiles', 'children', 'stories', 'vocabulary', 'challenge_logs', 'stickers', 'map_discoveries'];
  
  for (const table of tables) {
    const { error } = await supabase.from(table).select('*').limit(1);
    if (error && error.code === '42P01') {
      console.log(`  ${chalk.red('✗')} Table "${table}" does NOT exist`);
    } else {
      console.log(`  ${chalk.green('✓')} Table "${table}" found`);
    }
  }

  console.log(chalk.blue('\n🎓 Checking Pedagogical Columns...'));
  
  const childCols = ['reading_level', 'avatar_url', 'last_completed_mission', 'completed_missions', 'explorer_level', 'gems'];
  for (const col of childCols) {
    const { error: targetedError } = await supabase.from('children').select(col).limit(1);
    if (targetedError) {
      console.log(`  ${chalk.red('✗')} Column "${col}" is MISSING in "children" table`);
    } else {
      console.log(`  ${chalk.green('✓')} Column "${col}" found in "children"`);
    }
  }

  const profileCols = ['class_mission', 'class_missions', 'class_code'];
  for (const col of profileCols) {
    const { error: targetedError } = await supabase.from('profiles').select(col).limit(1);
    if (targetedError) {
      console.log(`  ${chalk.red('✗')} Column "${col}" is MISSING in "profiles" table`);
    } else {
      console.log(`  ${chalk.green('✓')} Column "${col}" found in "profiles"`);
    }
  }

  console.log(chalk.blue('\n📦 Checking Storage Buckets...'));
  const buckets = ['avatars', 'stories'];
  for (const b of buckets) {
    const { data: bucket, error: bError } = await supabase.storage.getBucket(b);
    if (bError) {
      console.log(`  ${chalk.red('✗')} Bucket "${b}" is MISSING or inaccessible`);
    } else {
      console.log(`  ${chalk.green('✓')} Bucket "${b}" found (${bucket.public ? 'Public' : 'Private'})`);
      if (!bucket.public) {
        console.log(chalk.yellow(`    ⚠️ Warning: Bucket "${b}" should be PUBLIC for avatar/story images.`));
      }
    }
  }

  console.log(chalk.bold('\n✅ Health Check Complete!\n'));
}

checkHealth();
