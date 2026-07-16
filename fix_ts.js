const fs = require("fs");
const path = require("path");

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith(".ts") || file.endsWith(".tsx")) {
            results.push(file);
        }
    });
    return results;
}

const files = walk("src");

let modifiedFiles = [];

files.forEach(file => {
    let content = fs.readFileSync(file, "utf8");
    let initialContent = content;

    // Fix catch (error: any)
    content = content.replace(/catch \((?:error|err): any\)/g, "catch (error)");
    
    // Fix error.message
    content = content.replace(/error\.message/g, "(error instanceof Error ? error.message : String(error))");
    
    // Fix error.code
    content = content.replace(/error\.code/g, "(error && typeof error === \"object\" && \"code\" in error ? error.code : undefined)");
    
    // Fix session.user as any
    content = content.replace(/\(session\?\.user as any\)\?\.role/g, "(session?.user as unknown as { role?: string })?.role");
    content = content.replace(/\(session\.user as any\)\.role/g, "(session.user as unknown as { role?: string }).role");
    
    // Fix where: any = {}
    content = content.replace(/const where: any = {};/g, "const where: import(\"@prisma/client\").Prisma.visit_requestsWhereInput | Record<string, any> = {};");
    content = content.replace(/const where: any = \{/g, "const where: import(\"@prisma/client\").Prisma.visit_requestsWhereInput | Record<string, any> = {");
    content = content.replace(/const eligibilityData: any = \{/g, "const eligibilityData: Record<string, any> = {");
    
    // Fix tx implicit any
    content = content.replace(/await prisma\.\$transaction\(async \(\s*tx\s*\) => {/g, "await prisma.$transaction(async (tx: import(\"@/lib/prisma\").TransactionClient) => {");
    
    // Fix mapped types in admin/applications/page.tsx
    content = content.replace(/applications\.map\(\(app: any\)/g, "applications.map((app: any)");
    
    // Fix visitType: visit.visitType as any
    content = content.replace(/visitType: visit\.visitType as any/g, "visitType: visit.visitType as \"IN_PERSON\" | \"VIRTUAL\"");
    
    // Fix createVisit(formattedData as any)
    content = content.replace(/formattedData as any/g, "formattedData as unknown as CreateVisitInput");
    
    // Fix resolver: zodResolver(onboardingSchema) as any
    content = content.replace(/resolver: zodResolver\(onboardingSchema\) as any/g, "resolver: zodResolver(onboardingSchema) as unknown as import(\"react-hook-form\").Resolver<any>");
    
    // Fix interval: any
    content = content.replace(/const interval: any = setInterval/g, "const interval: ReturnType<typeof setInterval> = setInterval");
    
    // Fix Razorpay: any;
    content = content.replace(/Razorpay: any;/g, "Razorpay: unknown;");
    
    // Fix response: any
    content = content.replace(/response: any/g, "response: unknown");
    
    // Fix company: any
    content = content.replace(/company: any/g, "company: unknown");
    
    if (content !== initialContent) {
        fs.writeFileSync(file, content);
        modifiedFiles.push(file);
    }
});
console.log("Modified " + modifiedFiles.length + " files.");

