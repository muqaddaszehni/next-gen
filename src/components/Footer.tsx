import { GoldRule } from './primitives'

export function Footer({ familyName }: { familyName?: string }) {
  return (
    <footer className="mt-24 border-t border-hairline">
      <div className="mx-auto flex max-w-page flex-col gap-4 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex flex-col gap-3">
          <GoldRule />
          <p className="font-serif text-lg text-navy">Next Gen</p>
          <p className="label-caps text-ink/40">
            {familyName ? `A private programme for the ${familyName} family` : 'A private programme for the next generation'}
          </p>
        </div>
        <p className="max-w-xs text-[0.78rem] leading-relaxed text-ink/45 sm:text-right">
          Illustrative demo — fictional data. Names, figures and events shown here are invented for
          demonstration and do not represent any real person, family or institution.
        </p>
      </div>
    </footer>
  )
}
