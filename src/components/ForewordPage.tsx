import "./styles.css";

type ForewordPageProps = {
  romanIndex?: number; // 1-based index for roman page numbering
};

function toRoman(num: number): string {
  if (!num || num < 1) return "";
  const map: [number, string][] = [
    [1000, "m"],
    [900, "cm"],
    [500, "d"],
    [400, "cd"],
    [100, "c"],
    [90, "xc"],
    [50, "l"],
    [40, "xl"],
    [10, "x"],
    [9, "ix"],
    [5, "v"],
    [4, "iv"],
    [1, "i"],
  ];
  let res = "";
  for (const [val, sym] of map) {
    while (num >= val) {
      res += sym;
      num -= val;
    }
  }
  return res;
}

function ForewordPage({ romanIndex }: ForewordPageProps) {
  const roman = romanIndex ? toRoman(romanIndex) : "";
  return (
    <div className="page-content contents-page">
      <div className="recipe-container">
        <div className="recipe-title-container">
          <h2 className="recipe-title">Foreword</h2>
        </div>
        <div className="foreword">
          <p>
            Cooking is one of the simplest ways to turn time into care. It
            slows us down long enough to notice ingredients, to listen for the
            quiet cues of heat, and to share something nourishing with the
            people around us.
          </p>
          <p>
            A good cookbook is more than a list of recipes—it’s a map. It
            points to reliable techniques, offers substitutions when life gets
            messy, and teaches a rhythm you can return to on weeknights or
            weekends alike.
          </p>
          <p>
            In these pages, you’ll find approachable methods framed by clear
            steps and sensible ratios. Treat them as starting points. Taste
            often, season with intention, and let your preferences shape the
            final result.
          </p>
          <p>
            Don’t worry about perfection. Browning will sometimes go further
            than planned, doughs will be stickier than expected, and pans won’t
            always be the right size. Those moments are part of the craft—and
            often where you learn the most.
          </p>
          <p>
            Most of all, enjoy the process. Put on music, breathe in the
            aromatics, and serve with confidence. May this cookbook make your
            kitchen feel a little more welcoming and your table a little more
            full.
          </p>
        </div>
        {roman && <div className="page-number">{roman}</div>}
      </div>
    </div>
  );
}

export default ForewordPage;
