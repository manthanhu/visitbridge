export interface Testimonial {
  id: string
  name: string
  college: string
  year: string
  avatar: string
  company: string
  quote: string
  role: string
}

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Priya Sharma",
    college: "IIT Bombay",
    year: "2025",
    avatar: "PS",
    company: "Google",
    quote: "The Google campus visit through VisitBridge was the turning point in my career. I got to speak with the exact team I'd later intern with. No career fair comes close.",
    role: "SWE Intern → Full-time",
  },
  {
    id: "t2",
    name: "Arjun Mehta",
    college: "BITS Pilani",
    year: "2025",
    avatar: "AM",
    company: "Microsoft",
    quote: "I was skeptical about paying for a company visit, but the Azure workshop gave me hands-on experience I couldn't get anywhere else. Got a PPO within two months.",
    role: "Cloud Engineer Intern",
  },
  {
    id: "t3",
    name: "Sneha Reddy",
    college: "IIIT Hyderabad",
    year: "2026",
    avatar: "SR",
    company: "NVIDIA",
    quote: "Seeing GPU clusters up close and talking to CUDA engineers in person made everything I'd studied click. The visit literally shaped my thesis research direction.",
    role: "Research Intern",
  },
  {
    id: "t4",
    name: "Rahul Desai",
    college: "VIT Vellore",
    year: "2025",
    avatar: "RD",
    company: "Flipkart",
    quote: "My college never had a direct pipeline to Flipkart. VisitBridge made that connection possible. I visited, impressed a hiring manager, and now I'm on their ML team.",
    role: "ML Engineer",
  },
  {
    id: "t5",
    name: "Ananya Gupta",
    college: "DTU Delhi",
    year: "2026",
    avatar: "AG",
    company: "PhonePe",
    quote: "The fintech workshop completely changed my understanding of payments at scale. The engineers were so open about their architecture decisions. Incredible experience.",
    role: "Backend Intern",
  },
  {
    id: "t6",
    name: "Karthik Nair",
    college: "NIT Trichy",
    year: "2025",
    avatar: "KN",
    company: "Amazon",
    quote: "I traveled from Trichy to Hyderabad for the Alexa visit. Best investment I've made. The mock interviews alone were worth 10x the fee. Got my offer two weeks later.",
    role: "SDE-1",
  },
  {
    id: "t7",
    name: "Divya Patel",
    college: "COEP Pune",
    year: "2026",
    avatar: "DP",
    company: "Adobe",
    quote: "As a design-focused engineer, the Creative Cloud visit was a dream. Seeing how Firefly AI is built, getting my portfolio reviewed by Adobe designers — unmatched.",
    role: "UX Engineer Intern",
  },
  {
    id: "t8",
    name: "Vikram Singh",
    college: "IIT Delhi",
    year: "2025",
    avatar: "VS",
    company: "Zomato",
    quote: "I always thought food delivery was simple tech. The logistics optimization talk at Zomato blew my mind. Real-time routing for 2M+ daily orders is insane engineering.",
    role: "Platform Engineer",
  },
]
