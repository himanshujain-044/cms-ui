import createImageUrlBuilder from "@sanity/image-url";

const imageBuilder = createImageUrlBuilder({
  projectId:
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
    (process.env.SANITY_STUDIO_PROJECT_ID as string),
  dataset:
    process.env.NEXT_PUBLIC_SANITY_DATASET || ("production" as string)
});

export const urlForImage = source => {
  if (!source || !source.asset) return;
  const dimensions = source?.asset?._ref?.split("-")[2];

  const [width, height] = dimensions
    ?.split("x")
    .map(num => parseInt(num, 10));

  const url = imageBuilder
    ?.image(source)
    ?.auto("format")
    ?.width(Math.min(width, 2000))
    ?.url();

  return {
    src: url,
    width: width,
    height: height
  };
};
