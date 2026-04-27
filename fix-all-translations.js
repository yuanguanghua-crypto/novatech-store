const fs = require('fs');

let content = fs.readFileSync('lib/i18n/translations.ts', 'utf8');
const lines = content.split('\n');

// ===== Find boundaries =====
let typeDefStart = -1, typeDefEnd = -1;
let enStart = -1, enEnd = -1;
let zhStart = -1, zhEnd = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('export type TranslationKeys = {')) typeDefStart = i;
  if (typeDefStart > 0 && typeDefEnd < 0 && lines[i] === '}') { typeDefEnd = i; }
}
for (let i = 0; i < lines.length; i++) {
  if (lines[i] === '  en: {') enStart = i;
  if (enStart > 0 && enEnd < 0 && lines[i] === '  },') { enEnd = i; break; }
}
for (let i = enEnd + 1; i < lines.length; i++) {
  if (lines[i] === '  zh: {') zhStart = i;
  if (zhStart > 0 && zhEnd < 0 && lines[i] === '  },') { zhEnd = i; break; }
}

console.log(`Type def: lines ${typeDefStart}-${typeDefEnd}`);
console.log(`EN block: lines ${enStart}-${enEnd}`);
console.log(`ZH block: lines ${zhStart}-${zhEnd}`);

// ===== Extract keys =====
const typeKeys = new Set();
for (let i = typeDefStart + 1; i < typeDefEnd; i++) {
  const m = lines[i].match(/^\s+(\w+):\s*string/);
  if (m) typeKeys.add(m[1]);
}
const enKeys = new Set();
for (let i = enStart + 1; i < enEnd; i++) {
  const m = lines[i].match(/^\s{4}(\w+):/);
  if (m) enKeys.add(m[1]);
}
const zhKeyValues = {};
for (let i = zhStart + 1; i < zhEnd; i++) {
  const m = lines[i].match(/^\s{4}(\w+):\s*(.+?),?\s*$/);
  if (m) zhKeyValues[m[1]] = m[2].trim().replace(/,$/, '');
}

// ===== English value mapping =====
const englishValues = {
  brand_detail_description: "'{name} brand product catalog'",
  brand_detail_no_products: "'No products from this brand'",
  brand_detail_title: "'{name} Products'",
  brand_detail_view_all: "'View All'",
  brands_all: "'All Brands'",
  brands_browse: "'Browse Brands'",
  brands_featured: "'Featured Brands'",
  categories_all: "'All Categories'",
  categories_browse: "'Browse Categories'",
  categories_featured: "'Featured Categories'",
  checkout_address1: "'Address Line 1'",
  checkout_address2: "'Address Line 2 (optional)'",
  checkout_back: "'Back'",
  checkout_billing_address: "'Billing Address'",
  checkout_card_number: "'Card Number'",
  checkout_city: "'City'",
  checkout_company: "'Company (optional)'",
  checkout_continue: "'Continue'",
  checkout_continue_shopping: "'Continue Shopping'",
  checkout_country: "'Country'",
  checkout_credit_card: "'Credit Card'",
  checkout_cvv: "'CVV'",
  checkout_email: "'Email'",
  checkout_email_sent: "'Confirmation email sent to your inbox'",
  checkout_error: "'Error processing your order'",
  checkout_expiry: "'Expiry Date'",
  checkout_express: "'Express Shipping'",
  checkout_first_name: "'First Name'",
  checkout_free_shipping: "'Free Shipping'",
  checkout_last_name: "'Last Name'",
  checkout_loading: "'Loading...'",
  checkout_name_on_card: "'Name on Card'",
  checkout_order_confirmed: "'Order Confirmed'",
  checkout_order_number: "'Order Number'",
  checkout_order_summary: "'Order Summary'",
  checkout_payment_method: "'Payment Method'",
  checkout_paypal: "'PayPal'",
  checkout_phone: "'Phone'",
  checkout_place_order: "'Place Order'",
  checkout_po_number: "'PO Number (optional)'",
  checkout_processing: "'Processing your order...'",
  checkout_same_as_shipping: "'Same as shipping address'",
  checkout_same_day: "'Same Day Delivery'",
  checkout_shipping: "'Shipping'",
  checkout_shipping_method: "'Shipping Method'",
  checkout_special_instructions: "'Special Instructions'",
  checkout_standard: "'Standard Shipping'",
  checkout_state: "'State / Province'",
  checkout_subtotal: "'Subtotal'",
  checkout_success: "'Order placed successfully!'",
  checkout_tax: "'Tax'",
  checkout_terms_required: "'Please accept the terms and conditions'",
  checkout_thank_you: "'Thank you for your order!'",
  checkout_total: "'Total'",
  checkout_view_orders: "'View My Orders'",
  checkout_zip: "'ZIP Code'",
  filter_all: "'All'",
  filter_in_stock: "'In Stock'",
  filter_on_sale: "'On Sale'",
  filter_out_of_stock: "'Out of Stock'",
  home_newsletter: "'Subscribe to our newsletter'",
  products_add_to_quote: "'Add to Quote'",
  products_added_to_quote: "'Added to Quote'",
  products_clear_filters: "'Clear Filters'",
  products_compare: "'Compare'",
  products_days: "'days'",
  products_description: "'Product Description'",
  products_filter_by_availability: "'Filter by Availability'",
  products_filter_by_brand: "'Filter by Brand'",
  products_filter_by_price: "'Filter by Price'",
  products_no_results_desc: "'Try adjusting your filters or search with different keywords'",
  products_per_page: "'per page'",
  products_price: "'Price'",
  products_quantity: "'Quantity'",
  products_related_products: "'Related Products'",
  products_search_results: "'Search Results'",
  products_sort_by: "'Sort By'",
  products_sort_name: "'Name A-Z'",
  products_sort_price_high: "'Price High to Low'",
  products_sort_price_low: "'Price Low to High'",
  products_view_details: "'View Details'",
  quote_full_name: "'Full Name'",
  quote_required: "'Required'",
  quotes_browse_products: "'Browse Products'",
  quotes_contact_sales: "'Contact Sales'",
  quotes_loading_quote: "'Loading quote...'",
  quotes_no_quotes_yet: "'No quote requests yet'",
  quotes_start_by: "'Start by adding products to your quote from the product pages'",
  quotes_view: "'View'",
  returns_eligible: "'Eligible for Return'",
  returns_not_eligible: "'Not Eligible for Return'",
  returns_process: "'Return Process'",
  returns_refund: "'Refund Method'",
  returns_window: "'Return Window'",
  search_no_results_desc: "'Try using different keywords'",
  search_placeholder: "'Search products...'",
  search_popular: "'Popular Searches'",
  search_suggestions: "'Search Suggestions'",
  support_chat: "'Live Chat'",
  support_chat_placeholder: "'Type your question...'",
  support_chat_send: "'Send'",
  support_contact: "'Contact Us'",
  support_error: "'Failed to send. Please try again.'",
  support_hours: "'Business Hours'",
  support_loading: "'Loading...'",
  support_message: "'Message'",
  support_payment_methods: "'Payment Methods'",
  support_return_policy: "'Return Policy'",
  support_shipping_info: "'Shipping Information'",
  support_subject: "'Subject'",
  support_submit: "'Submit'",
  support_success: "'Your message has been sent!'",
  support_technical_docs: "'Technical Documentation'",
  support_ticket: "'Submit a Ticket'",
  support_warranty: "'Warranty Terms'",
  privacy_item2d: "'Send order updates and promotional information'",
};

