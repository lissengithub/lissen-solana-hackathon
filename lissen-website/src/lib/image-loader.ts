export default function imageLoader({ src }: { src: string }) {
  if (src.startsWith('http') || process.env.NODE_ENV === 'development') {
    return src
  }
  return `${process.env.NEXT_PUBLIC_CDN_URL}/images/_website-public${src}`
}
