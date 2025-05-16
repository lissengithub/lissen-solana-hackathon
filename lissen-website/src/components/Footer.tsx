import Link from 'next/link'
import Icon from '@/components/ui/icon'

const socials = [
  {
    name: 'x',
    link: 'https://x.com/BenLissen',
  },
  {
    name: 'instagram',
    link: 'https://www.instagram.com/benlissen',
  },
  {
    name: 'youtube',
    link: 'https://www.youtube.com/@BenLissen',
  },
  {
    name: 'mail',
    link: 'mailto:contact@lissen.live',
  },
] as const

export default function Footer() {
  return (
    <footer className="container pt-16">
      <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0 border-t border-dark/20 md:border-white/20 py-10 font-normal dark:text-gray-400">
        <div className="flex gap-6 lg:order-2 lg:flex-1 lg:justify-end lg:mr-8">
          <Link href={`${process.env.NEXT_PUBLIC_CDN_URL}/terms_and_conditions.pdf`} target="_blank">
            Terms and conditions
          </Link>
          <Link href="/privacy-policy">
            Privacy policy
          </Link>
        </div>

        <div className="flex items-center gap-4 lg:order-3">
          {socials.map((social) => (
            <Link href={social.link} key={social.name} target="_blank">
              <Icon name={social.name} className="fill-black dark:fill-white" />
            </Link>
          ))}
        </div>

        <div className="lg:order-1">
          <p className="text-center">© Lissen Ltd. - London, UK - All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
