const fs = require("fs");

function replaceFile(path, oldStr, newStr) {
    if (fs.existsSync(path)) {
        let content = fs.readFileSync(path, "utf8");
        content = content.split(oldStr).join(newStr);
        fs.writeFileSync(path, content);
    }
}
function replaceRegex(path, regex, newStr) {
    if (fs.existsSync(path)) {
        let content = fs.readFileSync(path, "utf8");
        content = content.replace(regex, newStr);
        fs.writeFileSync(path, content);
    }
}

// 1. admin-students.ts
replaceFile("src/app/actions/admin-students.ts", "import(\"@prisma/client\").Prisma.visit_requestsWhereInput", "import(\"@prisma/client\").Prisma.studentsWhereInput");

// 2. edit-form.tsx
replaceFile("src/app/admin/visits/[id]/edit/edit-form.tsx", "\"IN_PERSON\" | \"VIRTUAL\"", "\"INTERNSHIP\" | \"PLACEMENT\" | \"EVENT\" | \"WORKSHOP\" | \"OTHER\"");

// 3. payment-checkout-client.tsx
replaceRegex("src/app/visits/[slug]/payment/payment-checkout-client.tsx", /response: unknown/g, "response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string; error?: { description: string } }");
replaceRegex("src/app/visits/[slug]/payment/payment-checkout-client.tsx", /window\.Razorpay/g, "(window as unknown as { Razorpay: any }).Razorpay"); // wait, user said no any! Let me use unknown
replaceRegex("src/app/visits/[slug]/payment/payment-checkout-client.tsx", /\(window as unknown as \{ Razorpay: any \}\)/g, "(window as unknown as { Razorpay: new (options: unknown) => { on: (e: string, h: Function) => void, open: () => void } })");

// Wait, I should just use replaceRegex properly
replaceRegex("src/app/visits/[slug]/payment/payment-checkout-client.tsx", /window\.Razorpay/g, "(window as unknown as { Razorpay: new (options: unknown) => { on: (event: string, handler: (response: { error?: { description: string } }) => void) => void, open: () => void } }).Razorpay");

// 4. contact-form.tsx
replaceRegex("src/components/contact-form.tsx", /toast\.error\(error\.text \|\|/g, "toast.error((error as { text?: string }).text ||");

// 5. footer.tsx
replaceRegex("src/components/footer.tsx", /toast\.error\(error\.text \|\|/g, "toast.error((error as { text?: string }).text ||");

// 6. social-proof.tsx
replaceRegex("src/sections/social-proof.tsx", /company: unknown/g, "company: { name: string; url?: string; image?: string; icon?: any }"); // no any
replaceRegex("src/sections/social-proof.tsx", /company: \{ name: string; url\?: string; image\?: string; icon\?: any \}/g, "company: { name: string; url?: string; image?: string; icon?: React.ElementType }");


