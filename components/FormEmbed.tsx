type FormEmbedProps = {
  src: string;
  title: string;
  className?: string;
};

export function FormEmbed({ src, title, className = '' }: FormEmbedProps) {
  return (
    <iframe
      src={src}
      title={title}
      className={`h-[520px] w-full rounded-lg border border-slate-200 bg-white ${className}`}
      loading="lazy"
    />
  );
}
