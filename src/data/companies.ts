export type VisitType = "INTERNSHIP" | "PLACEMENT" | "WORKSHOP" | "EVENT"
export type VisitStatus = "OPEN" | "FILLING_FAST" | "ALMOST_FULL" | "SCHEDULED" | "COMPLETED"

export interface Company {
  id: string
  name: string
  logo: string
  industry: string
  location: string
  description: string
  website: string
  employeeCount: string
  visitCount: number
}

export const companies: Company[] = [
  {
    id: "google",
    name: "Google",
    logo: "G",
    industry: "Technology",
    location: "Bengaluru, KA",
    description: "Google's India development center working on Search, Cloud, AI/ML, and Android. One of the largest engineering offices outside the US.",
    website: "https://about.google",
    employeeCount: "10,000+",
    visitCount: 12,
  },
  {
    id: "microsoft",
    name: "Microsoft",
    logo: "M",
    industry: "Technology",
    location: "Hyderabad, TS",
    description: "Microsoft India Development Center is a major R&D hub working on Azure, Office 365, AI, and enterprise solutions.",
    website: "https://microsoft.com",
    employeeCount: "8,000+",
    visitCount: 9,
  },
  {
    id: "nvidia",
    name: "NVIDIA",
    logo: "N",
    industry: "Semiconductors & AI",
    location: "Bengaluru, KA",
    description: "NVIDIA India focuses on GPU architecture, deep learning frameworks, autonomous driving, and next-gen computing hardware.",
    website: "https://nvidia.com",
    employeeCount: "4,000+",
    visitCount: 5,
  },
  {
    id: "adobe",
    name: "Adobe",
    logo: "A",
    industry: "Creative Software",
    location: "Noida, UP",
    description: "Adobe India is the company's largest R&D center outside the US, working on Creative Cloud, Document Cloud, and Experience Cloud.",
    website: "https://adobe.com",
    employeeCount: "6,000+",
    visitCount: 7,
  },
  {
    id: "flipkart",
    name: "Flipkart",
    logo: "F",
    industry: "E-Commerce",
    location: "Bengaluru, KA",
    description: "India's leading e-commerce marketplace, handling millions of orders daily with cutting-edge logistics and recommendation systems.",
    website: "https://flipkart.com",
    employeeCount: "30,000+",
    visitCount: 14,
  },
  {
    id: "phonepe",
    name: "PhonePe",
    logo: "P",
    industry: "Fintech",
    location: "Bengaluru, KA",
    description: "India's leading digital payments platform processing billions of transactions. Pioneering UPI payments and financial services.",
    website: "https://phonepe.com",
    employeeCount: "5,000+",
    visitCount: 6,
  },
  {
    id: "zomato",
    name: "Zomato",
    logo: "Z",
    industry: "Food Tech",
    location: "Gurugram, HR",
    description: "India's largest food delivery and restaurant discovery platform. Engineering excellence in logistics, ML recommendations, and hyperlocal commerce.",
    website: "https://zomato.com",
    employeeCount: "5,000+",
    visitCount: 8,
  },
  {
    id: "meesho",
    name: "Meesho",
    logo: "Me",
    industry: "Social Commerce",
    location: "Bengaluru, KA",
    description: "Democratizing internet commerce for small businesses and individuals. India's fastest-growing e-commerce platform.",
    website: "https://meesho.com",
    employeeCount: "2,000+",
    visitCount: 4,
  },
  {
    id: "amazon",
    name: "Amazon",
    logo: "Am",
    industry: "Technology & E-Commerce",
    location: "Hyderabad, TS",
    description: "Amazon's largest tech hub outside Seattle. Working on Alexa, AWS, retail technology, and last-mile delivery innovations.",
    website: "https://amazon.in",
    employeeCount: "15,000+",
    visitCount: 11,
  },
  {
    id: "swiggy",
    name: "Swiggy",
    logo: "S",
    industry: "Food & Delivery",
    location: "Bengaluru, KA",
    description: "India's leading on-demand delivery platform covering food, groceries, and more. Engineering logistics at massive scale.",
    website: "https://swiggy.com",
    employeeCount: "6,000+",
    visitCount: 7,
  },
  {
    id: "tcs",
    name: "TCS",
    logo: "T",
    industry: "IT Services & Consulting",
    location: "Mumbai, MH",
    description: "India's largest IT services company offering consulting, technology, and digital solutions across industries worldwide.",
    website: "https://tcs.com",
    employeeCount: "600,000+",
    visitCount: 20,
  },
  {
    id: "infosys",
    name: "Infosys",
    logo: "I",
    industry: "IT Services & Consulting",
    location: "Bengaluru, KA",
    description: "A global leader in digital services and consulting enabling clients across 56 countries to navigate digital transformation.",
    website: "https://infosys.com",
    employeeCount: "340,000+",
    visitCount: 18,
  },
]
