import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Newspaper, 
  ExternalLink, 
  Clock, 
  ChevronRight, 
  Search, 
  Loader2, 
  Stethoscope,
  Heart,
  Activity,
  ArrowLeft,
  X
} from 'lucide-react';

interface BlogPost {
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  source: string;
  url: string;
  imageUrl: string;
  date: string;
}

const STATIC_POSTS: BlogPost[] = [
  {
    title: "The Future of Synthetic Biology in Organ Regeneration",
    excerpt: "How breakthrough researchers are utilizing CRISPR-Cas12 and bioprinted scaffold matrices to accelerate vascular tissue grafting in clinical settings.",
    category: "Science",
    readTime: "8 min",
    source: "Lancet Digital Health",
    url: "#",
    imageUrl: "https://picsum.photos/seed/regen/800/600",
    date: new Date().toDateString()
  },
  {
    title: "Metabolic Flexibility: Beyond the Ketogenic Diet",
    excerpt: "Understanding mitochondrial efficiency and how dynamic fueling intervals improve chronic glycemic control and insulin sensitivity markers.",
    category: "Nutrition",
    readTime: "6 min",
    source: "Mayo Clinic Research",
    url: "#",
    imageUrl: "https://picsum.photos/seed/nutrition/800/600",
    date: new Date().toDateString()
  },
  {
    title: "Cardiovascular Biomarkers in Early Heart Failure Detection",
    excerpt: "New multi-parametric echocardiography combined with NT-proBNP assays allow clinicians to detect subclinical cardiac remodeling months prior to symptom onset.",
    category: "Clinical",
    readTime: "7 min",
    source: "New England Journal of Medicine",
    url: "#",
    imageUrl: "https://picsum.photos/seed/heartbio/800/600",
    date: new Date().toDateString()
  },
  {
    title: "Circadian Rhythm Entrainment for Cognitive Longevity",
    excerpt: "Investigating the impact of morning phototherapy and time-restricted feeding on glymphatic clearance rates during deep NREM sleep stages.",
    category: "Lifestyle",
    readTime: "5 min",
    source: "Nature Medicine",
    url: "#",
    imageUrl: "https://picsum.photos/seed/circadian/800/600",
    date: new Date().toDateString()
  },
  {
    title: "Precision Oncology: Liquid Biopsies and Circulating Tumor DNA",
    excerpt: "How next-generation sequencing of plasma ctDNA is revolutionizing minimal residual disease monitoring across oncology departments worldwide.",
    category: "Science",
    readTime: "9 min",
    source: "Journal of Clinical Oncology",
    url: "#",
    imageUrl: "https://picsum.photos/seed/oncology/800/600",
    date: new Date().toDateString()
  },
  {
    title: "Gut Microbiome Metabolites and Neuroinflammation",
    excerpt: "Analyzing short-chain fatty acids (SCFAs) like butyrate and propionate and their protective role against blood-brain barrier permeability.",
    category: "Nutrition",
    readTime: "6 min",
    source: "Cell Metabolism",
    url: "#",
    imageUrl: "https://picsum.photos/seed/microbiome/800/600",
    date: new Date().toDateString()
  }
];

