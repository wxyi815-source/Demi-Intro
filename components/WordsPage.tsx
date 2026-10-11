export function WordsPage() {
  return (
    <div className="words-page" aria-label="Words">
      <div className="words-message">
        <p>很高兴认识大家，</p>
        <p className="words-message-line">
          <span>未来</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="./assets/words/closing-words.png" alt="请多关照" draggable={false} />
        </p>
      </div>
    </div>
  );
}
