"use client";

import { useState } from "react";

type LunchState = {
  candidates: string[];
  selectedLunch: string | null;
  comment: string | null;
};

export default function LunchDeciderApp() {
  const [lunch, setLunch] = useState<LunchState>({
    candidates: ["ラーメン", "カレー", "パスタ", "ハンバーガー", "定食"],
    selectedLunch: null,
    comment: null,
  });

  const [newItem, setNewItem] = useState("");

  const comments: Record<string, string> = {
    ラーメン: "がっつりいきましょう！",
    カレー: "元気を出したい日に！",
    パスタ: "おしゃれに麺気分！",
    ハンバーガー: "手軽にガッツリ！",
    定食: "バランス良く栄養補給！",
  };

  const onAddItem = () => {
    if (newItem === "") return;
    setLunch({
      candidates: [...lunch.candidates, newItem],
      selectedLunch: lunch.selectedLunch,
      comment: lunch.comment,
    });
    setNewItem("");
  };

  // 新しい魔法：「×」ボタンが押された時に、その項目を消す！
  const onDeleteItem = (indexToRemove: number) => {
    // おまけのUX：最後の1個は消せないようにする（ルーレットが壊れちゃうから！）
    if (lunch.candidates.length <= 1) {
      alert("候補は最低1つは必要です！🥺");
      return;
    }

    // プロの必殺技「filter（フィルター）」！
    // 「今押された×ボタンの背番号（indexToRemove）」と「違う背番号」のものだけを生き残らせる！
    const newCandidates = lunch.candidates.filter((_, index) => index !== indexToRemove);

    // 生き残ったメンバーで箱を上書きする！
    setLunch({
      candidates: newCandidates,
      selectedLunch: lunch.selectedLunch, // 選ばれた結果はそのままキープ
      comment: lunch.comment, // コメントもそのままキープ
    });
  };

  const onDecide = () => {
    const randomIndex = Math.floor(Math.random() * lunch.candidates.length);
    const randomFood = lunch.candidates[randomIndex];
    const foodComment = comments[randomFood] || "今日の気分にぴったりのチョイス！";

    setLunch({
      candidates: lunch.candidates,
      selectedLunch: randomFood,
      comment: foodComment,
    });
  };

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col items-center py-20 font-sans text-gray-800 overflow-x-hidden">
      <h1 className="text-4xl font-bold mb-8 text-orange-600">🍱 ランチDecider</h1>

      <div className="flex flex-wrap justify-center gap-3 mb-8 w-[500px]">
        {lunch.candidates.map((item, index) => (
          <span
            key={index}
            className="flex items-center gap-2 bg-white border-2 border-orange-200 text-orange-700 pl-4 pr-2 py-2 rounded-lg font-bold shadow-sm"
          >
            {item}
            {/* これが新しく追加した「×」ボタンです！ */}
            <button
              onClick={() => onDeleteItem(index)}
              className="text-orange-300 hover:text-red-500 font-black px-2 py-1 rounded-full transition-colors"
              title="削除"
            >
              ×
            </button>
          </span>
        ))}
      </div>

      <div className="flex gap-2 mb-8 w-96">
        <input
          type="text"
          placeholder="例: 焼肉、お寿司"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg border-2 border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm"
        />
        <button
          onClick={onAddItem}
          className="bg-orange-400 text-white px-4 py-2 rounded-lg font-bold shadow-sm hover:bg-orange-500 transition-colors"
        >
          追加 ＋
        </button>
      </div>

      <button
        onClick={onDecide}
        className="mb-12 bg-orange-500 text-white px-8 py-4 rounded-full font-bold text-xl shadow-md hover:bg-orange-600 transition-transform active:scale-95"
      >
        今日のランチを決める！ 🎲
      </button>

      {/* ▼ 超シンプル！「lunch.selectedLunch」に中身がある時だけ、永遠にバウンド（animate-bounce）させる！ */}
      <div
        className={`bg-white w-96 rounded-3xl shadow-xl p-8 text-center border-4 border-orange-400 min-h-[230px] flex flex-col justify-center
          ${lunch.selectedLunch ? "animate-bounce" : ""}`}
      >
        {lunch.selectedLunch ? (
          <div>
            <h2 className="text-lg font-bold text-gray-400 mb-2">今日のランチは...</h2>

            <div className="text-5xl font-black mb-4 text-orange-500">{lunch.selectedLunch}</div>

            <p className="text-orange-600 font-bold text-lg bg-orange-100 py-2 px-4 rounded-full inline-block">
              💡 {lunch.comment}
            </p>
          </div>
        ) : (
          <p className="text-gray-400 font-medium">ボタンを押して運命のランチを決定！</p>
        )}
      </div>
    </div>
  );
}
