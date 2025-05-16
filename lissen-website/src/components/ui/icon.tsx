import icons from '@/icons'

export type IconName = keyof typeof icons

type IconProps = {
  name: IconName;
} & React.SVGProps<SVGSVGElement>;

const Icon = ({ name, ...props }: IconProps) => {
  const IconComponent = icons[name]
  return <IconComponent {...props} />
}

export default Icon
