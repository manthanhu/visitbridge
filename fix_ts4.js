const fs = require("fs");
function replaceRegex(path, regex, newStr) {
    if (fs.existsSync(path)) {
        let content = fs.readFileSync(path, "utf8");
        content = content.replace(regex, newStr);
        fs.writeFileSync(path, content);
    }
}

// social-proof.tsx
replaceRegex("src/sections/social-proof.tsx", /company: \{ name: string; url\?: string; image\?: string; icon\?: React\.ElementType \}/g, "company: { name: string; url?: string; image?: string; icon?: React.ElementType; visits?: number; location?: string; id?: string }");

// payment-checkout-client.tsx
replaceRegex("src/app/visits/[slug]/payment/payment-checkout-client.tsx", /response\.error\?\.description/g, "response.error?.description || \"\"");


