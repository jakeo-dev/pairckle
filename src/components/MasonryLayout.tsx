import Masonry from "react-masonry-css";

export default function MasonryLayout({
  children,
  className,
  columnClassName,
  defaultCols,
  lgCols,
}: {
  children: React.ReactNode;
  className: string;
  columnClassName: string;
  defaultCols: number;
  lgCols: number;
}) {
  const breakpointColumnsObject = {
    default: lgCols, // lgCols when over 1024px (lg in tailwind)
    1023: defaultCols, // defaultCols by default
  };

  return (
    <Masonry
      breakpointCols={breakpointColumnsObject}
      className={className}
      columnClassName={columnClassName}
    >
      {children}
    </Masonry>
  );
}