export function HealthBlog({ onBack }: { onBack: () => void }) {
  const [posts, setPosts] = useState<BlogPost[]>(STATIC_POSTS);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const categories = ['All', 'Nutrition', 'Science', 'Lifestyle', 'Clinical'];

  const filteredPosts = posts.filter(post => {
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-manrope transition-colors">
      
      {/* Header Panel matching landing page style */}
      <div className="bg-white dark:bg-slate-900 pt-24 pb-16 px-4 sm:px-6 md:px-8 border-b border-sky-100 dark:border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-sky-400/15 to-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <button 
            onClick={onBack}
            className="flex items-center space-x-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors mb-6 group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-extrabold uppercase tracking-widest">Medical Dashboard</span>
          </button>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center space-x-2 bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-widest mb-6 border border-sky-200 dark:border-sky-800 shadow-xs">
                <Newspaper className="w-4 h-4 animate-pulse" />
                <span>Daily Health Intelligence</span>
              </div>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight mb-4">
                The Clinical <span className="text-sky-500">Chronicle</span>
              </h1>
              <p className="text-slate-600 dark:text-slate-300 font-medium text-base sm:text-lg leading-relaxed">
                Peer-reviewed medical insights and healthcare research aggregated from top medical journals.
              </p>
            </div>

            <div className="relative w-full lg:w-96">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search archives..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-4 pl-14 pr-6 text-slate-900 dark:text-white text-xs sm:text-sm font-bold uppercase tracking-wider focus:outline-none focus:border-sky-500 transition-all shadow-xs"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white dark:bg-slate-900 border-b border-sky-100 dark:border-slate-800 sticky top-0 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center space-x-4 sm:space-x-8 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap text-xs font-extrabold uppercase tracking-wider pb-1 transition-all border-b-2 cursor-pointer ${
                  activeCategory === cat 
                    ? 'border-sky-500 text-sky-600 dark:text-sky-400' 
                    : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredPosts.map((post, index) => (
              <motion.article
                key={post.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ 
                  type: "spring",
                  damping: 25,
                  stiffness: 120,
                  delay: index * 0.05 
                }}
                whileHover={{ y: -4 }}
                className="group cursor-pointer bg-white dark:bg-slate-900 rounded-[2.25rem] p-4 sm:p-5 border border-sky-100 dark:border-slate-800 hover:border-sky-200 dark:hover:border-sky-700 shadow-[0_15px_40px_rgba(8,112,184,0.06)] transition-all flex flex-col justify-between"
                onClick={() => setSelectedPost(post)}
              >
                <div className="relative aspect-[16/10] rounded-[1.75rem] overflow-hidden mb-6 bg-slate-100 dark:bg-slate-800">
                  <img 
                    src={post.imageUrl} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-sky-500 text-white px-3.5 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-md">
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="px-2 pb-2 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-2 text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">
                      <div className="flex items-center bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full text-slate-600 dark:text-slate-300">
                        <Clock className="w-3 h-3 mr-1 text-sky-500" />
                        {post.readTime}
                      </div>
                      <span>•</span>
                      <span className="truncate max-w-[140px]">{post.source}</span>
                    </div>
                    
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white leading-snug tracking-tight group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed line-clamp-3 font-medium mt-2">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-extrabold text-sky-600 dark:text-sky-400">
                    <span className="flex items-center">
                      Read Investigation
                      <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">{post.date}</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {/* Post Modal/Viewer */}
        <AnimatePresence>
          {selectedPost && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[88vh] border border-sky-100 dark:border-slate-800"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="absolute top-4 right-4 z-20">
                  <button 
                    onClick={() => setSelectedPost(null)}
                    className="w-10 h-10 bg-slate-900/80 hover:bg-slate-900 text-white rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="overflow-y-auto no-scrollbar">
                  <div className="relative h-64 sm:h-80 w-full">
                    <img 
                      src={selectedPost.imageUrl} 
                      alt={selectedPost.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-900 via-transparent to-transparent" />
                  </div>

                  <div className="px-6 sm:px-10 pb-10 -mt-12 relative z-10">
                    <span className="bg-sky-500 text-white px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider inline-block mb-4 shadow-sm">
                      {selectedPost.category}
                    </span>
                    
                    <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-6">
                      {selectedPost.title}
                    </h2>

                    <div className="flex flex-wrap items-center gap-6 mb-8 border-y border-slate-100 dark:border-slate-800 py-4 text-xs font-bold text-slate-500">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-sky-500" />
                        <span>{selectedPost.readTime} Read</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Stethoscope className="w-4 h-4 text-sky-500" />
                        <span>{selectedPost.source}</span>
                      </div>
                    </div>

                    <div className="space-y-4 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed font-medium">
                      <p className="text-lg font-semibold text-slate-900 dark:text-white">
                        {selectedPost.excerpt}
                      </p>
                      <p>This clinical brief details advanced methodologies in {selectedPost.category.toLowerCase()} implemented as of 2026. Data pointers from {selectedPost.source} indicate a significant shift in patient outcomes based on these recent findings.</p>
                      <p>The full technical manuscript and peer-review documents are available through the MedConnect secure portal for verified medical personnel.</p>
                    </div>

                    <div className="mt-8 p-5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-slate-900 dark:text-white font-extrabold">
                        <Activity className="w-4 h-4 text-sky-500" />
                        <span>Clinical Verification</span>
                      </div>
                      <span className="text-slate-400 font-bold uppercase">{selectedPost.date}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {filteredPosts.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-sky-100 dark:border-slate-800 p-6">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">No clinical findings reported.</h3>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your search criteria</p>
          </div>
        )}
      </div>

      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-sky-600 to-blue-700 py-16 sm:py-20 px-4 text-center text-white relative overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10">
          <Heart className="w-10 h-10 text-white/80 mx-auto mb-6 animate-pulse" />
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Join the Pulse of Tomorrow's Medicine
          </h2>
          <p className="text-sky-100 text-sm sm:text-base mb-8 font-medium">
            Weekly deep-dives into clinical breakthroughs delivered securely to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email address"
              className="flex-1 bg-white/15 border border-white/30 rounded-full py-3.5 px-6 text-white placeholder-white/70 text-xs sm:text-sm font-medium focus:outline-none focus:bg-white/25 transition-all"
            />
            <motion.button 
              whileTap={{ scale: 0.95 }}
              className="bg-white text-sky-700 hover:bg-sky-50 px-6 py-3.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all shadow-md cursor-pointer whitespace-nowrap"
            >
              Subscribe Free
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HealthBlog;
