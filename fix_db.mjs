import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ogottjnxqctpbvybldqx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nb3R0am54cWN0cGJ2eWJsZHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5NDE1ODQsImV4cCI6MjA2ODUxNzU4NH0.KfBLz-U_cDu2TYy8YNDpeqGhDgryYGp6KVTiTXcgffw';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function migrate() {
  const { data, error } = await supabase.from('fhhf_site_content').select('*').in('section_key', ['our_story', 'team_section', 'faq_section']);
  if (error) { console.error(error); return; }
  
  for (const row of data) {
    let changed = false;
    let newContent = { ...row.content };
    
    if (row.section_key === 'our_story' && newContent.blocks && newContent.blocks.blocks) {
      newContent.blocks = newContent.blocks.blocks;
      changed = true;
    }
    if (row.section_key === 'team_section' && newContent.teamMembers && newContent.teamMembers.teamMembers) {
      newContent.teamMembers = newContent.teamMembers.teamMembers;
      changed = true;
    }
    if (row.section_key === 'faq_section' && newContent.faqs && newContent.faqs.faqs) {
      newContent.faqs = newContent.faqs.faqs;
      changed = true;
    }
    
    if (changed) {
      console.log(`Updating ${row.section_key}...`);
      await supabase.from('fhhf_site_content').update({ content: newContent }).eq('id', row.id);
    }
  }
  console.log('Done data migration!');
}

migrate();
