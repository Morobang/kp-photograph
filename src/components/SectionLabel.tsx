export default function SectionLabel({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <span className="block w-8 h-px bg-gold" />
      <span className="font-cond text-[0.65rem] font-medium tracking-[0.3em] uppercase text-gold">
        {text}
      </span>
    </div>
  )
}