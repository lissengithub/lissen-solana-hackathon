'use client'
import YouTube from 'react-youtube';

export default function FeatureVideo() {
  return (
    <div className="container mt-28">
      <h2 className="text-2xl md:text-4xl font-black text-white font-residenzGrotesk mb-8">
        That&rsquo;s what it feels like
      </h2>

      <div className="w-full">
        <YouTube
          videoId="6Ht9ZKfX-qo"
          className="youtubeContainer"
        />
      </div>
    </div>
  )
}
