import { parseRoute, getPathForPortal, ROUTE_METADATA } from '../src/services/router.js';

const testCases = [
  // 1. Home / Gateway
  { path: '/', hash: '', search: '', expected: { portal: 'gateway', tab: null, cleanPath: '/', metaKey: 'gateway' } },
  { path: '/home', hash: '', search: '', expected: { portal: 'gateway', tab: null, cleanPath: '/', metaKey: 'gateway' } },
  { path: '', hash: '', search: '', expected: { portal: 'gateway', tab: null, cleanPath: '/', metaKey: 'gateway' } },

  // 2. Hardware Store
  { path: '/store', hash: '', search: '', expected: { portal: 'iot', tab: 'store', cleanPath: '/store', metaKey: 'iot_store' } },
  { path: '/store/', hash: '', search: '', expected: { portal: 'iot', tab: 'store', cleanPath: '/store', metaKey: 'iot_store' } },
  { path: '/iot', hash: '', search: '', expected: { portal: 'iot', tab: 'store', cleanPath: '/store', metaKey: 'iot_store' } },
  { path: '/hardware', hash: '', search: '', expected: { portal: 'iot', tab: 'store', cleanPath: '/store', metaKey: 'iot_store' } },
  { path: '/shop', hash: '', search: '', expected: { portal: 'iot', tab: 'store', cleanPath: '/store', metaKey: 'iot_store' } },
  { path: '/', hash: '', search: '?portal=iot', expected: { portal: 'iot', tab: 'store', cleanPath: '/store', metaKey: 'iot_store' } },

  // 3. Store Tabs
  { path: '/about', hash: '', search: '', expected: { portal: 'iot', tab: 'about', cleanPath: '/about', metaKey: 'iot_about' } },
  { path: '/store/about', hash: '', search: '', expected: { portal: 'iot', tab: 'about', cleanPath: '/about', metaKey: 'iot_about' } },
  { path: '/contracts', hash: '', search: '', expected: { portal: 'iot', tab: 'contracts', cleanPath: '/contracts', metaKey: 'iot_contracts' } },
  { path: '/store/contracts', hash: '', search: '', expected: { portal: 'iot', tab: 'contracts', cleanPath: '/contracts', metaKey: 'iot_contracts' } },
  { path: '/delivery', hash: '', search: '', expected: { portal: 'iot', tab: 'delivery', cleanPath: '/delivery', metaKey: 'iot_delivery' } },
  { path: '/store/delivery', hash: '', search: '', expected: { portal: 'iot', tab: 'delivery', cleanPath: '/delivery', metaKey: 'iot_delivery' } },
  { path: '/policies', hash: '', search: '', expected: { portal: 'iot', tab: 'policies', cleanPath: '/policies', metaKey: 'iot_policies' } },
  { path: '/store/policies', hash: '', search: '', expected: { portal: 'iot', tab: 'policies', cleanPath: '/policies', metaKey: 'iot_policies' } },
  { path: '/faq', hash: '', search: '', expected: { portal: 'iot', tab: 'faq', cleanPath: '/faq', metaKey: 'iot_faq' } },
  { path: '/store/faq', hash: '', search: '', expected: { portal: 'iot', tab: 'faq', cleanPath: '/faq', metaKey: 'iot_faq' } },

  // 4. Web Development Studio
  { path: '/web', hash: '', search: '', expected: { portal: 'web', tab: null, cleanPath: '/web', metaKey: 'web' } },
  { path: '/web-development', hash: '', search: '', expected: { portal: 'web', tab: null, cleanPath: '/web', metaKey: 'web' } },
  { path: '/software', hash: '', search: '', expected: { portal: 'web', tab: null, cleanPath: '/web', metaKey: 'web' } },
  { path: '/services', hash: '', search: '', expected: { portal: 'web', tab: null, cleanPath: '/web', metaKey: 'web' } },
  { path: '/', hash: '', search: '?portal=web', expected: { portal: 'web', tab: null, cleanPath: '/web', metaKey: 'web' } },

  // 5. Admin Portal
  { path: '/admin', hash: '', search: '', expected: { portal: 'admin', tab: null, cleanPath: '/admin', metaKey: 'admin' } },
  { path: '/', hash: '#admin', search: '', expected: { portal: 'admin', tab: null, cleanPath: '/admin', metaKey: 'admin' } },
  { path: '/', hash: '', search: '?portal=admin', expected: { portal: 'admin', tab: null, cleanPath: '/admin', metaKey: 'admin' } }
];

let failed = 0;
console.log('🧪 Testing Router Path Parsing...\n');

for (const tc of testCases) {
  const result = parseRoute(tc.path, tc.hash, tc.search);
  const match = (
    result.portal === tc.expected.portal &&
    result.tab === tc.expected.tab &&
    result.cleanPath === tc.expected.cleanPath &&
    result.metaKey === tc.expected.metaKey
  );

  if (match) {
    console.log(`✅ PASS: path="${tc.path}" hash="${tc.hash}" search="${tc.search}" -> portal=${result.portal} cleanPath=${result.cleanPath} tab=${result.tab}`);
  } else {
    failed++;
    console.error(`❌ FAIL: path="${tc.path}" hash="${tc.hash}" search="${tc.search}"`);
    console.error(`   Expected:`, tc.expected);
    console.error(`   Actual:  `, result);
  }
}

console.log('\n🧪 Testing Path Generation for Portals & Tabs...\n');
const pathCases = [
  { portal: 'gateway', tab: null, expected: '/' },
  { portal: 'web', tab: null, expected: '/web' },
  { portal: 'admin', tab: null, expected: '/admin' },
  { portal: 'iot', tab: 'store', expected: '/store' },
  { portal: 'iot', tab: 'about', expected: '/about' },
  { portal: 'iot', tab: 'contracts', expected: '/contracts' },
  { portal: 'iot', tab: 'delivery', expected: '/delivery' },
  { portal: 'iot', tab: 'policies', expected: '/policies' },
  { portal: 'iot', tab: 'faq', expected: '/faq' },
];

for (const pc of pathCases) {
  const path = getPathForPortal(pc.portal, pc.tab);
  if (path === pc.expected) {
    console.log(`✅ PASS: getPathForPortal('${pc.portal}', '${pc.tab}') -> "${path}"`);
  } else {
    failed++;
    console.error(`❌ FAIL: getPathForPortal('${pc.portal}', '${pc.tab}') -> "${path}", expected "${pc.expected}"`);
  }
}

console.log('\n🧪 Testing Metadata Integrity...\n');
for (const [key, meta] of Object.entries(ROUTE_METADATA)) {
  if (meta.title && meta.description && meta.canonical) {
    console.log(`✅ PASS: Metadata key "${key}" has title, description, and canonical: ${meta.canonical}`);
  } else {
    failed++;
    console.error(`❌ FAIL: Metadata key "${key}" missing required tags:`, meta);
  }
}

if (failed === 0) {
  console.log('\n🎉 ALL ROUTER TESTS PASSED WITH 100% SUCCESS!');
  process.exit(0);
} else {
  console.error(`\n❌ ${failed} tests failed!`);
  process.exit(1);
}
