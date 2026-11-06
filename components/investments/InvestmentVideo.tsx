import Link from "next/link";

/**
 * Source: user-provided public YouTube link on 2026-11-06.
 * Video/presentation provide conceptual context, not diligence evidence.
 * The embed uses YouTube's privacy-enhanced domain and loads lazily.
 */
const videoId = "QSL4RrK285Q";
const videoUrl = "https://www.youtube.com/watch?v=" + videoId;

export function InvestmentVideo({compact=false}:{compact?:boolean}) {
  return (
    <div className={"iv-film "+(compact?"iv-film-compact":"iv-film-featured")}>
      <div className="iv-film-copy">
        <span className="iv-eyebrow">Investment film / AI at the Industrial Edge</span>
        <h2>From electronics distribution to the next generation of industrial equipment.</h2>
        <p>
          An overview of the industrial AI hardware opportunity: the sensor-to-control stack,
          fast-turn distribution, application-specific engineering, technical services and
          longer-range U.S. and Canadian expansion.
        </p>
        <div className="iv-film-points" aria-label="Film themes">
          <span>Distribution</span><span>Engineered AI hardware</span><span>Technical services</span>
        </div>
        <p className="iv-film-note">Strategy presentation. Investment amounts, product economics and future market scenarios remain estimates rather than completed transactions.</p>
        <a className="iv-film-youtube" href={videoUrl} target="_blank" rel="noopener noreferrer" aria-label="Watch AI at the Industrial Edge on YouTube">Watch on YouTube ↗</a>
        {compact&&<Link className="iv-film-full" href="/investments/nepal-india-electronics#engineering-economics">Explore the underlying financial model ↗</Link>}
      </div>
      <div className="iv-film-screen">
        <div className="iv-film-video">
          <iframe
            title="AI at the Industrial Edge — investment presentation"
            src={"https://www.youtube-nocookie.com/embed/"+videoId+"?rel=0"}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
        <div className="iv-film-label"><span>AI AT THE INDUSTRIAL EDGE</span><span>Investment film · 2026</span></div>
      </div>
    </div>
  );
}
