
function ResultPanel({ result }) {
  return (
    <section className="panel results">
      <div className="results-heading">
        <div>
          <p className="eyebrow">REZULTAT GENERAT</p>
        </div>
      </div>

      <div className="result-text">{result}</div>
    </section>
  );
}

export default ResultPanel;
