// Quick test to query schedules from InstantDB
const { init } = require('@instantdb/admin');

const db = init({
  appId: '4917b6f7-7d29-4705-9730-f24ea3f19a3f',
  adminToken: 'c04d2fa4-fbfe-4928-a111-ec7df06eb4ac',
});

async function testQuery() {
  try {
    const result = await db.query({ schedules: {} });
    console.log('✅ Query successful!');
    console.log('Schedules found:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testQuery();
