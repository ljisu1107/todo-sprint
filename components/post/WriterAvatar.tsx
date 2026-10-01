import Image from 'next/image';

const DEFAULT_PROFILE_IMAGE = '/images/gnb/img_profile.jpg';

interface WriterAvatarProps {
  image: string | null;
}

const WriterAvatar = ({ image }: WriterAvatarProps) => (
  <Image
    src={image ?? DEFAULT_PROFILE_IMAGE}
    alt=""
    width={24}
    height={24}
    className="size-5 shrink-0 rounded-full object-cover md:size-6"
  />
);

export default WriterAvatar;
