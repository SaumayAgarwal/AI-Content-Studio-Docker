import { Eraser, Sparkles } from 'lucide-react';
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveBackground = () => {

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [fileName, setFileName] = useState("No file chosen");
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')

  const {getToken} = useAuth()

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true)

      const formData = new FormData()
      formData.append('image', image)

      const { data } = await axios.post('/ai/remove-image-background', formData, {headers: {Authorization: `Bearer ${await getToken()}`}})

      if(data.success){
        setContent(data.content)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  };

  const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setImage(file);
    setFileName(file.name);
    setPreview(URL.createObjectURL(file));
  }
};

  return (
    <div className='h-full overflow-y-scroll p-6 bg-background text-foreground transition-colors duration-300'>
      
      {/* Two-column layout */}
      <div className='flex flex-col lg:flex-row gap-6'>

        <form onSubmit={onSubmitHandler} className='w-full max-w-lg p-6 bg-card-bg rounded-2xl border border-border shadow-lg relative overflow-hidden group transition-all duration-300'>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full mix-blend-screen filter blur-3xl opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            
         {/* Left Column: Input */}
          <div className='flex items-center gap-3 relative z-10'>
            <Sparkles className='w-6 h-6 text-gold' />
            <h1 className='text-xl font-bold text-foreground font-display'>Background Remover</h1>
          </div>

          {/* Topic Input */}
          <p className='mt-8 text-sm font-medium text-slate relative z-10 font-sans'>Upload Image</p>

          <label className="w-full flex justify-between items-center p-3 px-4 mt-2 text-sm rounded-xl bg-background border border-border cursor-pointer text-slate hover:border-gold hover:bg-card-bg transition-all shadow-inner relative z-10 font-sans">
            
            <span className="truncate">{fileName}</span>

            <span className="text-gold font-medium bg-gold/10 px-3 py-1 rounded-md">Choose</span>
          <input
            type='file'
            onChange={handleImageChange}
            className="hidden"
            accept='image/*'
            required/>
            </label>

          <p className='text-xs text-slate/60 font-light mt-2 relative z-10 font-sans'>
            Supports JPG, PNG, and other image formats</p>

          {/* Generate Button */}
          <button
            disabled={loading}
            className='w-full flex justify-center items-center gap-2 mt-8 relative z-10
              bg-gold-gradient text-white px-4 py-3 text-base font-semibold rounded-xl
              cursor-pointer shadow-gold-sm hover:-translate-y-1 transition-all font-sans'
          >
            {
              loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span>
              : <Eraser className='w-5' />
            }
           Remove background
          </button>
        </form>


        {/* Right Column: Generated Titles */}
        <div className='w-full max-w-lg p-6 bg-card-bg rounded-2xl flex flex-col border border-border shadow-lg min-h-96 relative overflow-hidden group transition-all duration-300'>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gold/5 rounded-full mix-blend-screen filter blur-3xl opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          <div className='flex items-center gap-3 mb-4 relative z-10 border-b border-border pb-4'>
            <Eraser className='w-6 h-6 text-gold' />
            <h1 className='text-xl font-bold text-foreground font-display'>Processed Image</h1>
          </div>
          
          {
            !content ? (
              <div className='flex-1 flex justify-center items-center mt-4 relative z-10'>
            <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
              <Eraser className='w-12 h-12 opacity-50'/>
                <p>Upload an image and click "Remove Background" to get started</p>
            </div>
          </div>
            ) : (
              <div className='mt-2 h-full relative z-10 flex items-center justify-center'>
                <img src={content} alt="image" className='w-full h-auto rounded-xl shadow-lg border border-white/5'/>
              </div>
            )
          }
        </div>

      </div>
    </div>
  );
};

export default RemoveBackground;
