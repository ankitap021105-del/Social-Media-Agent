// ============================================================
//  data.js  –  All mock/sample data for AI Social Media Agent
// ============================================================

const MOCK_PLATFORMS = ["Instagram", "X (Twitter)", "Facebook", "LinkedIn"];

const MOCK_POSTS = [
  {
    id: 1, platform: "Instagram", author: "@techwave_studio",
    avatar: "https://ui-avatars.com/api/?name=TechWave&background=e1306c&color=fff&size=48",
    content: "🚀 Just launched our new AI-powered design tool! Try it free for 30 days. Link in bio. #AIDesign #ProductLaunch #TechStartup",
    image: "https://picsum.photos/seed/post1/600/400",
    likes: 3842, comments: 217, shares: 489, time: "2h ago",
    sentiment: "positive", sentimentScore: 0.91,
    hashtags: ["#AIDesign", "#ProductLaunch", "#TechStartup"],
    reach: 24500
  },
  {
    id: 2, platform: "X (Twitter)", author: "@dev_chronicles",
    avatar: "https://ui-avatars.com/api/?name=DevC&background=1da1f2&color=fff&size=48",
    content: "Hot take: TypeScript will replace JavaScript completely in enterprise within 3 years. Change my mind. #TypeScript #JavaScript #WebDev",
    image: null,
    likes: 1204, comments: 432, shares: 876, time: "4h ago",
    sentiment: "neutral", sentimentScore: 0.54,
    hashtags: ["#TypeScript", "#JavaScript", "#WebDev"],
    reach: 18200
  },
  {
    id: 3, platform: "Facebook", author: "Creative Minds Agency",
    avatar: "https://ui-avatars.com/api/?name=Creative&background=1877f2&color=fff&size=48",
    content: "We're thrilled to announce our partnership with 3 Fortune 500 companies this quarter! 🎉 Hard work truly pays off. Thank you to our amazing team! #Growth #Partnership #Success",
    image: "https://picsum.photos/seed/post3/600/400",
    likes: 2156, comments: 98, shares: 341, time: "6h ago",
    sentiment: "positive", sentimentScore: 0.88,
    hashtags: ["#Growth", "#Partnership", "#Success"],
    reach: 31200
  },
  {
    id: 4, platform: "LinkedIn", author: "Sarah Mitchell",
    avatar: "https://ui-avatars.com/api/?name=Sarah+M&background=0a66c2&color=fff&size=48",
    content: "After 10 years in corporate, I finally made the leap to entrepreneurship. Scared? Absolutely. Excited? Even more so. If you're on the fence – just jump. 💼 #Entrepreneurship #CareerChange #Leadership",
    image: null,
    likes: 5621, comments: 734, shares: 1203, time: "8h ago",
    sentiment: "positive", sentimentScore: 0.85,
    hashtags: ["#Entrepreneurship", "#CareerChange", "#Leadership"],
    reach: 42800
  },
  {
    id: 5, platform: "Instagram", author: "@foodie_adventures",
    avatar: "https://ui-avatars.com/api/?name=Foodie&background=f77737&color=fff&size=48",
    content: "This ramen place is absolutely INSANE 🍜🔥 3-hour wait but 100% worth it! Drop a 🍜 if you want the location! #FoodPhotography #Ramen #FoodieLife",
    image: "https://picsum.photos/seed/post5/600/400",
    likes: 7243, comments: 1089, shares: 234, time: "10h ago",
    sentiment: "positive", sentimentScore: 0.94,
    hashtags: ["#FoodPhotography", "#Ramen", "#FoodieLife"],
    reach: 56300
  },
  {
    id: 6, platform: "X (Twitter)", author: "@crypto_analyst99",
    avatar: "https://ui-avatars.com/api/?name=CryptoA&background=f7931a&color=fff&size=48",
    content: "Market down 12% this week. Panic selling is the worst decision you can make. Remember: volatility is the price you pay for long-term gains. HODL! 📉➡️📈 #Crypto #Bitcoin #Investing",
    image: null,
    likes: 892, comments: 267, shares: 543, time: "12h ago",
    sentiment: "neutral", sentimentScore: 0.48,
    hashtags: ["#Crypto", "#Bitcoin", "#Investing"],
    reach: 12400
  },
  {
    id: 7, platform: "LinkedIn", author: "DataViz Corp",
    avatar: "https://ui-avatars.com/api/?name=DataViz&background=0a66c2&color=fff&size=48",
    content: "Announcing our Q3 report: 240% growth in AI adoption across SMEs. The future is data-driven and it's arriving faster than predicted. Read the full report. #DataScience #AI #BusinessGrowth",
    image: "https://picsum.photos/seed/post7/600/400",
    likes: 3102, comments: 456, shares: 892, time: "1d ago",
    sentiment: "positive", sentimentScore: 0.87,
    hashtags: ["#DataScience", "#AI", "#BusinessGrowth"],
    reach: 38700
  },
  {
    id: 8, platform: "Facebook", author: "Nature's Eye Photography",
    avatar: "https://ui-avatars.com/api/?name=NaturesEye&background=42a567&color=fff&size=48",
    content: "Golden hour never disappoints 🌅 Captured this at Lake Tahoe last evening. Sometimes you just have to put the camera down and breathe it all in. #NaturePhotography #GoldenHour #LakeTahoe",
    image: "https://picsum.photos/seed/post8/600/400",
    likes: 4897, comments: 312, shares: 789, time: "1d ago",
    sentiment: "positive", sentimentScore: 0.93,
    hashtags: ["#NaturePhotography", "#GoldenHour", "#LakeTahoe"],
    reach: 29400
  }
];

