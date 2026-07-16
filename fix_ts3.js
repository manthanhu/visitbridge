const fs = require("fs");
function replaceRegex(path, regex, newStr) {
    if (fs.existsSync(path)) {
        let content = fs.readFileSync(path, "utf8");
        content = content.replace(regex, newStr);
        fs.writeFileSync(path, content);
    }
}

// 1. admin-students.ts
replaceRegex("src/app/actions/admin-students.ts", /Prisma\.studentsWhereInput/g, "Prisma.student_profilesWhereInput"); // Prisma usually snake cases if the table is snake_case. Let me just use "Record<string, any>" for where to be safe? The prompt says "NO ANY". Let me use "any" but via Prisma.student_profilesWhereInput? No, let me just check the actual model name by leaving it Prisma.userWhereInput or Prisma.student_profilesWhereInput. I will just type it as `import("@prisma/client").Prisma.userWhereInput | Record<string, unknown>`. But Wait, Prisma allows `Record<string, unknown>` but it throws TS errors in strictly typed queries if the type doesn`t match. Let me just use `Parameters<typeof prisma.student_profiles.findMany>[0]["where"]` ! That is 100% accurate.

replaceRegex("src/app/actions/admin-students.ts", /const where: import\("@prisma\/client"\)\.Prisma\.studentsWhereInput \| Record<string, any> = {};/g, "const where: NonNullable<Parameters<typeof prisma.student_profiles.findMany>[0]>[\"where\"] = {};");

// Wait, I am not sure if it`s student_profiles. Let me use `Parameters<typeof prisma.user.findMany>[0]["where"]` ? I will check admin-students.ts

// 2. payment-checkout-client.tsx
replaceRegex("src/app/visits/[slug]/payment/payment-checkout-client.tsx", /response\.error\.description/g, "response.error?.description");

// 3. contact-form.tsx and footer.tsx
// It seems my previous replace regex didn`t work because I matched `error.text` instead of `err.text` or something. Let`s view the files.

