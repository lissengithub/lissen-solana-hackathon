"use client";

import { useMemo, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Icon from "@/components/ui/icon";

const faqs = [
  {
    title: "What is Lissen?",
    description: "Lissen is a platform that helps you discover and share music with friends. It combines social features with music streaming to create a more connected listening experience.",
    author: "Sarah",
  },
  {
    title: "How do I create a playlist?",
    description: "To create a playlist, click the '+' button in the sidebar and select 'New Playlist'. Give it a name, add a description if you'd like, and start adding your favorite tracks!",
    author: "Mike",
  },
  {
    title: "Can I share my playlists with friends?",
    description: "Yes! You can share your playlists by clicking the 'Share' button on any playlist. You can share via a link, or directly to your Lissen friends and followers.",
    author: "Emma",
  },
  {
    title: "Is Lissen available on mobile devices?",
    description: "Lissen is available on both iOS and Android devices. You can download our app from the App Store or Google Play Store to enjoy your music on the go.",
    author: "James",
  },
];

export default function FAQs() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = useMemo(
    () =>
      faqs.filter(
        (faq) =>
          faq.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.description.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery]
  );

  return (
    <div className="container min-h-screen">
      <title>FAQs</title>

      <div className="w-full h-screen fixed top-0 left-0 -z-10 flex items-center justify-center">
        <div className="w-[542px] h-[542px] bg-orange-400 rounded-full blur-[400px] opacity-40" />
      </div>

      <div className="flex flex-col items-center justify-center gap-5 mt-36">
        <h1 className="text-base md:text-xl font-normal text-amber-400 uppercase text-center">
          Frequently Asked Questions
        </h1>

        <h2 className="text-2xl md:text-4xl font-black text-white font-residenzGrotesks text-center mb-1">
          Advice and Answers from the Lissen Team
        </h2>

        <SearchInput value={searchQuery} onChange={setSearchQuery} />

        <div className="w-full flex flex-col items-center justify-center gap-5 mt-2">
          {filteredFaqs.map((faq) => (
            <FAQCard
              key={faq.title}
              title={faq.title}
              description={faq.description}
              author={faq.author}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const SearchInput = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
  return (
    <div className="w-full md:max-w-md border-[0.5px] border-white/50 bg-white/20 rounded-xl backdrop-blur-xl px-4 py-3 flex items-center gap-2">
      <Icon name="search" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search for articles"
        className="w-full bg-transparent outline-none placeholder:text-white"
      />
    </div>
  );
}

const FAQCard = ({
  title,
  description,
  author,
  authorAvatar,
  numberOfArticles = 4,
}: {
  title: string;
  description: string;
  author: string;
  authorAvatar?: string;
  numberOfArticles?: number;
}) => {
  return (
    <div className="w-full md:max-w-4xl border-[1px] border-white/10 bg-zinc-900/30 rounded-xl backdrop-blur-xl p-6 flex flex-col gap-3">
      <h1 className="text-lg md:text-2xl font-bold md:font-semibold text-white">{title}</h1>
      <p className="text-base md:text-lg font-medium text-white/80 line-clamp-3 md:line-clamp-1">{description}</p>
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage src={authorAvatar} alt={author} />
          <AvatarFallback className="bg-cyan-700 text-black text-bold">
            {author.charAt(0)}
          </AvatarFallback>
        </Avatar>

        <p className="text-sm text-white/60">By {author} • {numberOfArticles} articles</p>
      </div>
    </div>
  )
}