const MOCK_ANALYTICS = {
  weeklyReach: [12400, 18900, 15300, 22100, 19800, 27400, 31200],
  weeklyEngagement: [840, 1240, 980, 1560, 1320, 1890, 2140],
  weeklyLabels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  platformBreakdown: { Instagram: 38, "X (Twitter)": 24, Facebook: 21, LinkedIn: 17 },
  sentimentBreakdown: { Positive: 68, Neutral: 22, Negative: 10 },
  topPerformingTime: "7 PM – 9 PM",
  avgEngagementRate: "4.7%",
  totalFollowers: 128400,
  totalPosts: 342,
  monthlyGrowth: [4200, 5100, 4800, 6200, 7100, 8400, 9200, 10100, 11300, 12800, 14200, 16400],
  monthlyLabels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
  postTypePerformance: {
    labels: ["Image Post", "Video Post", "Story/Reel", "Text Only", "Carousel"],
    data: [42, 28, 18, 7, 5]
  }
};

const MOCK_TRENDING_HASHTAGS = [
  { tag: "#AIRevolution", posts: "2.4M", growth: "+34%", trending: true },
  { tag: "#TechTuesday", posts: "1.8M", growth: "+12%", trending: true },
  { tag: "#StartupLife", posts: "3.1M", growth: "+8%", trending: false },
  { tag: "#DigitalMarketing", posts: "5.6M", growth: "+21%", trending: true },
  { tag: "#ContentCreator", posts: "4.2M", growth: "+15%", trending: true },
  { tag: "#GrowthHacking", posts: "980K", growth: "+44%", trending: true },
  { tag: "#FutureOfWork", posts: "1.2M", growth: "+19%", trending: false },
  { tag: "#SocialMediaTips", posts: "2.9M", growth: "+7%", trending: false },
  { tag: "#BrandStrategy", posts: "760K", growth: "+28%", trending: true },
  { tag: "#MachineLeaning", posts: "3.8M", growth: "+31%", trending: true },
  { tag: "#WebDesign2025", posts: "540K", growth: "+52%", trending: true },
  { tag: "#CreativeMarketing", posts: "1.4M", growth: "+9%", trending: false }
];