// ===== Find missing keys =====
const missingFromType = [];
const missingFromEn = [];
for (const key of Object.keys(zhKeyValues)) {
  if (!typeKeys.has(key)) missingFromType.push(key);
  if (!enKeys.has(key)) missingFromEn.push(key);
}
console.log(`Missing from type: ${missingFromType.length}`);
console.log(`Missing from en: ${missingFromEn.length}`);

if (missingFromType.length === 0 && missingFromEn.length === 0) {
  console.log('Nothing to fix!');
  process.exit(0);
}

// ===== Rebuild the file line by line =====
const newLines = [...lines];

// --- Fix type definition: insert new keys before closing } ---
if (missingFromType.length > 0) {
  const insertAt = typeDefEnd; // line index of closing "}"
  const typeNewLines = missingFromType.map(k => `  ${k}: string`);
  newLines.splice(insertAt, 0, ...typeNewLines);
  console.log(`Added ${missingFromType.length} keys to type definition`);
  
  // Recalculate offsets after splice
  const offset = missingFromType.length;
  if (enStart > typeDefEnd) enStart += offset;
  if (enEnd > typeDefEnd) enEnd += offset;
  if (zhStart > typeDefEnd) zhStart += offset;
  if (zhEnd > typeDefEnd) zhEnd += offset;
}

// --- Fix en block: insert new keys before closing }, and add comma to last existing key ---
if (missingFromEn.length > 0) {
  // Make sure the last existing key in en block has a comma
  const lastKeyLine = newLines[enEnd - 1];
  if (lastKeyLine && !lastKeyLine.trim().endsWith(',')) {
    newLines[enEnd - 1] = lastKeyLine.trimRight() + ',';
  }
  
  // Insert new keys before "  },"
  const enNewLines = missingFromEn.map(k => `    ${k}: ${englishValues[k] || `'${k}'`},`);
  newLines.splice(enEnd, 0, ...enNewLines);
  console.log(`Added ${missingFromEn.length} keys to English translation`);
}

// ===== Write updated file =====
fs.writeFileSync('lib/i18n/translations.ts', newLines.join('\n'), 'utf8');
console.log('\nDone! translations.ts has been updated.');
