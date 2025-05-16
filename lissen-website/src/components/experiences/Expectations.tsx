import Image from "next/image";

const EXPECTATIONS = [
  {
    title: "All music genres",
    text: "Exact location will be revealed 24h before the show! Look out for the email",
    image: "one.webp"
  },
  {
    title: "Original venues",
    text: "Exact location will be revealed 24h before the show! Look out for the email",
    image: "two.webp"
  },
  {
    title: "Intimate shows",
    text: "Exact location will be revealed 24h before the show! Look out for the email",
    image: "three.webp"
  },
]

type TExpectation = {
  title: string;
  text: string;
  image: string;
}

export default function Expectations() {
  return (
    <div className="container mt-16">
      <h2 className="text-2xl md:text-4xl font-black text-white font-residenzGrotesk">
        What to expect
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {EXPECTATIONS.map((expectation, index) => (
          <ExpectationCard key={index} {...expectation} />
        ))}
      </div>
    </div>
  )
}

const ExpectationCard = ({ title, text, image }: TExpectation) => {
  return (
    <div className="flex flex-col gap-3">
      <Image
        src={`/images/experiences/expectations/${image}`}
        alt={title}
        width={410}
        height={250}
        className="w-full object-contain"
      />

      <h3 className="text-xl font-black text-white font-residenzGrotesk primary-text-gradient">{title}</h3>
      <p className="text-sm text-white/80 font-normal max-w-xs">{text}</p>
    </div>
  );
}
