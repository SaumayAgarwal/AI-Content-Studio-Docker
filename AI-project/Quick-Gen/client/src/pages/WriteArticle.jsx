import React, { useState } from 'react'
import { Edit, Sparkles } from 'lucide-react'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
const WriteArticle = () => {
  const articleLength = [
    { length: 800, text: 'Short (500-800 words)' },
    { length: 1200, text: 'Medium (800-1200 words)' },
    { length: 1600, text: 'Long (1200+ words)' },
  ];

  const [selectedLength, setSelectedLength] = useState(articleLength[0]);
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')

  const {getToken} = useAuth()

  const [generatedArticle, setGeneratedArticle] = useState('');

  const onGenerateArticle = async(e) => {
    e.preventDefault();
    try{
      setLoading(true)
      const prompt = `write an article about ${topic} in ${selectedLength.text}`
      
      const {data} = await axios.post('/ai/generate-article', {prompt, length:selectedLength.length}, {
        headers: {Authorization: `Bearer ${await getToken()}`}
      })

      if(data.success){
        setContent(data.content)
      }else{
        toast.error(data.message)
      }
    }catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
    // if (!topic) return;
    // setGeneratedArticle(
    //   `Generated article on "${topic}" with length ${selectedLength.text}`
    // );
  };

  return (
    <div className='h-full overflow-y-scroll p-6 bg-background text-foreground transition-colors duration-300'>
      
      {/* Two-column layout */}
      <div className='flex flex-col lg:flex-row gap-6'>

        {/* Left Column: Article Configuration */}
        <div className='flex-1 max-w-lg p-6 bg-card-bg border border-border rounded-2xl shadow-lg relative overflow-hidden group transition-all duration-300'>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full mix-blend-screen filter blur-3xl opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          <div className='flex items-center gap-3 relative z-10'>
            <Sparkles className='w-6 h-6 text-gold' />
            <h1 className='text-xl font-bold text-foreground font-display'>Article Configuration</h1>
          </div>

          {/* Article Topic */}
          <p className='mt-8 text-sm font-medium text-slate relative z-10 font-sans'>Article Topic</p>
          <input
            type='text'
            className='w-full p-3 px-4 mt-2 outline-none text-sm rounded-xl bg-background border border-border text-foreground placeholder-slate/50 focus:border-gold focus:ring-1 focus:ring-gold transition-all shadow-inner relative z-10 font-sans'
            placeholder='The future of artificial intelligence is...'
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            required
          />

          {/* Article Length */}
          <p className='mt-4 text-sm font-medium'>Article Length</p>
          <div className='mt-3 flex gap-3 flex-wrap sm:max-w-[90%]'>
            {articleLength.map((item, index) => (
              <span
                key={index}
                onClick={() => setSelectedLength(item)}
                className={`text-sm px-5 py-2 border rounded-full cursor-pointer transition-all duration-300 shadow-sm relative z-10 font-medium
                  ${selectedLength.text === item.text
                    ? 'bg-gradient-to-r from-neonBlue/30 to-neonPurple/30 text-white border-neonPurple/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                    : 'text-gray-400 border-white/10 bg-white/5 hover:bg-white/10 hover:text-gray-200'
                  }`}
              >
                {item.text}
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
              cursor-pointer shadow-gold-sm hover:-translate-y-1 transition-all'
          >
            {
              loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span>
              : <Edit className='w-5' />
            }
            Generate Article
          </button>
        </div>

        {/* Right Column: Generated Article */}
        <div className='flex-1 max-w-lg p-6 bg-card-bg border border-border rounded-2xl flex flex-col min-h-[400px] shadow-lg relative overflow-hidden group transition-all duration-300'>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gold/5 rounded-full mix-blend-screen filter blur-3xl opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          <div className='flex items-center gap-3 mb-4 relative z-10 border-b border-border pb-4'>
            <Edit className='w-6 h-6 text-gold' />
            <h1 className='text-xl font-bold text-foreground font-display'>Generated Article</h1>
          </div>

          {!content ? (
            <div className='flex-1 flex justify-center items-center'>
            <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
              <Edit className='w-9 h-9' />
              <p>Enter a topic and click "Generate Article" to get started.</p> 
            </div>
          </div>
          ) : (
            <div className='mt-2 h-full overflow-y-auto pr-2 relative z-10'>
              <div className='prose-dark'>
                <Markdown>{content}</Markdown>
              </div>
            </div>
          )}
        </div>

      </div> 
    </div>
  );
};

export default WriteArticle;