const MOCK_BEST_TIMES = {
  Instagram:  [
    { day: "Monday",    time: "6–9 AM",   score: 72 },
    { day: "Tuesday",   time: "11 AM–1 PM", score: 85 },
    { day: "Wednesday", time: "7–9 PM",   score: 92 },
    { day: "Thursday",  time: "7–9 PM",   score: 89 },
    { day: "Friday",    time: "11 AM–1 PM", score: 78 },
    { day: "Saturday",  time: "9 AM–11 AM", score: 81 },
    { day: "Sunday",    time: "5–7 PM",   score: 74 }
  ],
  "X (Twitter)": [
    { day: "Monday",    time: "8–10 AM",  score: 80 },
    { day: "Tuesday",   time: "8–10 AM",  score: 87 },
    { day: "Wednesday", time: "12–2 PM",  score: 91 },
    { day: "Thursday",  time: "8–10 AM",  score: 84 },
    { day: "Friday",    time: "4–6 PM",   score: 76 },
    { day: "Saturday",  time: "9 AM–12 PM", score: 69 },
    { day: "Sunday",    time: "10 AM–12 PM", score: 65 }
  ],
  Facebook: [
    { day: "Monday",    time: "1–4 PM",   score: 78 },
    { day: "Tuesday",   time: "1–4 PM",   score: 82 },
    { day: "Wednesday", time: "1–4 PM",   score: 88 },
    { day: "Thursday",  time: "8–10 AM",  score: 84 },
    { day: "Friday",    time: "1–4 PM",   score: 79 },
    { day: "Saturday",  time: "12–2 PM",  score: 70 },
    { day: "Sunday",    time: "12–2 PM",  score: 68 }
  ],
  LinkedIn: [
    { day: "Monday",    time: "7–9 AM",   score: 83 },
    { day: "Tuesday",   time: "10 AM–12 PM", score: 91 },
    { day: "Wednesday", time: "10 AM–12 PM", score: 94 },
    { day: "Thursday",  time: "10 AM–12 PM", score: 89 },
    { day: "Friday",    time: "7–9 AM",   score: 77 },
    { day: "Saturday",  time: "10 AM–12 PM", score: 42 },
    { day: "Sunday",    time: "10 AM–12 PM", score: 38 }
  ]
};

const MOCK_COMPETITORS = [
  {
    name: "BrandAlpha",
    handle: "@brandalpha",
    avatar: "https://ui-avatars.com/api/?name=BrandAlpha&background=6366f1&color=fff&size=48",
    followers: 245800,
    avgEngagement: "5.2%",
    postsPerWeek: 14,
    topPlatform: "Instagram",
    growthRate: "+3.1%",
    strengths: ["Visual content", "Reels/Stories", "Influencer collab"],
    weaknesses: ["Low LinkedIn presence", "Slow response time"]
  },
  {
    name: "ViralNexus",
    handle: "@viralnexus",
    avatar: "https://ui-avatars.com/api/?name=ViralNexus&background=ec4899&color=fff&size=48",
    followers: 189300,
    avgEngagement: "6.8%",
    postsPerWeek: 21,
    topPlatform: "X (Twitter)",
    growthRate: "+5.7%",
    strengths: ["Viral threads", "Meme marketing", "Trending topics"],
    weaknesses: ["Inconsistent branding", "No long-form content"]
  },
  {
    name: "ContentForge",
    handle: "@contentforge",
    avatar: "https://ui-avatars.com/api/?name=ContentForge&background=14b8a6&color=fff&size=48",
    followers: 312400,
    avgEngagement: "3.9%",
    postsPerWeek: 10,
    topPlatform: "LinkedIn",
    growthRate: "+2.3%",
    strengths: ["Thought leadership", "Case studies", "B2B content"],
    weaknesses: ["Low Instagram engagement", "Rarely uses video"]
  }
];

