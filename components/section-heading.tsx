type Props = {
  index: string;
  label: string;
  title: string;
  id?: string;
};

export function SectionHeading({ index, label, title, id }: Props) {
  return (
    <div className="mb-8" data-reveal>
      <p className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
        {index} / {label}
      </p>
      <h2
        id={id}
        className="mt-2 text-2xl font-semibold tracking-tight md:text-[28px]"
      >
        {title}
      </h2>
    </div>
  );
}
