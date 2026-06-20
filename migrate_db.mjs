const SUPABASE_URL = 'https://ogottjnxqctpbvybldqx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nb3R0am54cWN0cGJ2eWJsZHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5NDE1ODQsImV4cCI6MjA2ODUxNzU4NH0.KfBLz-U_cDu2TYy8YNDpeqGhDgryYGp6KVTiTXcgffw';

async function migrate() {
  console.log('Fetching rows to migrate...');
  
  const getUrl = `${SUPABASE_URL}/rest/v1/fhhf_site_content?select=*&section_key=in.(our_story,team_section,faq_section)`;
  
  const getRes = await fetch(getUrl, {
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
    }
  });

  if (!getRes.ok) {
    console.error('Failed to fetch:', await getRes.text());
    return;
  }

  const rows = await getRes.json();
  console.log(`Found ${rows.length} rows to check.`);

  for (const row of rows) {
    let changed = false;
    let newContent = { ...row.content };
    
    // Flatten our_story blocks
    if (row.section_key === 'our_story' && newContent.blocks && newContent.blocks.blocks) {
      newContent.blocks = newContent.blocks.blocks;
      changed = true;
    }
    
    // Flatten team_section teamMembers
    if (row.section_key === 'team_section' && newContent.teamMembers && newContent.teamMembers.teamMembers) {
      newContent.teamMembers = newContent.teamMembers.teamMembers;
      changed = true;
    }
    
    // Flatten faq_section faqs
    if (row.section_key === 'faq_section' && newContent.faqs && newContent.faqs.faqs) {
      newContent.faqs = newContent.faqs.faqs;
      changed = true;
    }
    
    if (changed) {
      console.log(`Migrating double-nested data for section: ${row.section_key}...`);
      
      const patchUrl = `${SUPABASE_URL}/rest/v1/fhhf_site_content?id=eq.${row.id}`;
      const patchRes = await fetch(patchUrl, {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: newContent })
      });
      
      if (!patchRes.ok) {
        console.error(`Failed to patch ${row.section_key}:`, await patchRes.text());
      } else {
        console.log(`Successfully migrated ${row.section_key}!`);
      }
    } else {
      console.log(`Section ${row.section_key} is already clean.`);
    }
  }
  
  console.log('Migration complete!');
}

migrate();
