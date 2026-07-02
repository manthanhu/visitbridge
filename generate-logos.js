/* eslint-disable */
const fs = require('fs');
const path = require('path');
const simpleIcons = require('simple-icons');

const dir = path.join(__dirname, 'public', 'logos');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// Multi-colored SVGs manually provided for brands that Simple-Icons only offers in monochrome
const multiColorLogos = {
  'google': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>`,
  'microsoft': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#f35325" d="M11.4 0H0v11.4h11.4V0z"/><path fill="#81bc06" d="M24 0H12.6v11.4H24V0z"/><path fill="#05a6f0" d="M11.4 12.6H0V24h11.4V12.6z"/><path fill="#ffba08" d="M24 12.6H12.6V24H24V12.6z"/></svg>`,
  // Adding specific paths for brands that Simple-Icons removed
  'adobe': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#FF0000" d="M15.1 2H24v20L15.1 2zM8.9 2H0v20L8.9 2zM12 9.4L17.6 22h-4.3l-1.6-4.3H8.3L12 9.4z"/></svg>`,
  'oracle': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#F80000" d="M16.8 3.52c-4.48 0-8.2 1.4-10.96 4.12C3.04 10.4 1.6 14.28 1.6 18.72h4.8c0-3.16 1.04-5.88 3.08-7.92 2.08-2.04 4.8-3.08 8-3.08V3.52zM16.8 12.32c-1.8 0-3.32.64-4.6 1.88C10.88 15.48 10.2 17 10.2 18.72h4.8c0-.44.16-.84.44-1.12.28-.32.64-.44 1.12-.44v-4.8z"/></svg>`,
  'ibm': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#0530AD" d="M0 0h24v24H0z" fill-opacity="0"/><path fill="#0530AD" d="M0 18.667v1.866h7.525v-1.866H0zM0 14.933v1.867h7.525v-1.867H0zM0 11.2v1.867h7.525V11.2H0zM0 7.467v1.866h7.525V7.467H0zM0 3.733v1.867h7.525V3.733H0zM10.885 3.733h6.634c.732 0 1.266.191 1.602.573.336.382.504.91.504 1.583v.59h-5.018v-2.746h-3.722v2.746h-1.077V3.733h1.077zm4.514 14.934v1.866h-4.514v-1.866h4.514zm-.792-3.734h-3.722v1.867h5.018v-.59c0-.673-.168-1.201-.504-1.583-.336-.382-.87-.573-1.602-.573h.81zM10.885 11.2h3.722v1.867h-3.722V11.2zm3.722-3.733h-3.722v1.866h3.722V7.467zm6.758-3.734h2.635V5.6h-2.635v-1.867zm0 14.934h2.635v1.866h-2.635v-1.866zm0-3.734h2.635v1.867h-2.635V14.933zm0-3.733h2.635v1.867h-2.635V11.2zm0-3.733h2.635v1.866h-2.635V7.467z"/></svg>`,
  'salesforce': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#00A1E0" d="M16.6 6.8c-.5-2.4-2.6-4.1-5.1-4.1-2.1 0-3.9 1.2-4.7 3.1-1.2-.4-2.5-.2-3.4.6C2.3 7.5 1.8 9 2.1 10.5c-1.3.8-2.1 2.3-2 3.8.1 1.9 1.7 3.4 3.6 3.4h15.2c2.8 0 5-2.2 5-5 0-2.5-1.8-4.5-4.2-4.9-.4-2.2-2.5-3.8-4.8-3.8z"/></svg>`
};

const brands = [
  'google', 'microsoft', 'nvidia', 'adobe', 'amazon', 'intel', 
  'oracle', 'ibm', 'cisco', 'samsung', 'qualcomm', 'dell', 'amd', 
  'meta', 'salesforce', 'spotify', 'netflix', 'uber', 'atlassian', 
  'paytm', 'razorpay', 'swiggy', 'zomato', 'flipkart', 'stripe', 'vercel', 'apple', 'notion'
];

brands.forEach(brand => {
  if (multiColorLogos[brand]) {
    fs.writeFileSync(path.join(dir, `${brand}.svg`), multiColorLogos[brand]);
    console.log(`Generated ${brand}.svg (from multiColorLogos)`);
    return;
  }

  // Find in simple-icons
  let searchName = brand;
  if (brand === 'apple') searchName = 'apple';
  
  const icon = Object.values(simpleIcons).find(i => i.slug === brand || i.title.toLowerCase() === brand);
  
  if (icon) {
    const hex = icon.hex;
    let fillHex = hex === '000000' || hex === '111111' ? 'FFFFFF' : hex; // Convert black logos to white for dark mode
    if (brand === 'apple' || brand === 'vercel' || brand === 'notion' || brand === 'uber') fillHex = 'FFFFFF'; // Force white for these
    if (brand === 'cisco') fillHex = '1BA0D7';
    if (brand === 'amazon') fillHex = 'FF9900';

    let svg = icon.svg.replace('<svg ', `<svg fill="#${fillHex}" `);
    fs.writeFileSync(path.join(dir, `${brand}.svg`), svg);
    console.log(`Generated ${brand}.svg (#${fillHex})`);
  } else {
    console.log(`WARNING: Icon not found for ${brand}`);
  }
});
