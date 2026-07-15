# 🚀 VisitBridge

<div align="center">
  <h3>Bridging the Gap between Campus and Corporate</h3>
  <p>Connecting students with high-impact industrial visits, empowering the next generation of talent with real-world exposure.</p>
</div>

---

## 📖 About The Project

VisitBridge is a modern web platform designed to streamline and automate the process of organizing, applying for, and managing industrial visits for students. By replacing fragmented communication with a centralized hub, it democratizes access to industry exposure and helps bridge the gap between academic learning and real-world corporate experience.

## ✨ Key Features

- **🎓 Student Dashboard**: A clean, glassmorphic UI where students can track active applications, upcoming visits, and profile completion.
- **🏢 Industrial Visits Hub**: Browse available opportunities from partner companies, view available seats, and apply instantly.
- **🔐 Secure Authentication**: Integrated with [Better Auth](https://better-auth.com/) for a seamless and secure sign-in process.
- **🛡️ Custom Admin Panel**: A fully protected, custom-authenticated admin panel to manage companies, student applications, and schedules.
- **💳 Payment Integration**: Handles seamless checkout and application fees via Razorpay.
- **✉️ Automated Emails**: Real-time newsletter subscriptions and support form handling powered by EmailJS.
- **✨ Premium UI/UX**: Built with TailwindCSS and Framer Motion for stunning micro-animations, glowing gradients, and responsive layouts.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Database / ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [Better Auth](https://better-auth.com/)
- **Payments**: Razorpay
- **Email Service**: [EmailJS](https://www.emailjs.com/)

---

## 🚀 Getting Started

Follow these instructions to set up the project locally on your machine.

### Prerequisites
Make sure you have Node.js installed. We recommend using `npm` or `pnpm`.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/manthanhu/visitbridge.git
   cd visitbridge
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and add the necessary keys:
   ```env
   # Database (PostgreSQL/Supabase)
   DATABASE_URL="your_database_url_here"

   # Authentication (Better Auth)
   BETTER_AUTH_SECRET="your_secret_key"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"

   # Payments
   RAZORPAY_KEY_ID="your_razorpay_key"
   RAZORPAY_KEY_SECRET="your_razorpay_secret"

   # EmailJS
   NEXT_PUBLIC_EMAILJS_SERVICE_ID="your_service_id"
   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID="your_template_id"
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY="your_public_key"
   ```

4. **Initialize Prisma (if applicable):**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application!

## 🔐 Admin Access
The admin panel is securely locked behind custom authentication. Attempting to navigate to `/admin` will automatically intercept the user and prompt them for the hardcoded admin credentials. 

---

<div align="center">
  <p>Built with ❤️ for students aiming higher.</p>
</div>
