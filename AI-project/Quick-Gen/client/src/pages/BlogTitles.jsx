import { useAuth } from "@clerk/clerk-react";
import { Hash, Sparkles } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";
import axios from 'axios'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const BlogTitles = () => {
  const blogCategories = [
    'General', 'Technology', 'Health', 'Travel', 'Finance', 'Education',
    'Lifestyle', 'Food', 'Entertainment', 'Sports'
  ];

  const [selectedCategory, setSelectedCategory] = useState('General');
  const [topic, setTopic] = useState('');

  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')

  const [generatedArticle, setGeneratedArticle] = useState('');

  const {getToken} = useAuth()

  const onGenerateArticle = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const prompt = `Generate a blog title for thekeyword ${topic} in the category ${selectedCategory}`

      const { data } = await axios.post('/ai/generate-blog-title', {prompt}, {headers: {Authorization: `Bearer ${await getToken()}`}})

      if(data.success){
        setContent(data.content)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  return (
    <div className='h-full overflow-y-scroll p-6 bg-background text-foreground transition-colors duration-300'>
      
      {/* Two-column layout */}
      <div className='flex flex-col lg:flex-row gap-6'>

        {/* Left Column: Blog Input */}
        <div className='flex-1 max-w-lg p-6 bg-card-bg border border-border rounded-2xl shadow-lg relative overflow-hidden group transition-all duration-300'>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full mix-blend-screen filter blur-3xl opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          <div className='flex items-center gap-3 relative z-10'>
            <Sparkles className='w-6 h-6 text-gold' />
            <h1 className='text-xl font-bold text-foreground font-display'>AI Title Generator</h1>
          </div>

          {/* Topic Input */}
          <p className='mt-8 text-sm font-medium text-slate relative z-10 font-sans'>Keyword</p>
          <input
            type='text'
            className='w-full p-3 px-4 mt-2 outline-none text-sm rounded-xl bg-background border border-border text-foreground placeholder-slate/50 focus:border-gold focus:ring-1 focus:ring-gold transition-all shadow-inner relative z-10 font-sans'
            placeholder='The future of artificial intelligence is...'
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            required
          />

          {/* Category Selection */}
          <p className='mt-5 text-sm font-medium text-gray-300 relative z-10'>Category</p>
          <div className='mt-3 flex gap-3 flex-wrap sm:max-w-[90%] relative z-10'>
            {blogCategories.map((item, index) => (
              <span 
                key={index}
                onClick={() => setSelectedCategory(item)}
                className={`text-sm px-5 py-2 border rounded-full cursor-pointer transition-all duration-300 shadow-sm font-medium font-sans
                  ${selectedCategory === item
                    ? 'bg-gold/15 text-gold border-gold/40 shadow-[0_0_15px_rgba(201,151,58,0.2)]'
                    : 'text-slate border-border bg-background hover:bg-card-bg hover:text-foreground'
                  }`}
              >
                {item} 
              </span>
            ))}
          </div>

          {/* Generate Button */}
          <button
            disabled={loading}
            type='button'
            onClick={onGenerateArticle}
            className='w-full flex justify-center items-center gap-2 mt-8 relative z-10
              bg-gold-gradient text-white px-4 py-3 text-base font-semibold rounded-xl
              cursor-pointer shadow-gold-sm hover:-translate-y-1 transition-all font-sans'
          >
            {loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span>
              : <Hash className='w-5' />}
            Generate Title
          </button>
        </div>

        {/* Right Column: Generated Titles */}
        <div className='flex-1 max-w-lg p-6 bg-card-bg border border-border rounded-2xl flex flex-col min-h-[400px] shadow-lg relative overflow-hidden group transition-all duration-300'>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gold/5 rounded-full mix-blend-screen filter blur-3xl opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          <div className='flex items-center gap-3 mb-4 relative z-10 border-b border-border pb-4'>
            <Hash className='w-6 h-6 text-gold' />
            <h1 className='text-xl font-bold text-foreground font-display'>Generated Titles</h1>
          </div>
          {
            !content ?(
              <div className='flex-1 flex justify-center items-center mt-4 relative z-10'>
              <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
                <Hash className='w-12 h-12 opacity-50' />
                <p>Enter a keyword and click "Generate Title" to get started.</p>
              </div>
          </div>
            ) : (
              <div className='mt-2 h-full overflow-y-auto pr-2 relative z-10'>
                <div className='prose-dark'>
                  <Markdown>{content}</Markdown>
                </div>
              </div>
            )
          }
          
        </div>

      </div>
    </div>
  );
};

export default BlogTitles;

