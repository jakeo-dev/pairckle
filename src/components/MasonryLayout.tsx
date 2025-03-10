import Masonry from "react-masonry-css";

export default function MasonryLayout({
  children,
  className,
  columnClassName,
  defaultCols,
  smCols,
  mdCols,
  lgCols,
  xlCols,
}: {
  children: React.ReactNode;
  className: string;
  columnClassName: string;
  defaultCols: number;
  smCols: number;
  mdCols: number;
  lgCols: number;
  xlCols: number;
}) {
  return (
    <Masonry
      breakpointCols={{
        default: xlCols, // xlCols when over 1280px (xl in tailwind)
        1279: lgCols, // lgCols when over 1024px (lg in tailwind)
        1023: mdCols, // mdCols when over 768px (md in tailwind)
        767: smCols, // smCols when over 640px (sm in tailwind)
        639: defaultCols, // defaultCols by default
      }}
      className={className}
      columnClassName={columnClassName}
    >
      {children}
    </Masonry>
  );
}
