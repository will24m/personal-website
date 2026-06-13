import { useState } from "react";
import { profileReviewQuotes } from "../data/content.js";
import { RotatingPhotoGallery } from "./RotatingPhotoGallery.js";

export function PhotoQuotes() {
  const [index, setIndex] = useState(0);
  const quote = profileReviewQuotes[index % profileReviewQuotes.length];

  return (
    <section className="section photo-quotes" aria-label="Photos and feedback">
      <div className="surface-card photo-quotes__gallery">
        <RotatingPhotoGallery onIndexChange={setIndex} />
      </div>
      <figure className="surface-card photo-quotes__quote">
        <blockquote>&ldquo;{quote.quote}&rdquo;</blockquote>
        <figcaption>
          <span className="quote-author">{quote.author}</span>
          <span className="quote-context">{quote.context}</span>
        </figcaption>
      </figure>
    </section>
  );
}
