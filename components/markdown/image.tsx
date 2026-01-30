import { ComponentProps } from "react";
import NextImage from "next/image";

type Height = ComponentProps<typeof NextImage>["height"];
type Width = ComponentProps<typeof NextImage>["width"];
type ImageProps = ComponentProps<typeof NextImage>;

export default function Image({
  src,
  alt = "alt",
  width = 800,
  height = 350,
  ...props
}: Omit<ImageProps, "src" | "alt" | "width" | "height"> & {
  src?: ImageProps["src"];
  alt?: string;
  width?: Width;
  height?: Height;
}) {
  if (!src) return null;
  return (
    <NextImage
      src={src}
      alt={alt}
      width={width as Width}
      height={height as Height}
      quality={40}
      {...props}
    />
  );
}
