# Building a Layered Service Hero with CSS: A Real-Time Problem-Solving Story

How a designer and an AI pair-programmed a tricky hero section — hitting dead ends, overcomplicating things, and finally landing on an elegant one-line CSS fix.

---

## The Goal

We needed a service page hero for EES (Environmental Energy Services) that layered three elements:

1. A dark navy header (`#0F2B47`) with a rounded bottom-right corner, containing the page title and company logo
2. A decorative SVG curve sitting underneath, creating a smooth transition to the white page body
3. A hand-drawn illustration sitting *behind* the curve, bleeding out to the right — large and atmospheric

The illustration needed to feel expansive, but its **right edge had to align with the logo above it** — respecting the same container boundaries as the navigation and header content.

That last requirement is where things got interesting.

---

## Step 1: The Basic Structure

The Astro component started simple enough:

```astro
<section class="service-hero">
  <div class="service-hero__top">
    <div class="container">
      <!-- title + logo row -->
    </div>
  </div>
  <div class="service-hero__wave">
    <img src={illustration} class="service-hero__illus" />
    <img src="curve.svg" class="service-hero__curve" />
  </div>
</section>
```

The illustration was absolutely positioned inside the wave div, with the curve SVG sitting on top via `z-index: 1`. This worked well for the layered depth effect — the illustration peeks out from behind the curve.

Early CSS:

```css
.service-hero__illus {
  position: absolute;
  bottom: 5%;
  right: 5%;
  width: 75%;
  z-index: 0;
}
```

## Step 2: The Rounded Corner Problem

The dark header needed `border-bottom-right-radius: 110px`. But the full-width curve SVG extended past the radius, poking through the rounded corner.

**My fix suggestion:** Add a dark background to the wave div to mask it.

**The problem:** The curve SVG fill was the same dark navy — so it became invisible against a matching background. The whole curve disappeared.

**The user's fix:** "Just add `padding-right: 100px` to the wave section so the SVG doesn't reach the corner."

Simple. Effective. No colour tricks needed. The padding pushed the SVG's right edge inward, leaving clean space for the radius to breathe.

```css
.service-hero__wave {
  padding-right: 100px;
}
```

## Step 3: Mobile Overflow Chaos

At the illustration's large size (we scaled it up to 2.1x at one point), it broke mobile layouts — overflowing the page horizontally.

**My first instinct:** Hide the illustration on mobile with `display: none`.

**The user's correction:** "You just need to make it smaller, not hide it."

Right. The illustration is a key part of the design's character. We dialled it to `width: 85%` on mobile and added `overflow: hidden` on the parent section as a safety net.

We also hit an issue where the illustration overlapped the dark header text on small screens. The fix was two-fold:

```css
@media (max-width: 768px) {
  .service-hero__top {
    z-index: 2; /* header stays on top */
  }
  .service-hero__illus {
    bottom: -1rem; /* nudge illustration downward */
  }
}
```

## Step 4: Container Alignment — The Real Challenge

The site's navigation uses a `max-width: 1400px` container with `padding: 0 2rem`. But the hero's `.container` class was set to `max-width: 1200px` with `padding: 0 1rem`. The header text and logo were narrower than the nav — visually misaligned.

**Fix:** We created a custom `.service-hero__container` matching the nav dimensions:

```css
.service-hero__container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}
```

Title and logo now lined up with the navigation. But the illustration was still floating freely in the full-width wave section, ignoring all container boundaries.

## Step 5: Aligning the Illustration's Right Edge — Three Attempts

This was the crux of the problem. The illustration needed to be:
- **Right-aligned** to the same boundary as the logo (the 1400px container edge)
- **Free to extend left** beyond the container (for that expansive, atmospheric feel)

### Attempt 1: Wrapper Container (Too Restrictive)

We wrapped the illustration in a matching container div:

```html
<div class="service-hero__illus-wrap">
  <div class="service-hero__container">
    <img src={illustration} class="service-hero__illus" />
  </div>
</div>
```

With the wrapper absolutely positioned over the wave area and the illustration positioned `right: 0` inside the container.

**The problem:** The container constrained *both* edges. The illustration got squeezed — its left side was clipped too. We lost the expansive feel entirely. As the user put it: "That breaks the effect I'm after."

### Attempt 2: The Overthink

At this point I was considering nested positioning contexts, overflow tricks, and negative margins. All getting more complex without solving the fundamental tension: constrain one side, free the other.

### Attempt 3: One Line of CSS (The Winner)

The user asked: "Any other smart but simple way to achieve this? So I can have my cake and eat it too?"

The answer was `calc()` + `max()`. No wrapper divs. No extra markup. Just math:

```css
.service-hero__illus {
  position: absolute;
  bottom: 5%;
  right: max(calc((100vw - 1400px) / 2 + 2rem), 2rem);
  width: 78%;
  max-width: 1440px;
  z-index: 0;
}
```

**How it works:**

- `(100vw - 1400px) / 2` — the space between the viewport edge and the container edge on each side
- `+ 2rem` — accounts for the container's padding
- `max(..., 2rem)` — on viewports narrower than 1400px, the first calc goes negative, so we fall back to just the padding value

The illustration's **right edge** now perfectly aligns with the container's content boundary — the same line as the logo's right edge. The **left side** extends freely, as wide as it wants.

One line. No extra HTML. Mathematically locked to the container edge at every viewport width.

## Step 6: Final Sizing

With alignment solved, we scaled the illustration up by 1.2x (from `width: 65%` to `width: 78%`) to fill the space nicely behind the curve.

---

## The Final CSS

```css
.service-hero__illus {
  position: absolute;
  bottom: 5%;
  right: max(calc((100vw - 1400px) / 2 + 2rem), 2rem);
  width: 78%;
  max-width: 1440px;
  height: auto;
  z-index: 0;
  pointer-events: none;
}
```

## Lessons from the Process

**1. Simple beats clever.** The padding-right fix for the rounded corner was better than any colour-matching trick. The calc() for alignment was better than wrapper divs.

**2. "Make it smaller, not hide it."** The instinct to `display: none` on mobile is often wrong. Scale down before you remove. The illustration matters to the design — it just needs to fit.

**3. Constraints on one side, freedom on the other.** Container wrappers enforce symmetrical constraints. When you only need to pin one edge, use a calculated offset instead. CSS `max()` and `calc()` let you derive container boundaries from anywhere in the DOM without needing the actual container element.

**4. Pair programming works.** The designer's eye caught what the code couldn't — "the right edge should line up with the logo." The developer's toolbox (calc, max, z-index stacking) turned that visual intent into working CSS. Neither perspective alone would have landed on the final solution as quickly.

---

*Built with Astro, CSS calc(), and a lot of back-and-forth between human intuition and AI implementation.*
