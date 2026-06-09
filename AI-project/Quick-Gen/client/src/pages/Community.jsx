import {useUser} from '@clerk/clerk-react'
import { Heart } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Community = () => {

  const [creations, setCreations]=useState([])
  const{user} =useUser()
  const [loading, setLoading] = useState(true)
  const {getToken} = useAuth()

  const fetchCreations= async ()=>{
    try {
      const { data } = await axios.get('/ai/get-published-creations', {headers: {Authorization: `Bearer ${await getToken()}`}})

      if(data.success){
        setCreations(data.creations)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  const imageLikeToggle = async (id) => {
    try {      
      const { data } = await axios.post('/api/ai/toggle-like-creation', {id}, {headers: {Authorization: `Bearer ${await getToken()}`}})

      if(data.success){
        toast.success(data.message)
        await fetchCreations()
      }else{
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }
  useEffect(()=>{
    if(user){
      fetchCreations()
    }
  },[user])

  return !loading ?(
  <div className='flex-1 h-full flex flex-col gap-4 p-6 bg-background text-foreground transition-colors duration-300'>
    <h1 className="text-2xl font-bold text-foreground font-display mb-6">Community Creations</h1>

    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
      {creations.map((creation, index) => (
        <div
          key={index}
          className='relative group w-full rounded-2xl overflow-hidden bg-card-bg border border-border shadow-lg transition-all duration-300'
        >
          <img
            src={creation.content}
            alt=""
            className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
            <p className='text-sm text-gray-100 mb-2 truncate font-sans'> {creation.prompt}</p>
            <div className='flex gap-1 items-center justify-end w-full'>
              <p className="text-white font-medium">
                {creation.likes?.length || 0}
              </p>

              <Heart
                onClick={() => imageLikeToggle(creation.id)}
                className={`min-w-5 h-5 transition-transform hover:scale-110 cursor-pointer ${
                  creation.likes?.includes(user?.id)
                    ? "fill-gold text-gold drop-shadow-[0_0_8px_rgba(201,151,58,0.6)]"
                    : "text-white"
                }`}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
) : (
  <div className='flex justify-center items-center h-full bg-background'>
    <span className='w-12 h-12 my-1 rounded-full border-4 border-gold border-t-transparent animate-spin shadow-gold-sm'></span>
  </div>
)
}

export default Community