const AI_CAPTION_TEMPLATES = {
  product: [
    "Introducing {TOPIC} — built for those who refuse to settle. 🚀 Tap the link in bio to explore. #{TAG1} #{TAG2} #{TAG3}",
    "Meet your new favorite: {TOPIC} ✨ The wait is finally over. #{TAG1} #{TAG2} #{TAG3}",
    "Big news! {TOPIC} is now live and ready to change the game. 🎯 #{TAG1} #{TAG2} #{TAG3}"
  ],
  motivational: [
    "Every expert was once a beginner. Keep going with {TOPIC}. 💪 #{TAG1} #{TAG2} #{TAG3}",
    "Success doesn't happen overnight — but it starts today. {TOPIC} ✨ #{TAG1} #{TAG2} #{TAG3}",
    "Your breakthrough is one decision away. Start now with {TOPIC}. 🔥 #{TAG1} #{TAG2} #{TAG3}"
  ],
  educational: [
    "Did you know? {TOPIC} is reshaping the industry. Here's what you need to know 👇 #{TAG1} #{TAG2} #{TAG3}",
    "3 things about {TOPIC} that will change your perspective forever: #{TAG1} #{TAG2} #{TAG3}",
    "The ultimate guide to {TOPIC} — save this post! 📌 #{TAG1} #{TAG2} #{TAG3}"
  ],
  lifestyle: [
    "Living the {TOPIC} life ☀️ Tag someone who needs to see this! #{TAG1} #{TAG2} #{TAG3}",
    "{TOPIC} — because you deserve the best moments in life. 🌟 #{TAG1} #{TAG2} #{TAG3}",
    "This is what {TOPIC} looks like when it's done right 💯 #{TAG1} #{TAG2} #{TAG3}"
  ]
};

const HASHTAG_SUGGESTIONS = {
  tech: ["#TechTrends", "#Innovation", "#AI", "#FutureTech", "#DigitalTransformation", "#TechStartup", "#Coding", "#DevLife"],
  marketing: ["#DigitalMarketing", "#ContentStrategy", "#SocialMediaMarketing", "#BrandGrowth", "#MarketingTips", "#GrowthHacking"],
  lifestyle: ["#LifestyleGoals", "#DailyInspiration", "#MindsetMatters", "#WellnessJourney", "#GoodVibes", "#PositiveVibes"],
  business: ["#Entrepreneurship", "#BusinessGrowth", "#Leadership", "#StartupLife", "#CEO", "#BusinessTips", "#Success"],
  food: ["#FoodPhotography", "#FoodieLife", "#Foodstagram", "#EatWell", "#FoodLovers", "#Delicious"],
  travel: ["#TravelLife", "#Wanderlust", "#TravelPhotography", "#ExploreTheWorld", "#TravelGoals", "#Adventure"],
  general: ["#Trending", "#Viral", "#MustSee", "#DailyPost", "#Inspiration", "#Goals", "#Motivation"]
};

const SENTIMENT_KEYWORDS = {
  positive: ["amazing", "love", "awesome", "great", "fantastic", "excellent", "wonderful", "thrilled", "excited", "happy",
             "launch", "growth", "success", "win", "best", "top", "new", "innovative", "breakthrough", "celebrate"],
  negative: ["bad", "terrible", "awful", "hate", "worst", "disappointed", "failed", "crash", "down", "loss",
             "problem", "issue", "bug", "error", "complaint", "sorry", "unfortunately", "sad", "angry", "frustrating"],
  neutral:  ["update", "change", "think", "maybe", "consider", "plan", "according", "report", "data", "analysis",
             "market", "price", "time", "day", "week", "month", "year", "company", "business", "product"]
};

const SCHEDULED_POSTS = [
  { id: 1, platform: "Instagram", content: "New product reveal — are you ready? 🚀", scheduledFor: "Today, 7:00 PM", status: "scheduled" },
  { id: 2, platform: "LinkedIn",  content: "Our Q4 growth report is here. Key insights inside.", scheduledFor: "Tomorrow, 10:00 AM", status: "scheduled" },
  { id: 3, platform: "X (Twitter)", content: "Thread: 10 AI tools you should be using in 2025 🧵", scheduledFor: "Wed, 9:00 AM", status: "draft" },
  { id: 4, platform: "Facebook", content: "Community poll: What content do you want to see from us?", scheduledFor: "Thu, 1:00 PM", status: "scheduled" }
];
