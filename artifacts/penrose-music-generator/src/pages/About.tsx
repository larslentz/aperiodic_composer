import { ArrowLeft, AudioLines, Network, Shapes, SlidersHorizontal } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const chapters = [
  {
    number: "01",
    title: "Begin with order that never repeats",
    icon: Shapes,
    paragraphs: [
      "A Penrose tiling has structure, but no repeating wallpaper pattern. Its local shapes fit together according to clear rules while the whole keeps unfolding in new ways. That balance—order without a loop—is a natural starting point for music that can feel coherent without sounding copied and pasted.",
      "The composer builds the pattern by repeatedly subdividing two triangle forms, called kites and darts. The recursion depth controls how far that process goes: more depth means more geometry, and more possible musical events.",
    ],
  },
  {
    number: "02",
    title: "Let the path through the pattern shape time",
    icon: Network,
    paragraphs: [
      "A drawing has no beginning or end until you choose one. Traversal supplies that missing dimension: it decides the order in which tiles become musical events. Moving outward from the center, sweeping around by angle, scanning rows, or following neighbors can make the same tiling feel like a different piece.",
      "This is why geometry is more than a visual backdrop. The route through it is the score’s timeline.",
    ],
  },
  {
    number: "03",
    title: "Translate relationships, not random notes",
    icon: SlidersHorizontal,
    paragraphs: [
      "Each tile carries a few simple facts: its kind, where it sits, which direction it faces, and how many neighbors it touches. The mapping controls let those facts independently shape pitch, accent, note length, stereo position, and timbre.",
      "Scale, root note, range, tempo, and rhythm density then give the result a musical frame. Rhythm density leaves some tiles silent; the remaining events still come from the same underlying geometry.",
    ],
  },
  {
    number: "04",
    title: "Choose how much melody to impose",
    icon: AudioLines,
    paragraphs: [
      "In Geometric mode, the chosen mapping is heard directly. Melodic / Interweave takes another approach: kite and dart tiles become two voices, each with its own smoothed contour. Phrase length, contour amount, and maximum leap let you decide how strongly those voices arc and how closely they stay connected.",
      "Neither approach is meant to be the one correct interpretation. The point is to make the same geometry available as both a direct translation and a more shaped musical reading.",
    ],
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground">
      <header className="flex h-16 items-center justify-between border-b border-border bg-card px-5 sm:px-8">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Return to Lars Lentz's Aperiodic Composer"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-primary font-bold text-primary-foreground shadow-glow">
            P
          </span>
          <span className="truncate text-sm font-semibold sm:text-base">
            Lars Lentz&apos;s Aperiodic Composer
          </span>
        </Link>
        <Button variant="outline" size="sm" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Back to composer</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </Button>
      </header>

      <main
        className="mx-auto w-full max-w-5xl px-5 pb-20 pt-12 sm:px-8 sm:pt-20"
        aria-labelledby="about-title"
      >
        <div className="max-w-3xl">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-primary">
            Design notes
          </p>
          <h1 id="about-title" className="text-4xl font-bold tracking-tight sm:text-6xl">
            The thinking behind the composer
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
            What if a musical sequence began as a place rather than a melody? This
            composer turns a Penrose pattern into a path, then lets the pattern&apos;s
            own relationships guide the sound.
          </p>
        </div>

        <div className="my-12 h-px bg-border sm:my-16" />

        <section
          className="mb-12 rounded-lg border border-border bg-card/60 p-5 sm:mb-16 sm:p-8"
          aria-labelledby="penrose-math-title"
        >
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
            The pattern, in numbers
          </p>
          <h2 id="penrose-math-title" className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
            A golden ratio, applied recursively
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
            The Penrose construction is tied to the golden ratio. The generator
            uses its reciprocal to place new points along triangle edges, then
            repeats kite-and-dart subdivision rules at each depth.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-md border border-border bg-background/70 p-4">
              <p
                className="font-mono text-lg text-foreground sm:text-xl"
                aria-label="Phi equals one plus the square root of five, divided by two; approximately 1.618"
              >
                φ = (1 + √5) / 2
              </p>
              <p className="mt-2 font-mono text-xs text-primary">φ ≈ 1.618</p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                The golden ratio: a proportion that appears throughout the
                tiling&apos;s self-similar construction.
              </p>
            </div>

            <div className="rounded-md border border-border bg-background/70 p-4">
              <p
                className="font-mono text-lg text-foreground sm:text-xl"
                aria-label="One over phi equals phi minus one; approximately 0.618"
              >
                1 / φ = φ − 1
              </p>
              <p className="mt-2 font-mono text-xs text-primary">1 / φ ≈ 0.618</p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                This is the edge fraction used to locate subdivision points.
                It divides an edge in the same golden-ratio proportion.
              </p>
            </div>

            <div className="rounded-md border border-border bg-background/70 p-4">
              <p
                className="font-mono text-lg text-foreground sm:text-xl"
                aria-label="Kite becomes kite plus dart. Dart becomes kite plus two darts."
              >
                K → K + D
                <br />
                D → K + 2D
              </p>
              <p className="mt-2 font-mono text-xs text-primary">subdivision rules</p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Each step replaces a kite with one kite and one dart, or a dart
                with one kite and two darts.
              </p>
            </div>
          </div>

          <p className="mt-5 max-w-3xl text-sm leading-7 text-muted-foreground">
            In this app, those kite and dart regions stay as individual
            triangular pieces instead of being merged into rhombi. That keeps
            each piece available for musical mapping and neighbor analysis.
          </p>
        </section>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-16">
          <div className="space-y-12">
            {chapters.map(({ number, title, icon: Icon, paragraphs }) => (
              <section key={number} className="grid gap-4 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-6">
                <div className="flex items-start gap-3 sm:flex-col sm:gap-4">
                  <span className="font-mono text-xs text-primary">{number}</span>
                  <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h2>
                  <div className="mt-4 space-y-4 text-sm leading-7 text-muted-foreground sm:text-base">
                    {paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </section>
            ))}

            <section className="grid gap-4 border-t border-border pt-8 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-6">
              <span className="font-mono text-xs uppercase tracking-wider text-primary">05</span>
              <div>
                <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                  Keep the instrument open
                </h2>
                <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
                  The result is something to explore, not just a finished composition
                  to accept. Listen in the browser, adjust the controls, and take a
                  version elsewhere as MIDI or CSV. Presets let you save and revisit
                  a setup. The tools are there to help you hear what the geometry
                  suggests—and then make it your own.
                </p>
              </div>
            </section>
          </div>

          <aside className="h-fit border-l-2 border-primary/60 pl-5 lg:sticky lg:top-8">
            <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              The central idea
            </p>
            <p className="mt-3 text-lg font-medium leading-7">
              Geometry provides the material. Your choices provide the interpretation.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center rounded-sm text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Try it in the composer
              <ArrowLeft className="ml-2 h-4 w-4 rotate-180" aria-hidden="true" />
            </Link>
          </aside>
        </div>
      </main>
    </div>
  );
}
