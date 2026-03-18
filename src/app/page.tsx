"use client";

import { useState, useEffect } from "react";

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

  // ロード係🤖：「アプリを開いた最初の一回だけ」動く！
  useEffect(() => {
    // 秘密のポケット（localStorage）から "lunch-memory" という名前のメモを探す
    const savedData = localStorage.getItem("lunch-memory");

    if (savedData) {
      // メモが見つかったら、暗号（文字列）を元のリスト（配列）に翻訳して、箱を上書きする！
      setLunch((prev) => ({
        ...prev,
        candidates: JSON.parse(savedData),
      }));
    }
  }, []);

  useEffect(() => {
    // ランチの候補リストが変わるたびに、秘密のポケット（localStorage）に新しいメモを保存する！
    localStorage.setItem("lunch-memory", JSON.stringify(lunch.candidates));
  }, [lunch.candidates]);

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

  const onDeleteItem = (indexToRemove: number) => {
    if (lunch.candidates.length <= 1) {
      alert("候補は最低1つは必要です！🥺");
      return;
    }

    const newCandidates = lunch.candidates.filter((_, index) => index !== indexToRemove);

    setLunch({
      candidates: newCandidates,
      selectedLunch: lunch.selectedLunch,
      comment: lunch.comment,
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

  // =======================================================
  // シェア機能
  // =======================================================
  const onShare = async () => {
    // シェアする文章を準備！
    const shareText = `今日のランチは【${lunch.selectedLunch}】に決定！🍱✨\n💡 ${lunch.comment}\n\n#今日のランチ決定くん`;
    const shareUrl = window.location.href; // 今のアプリのURL

    if (navigator.share) {
      // スマホなど、シェア機能に対応している場合（下からシュッと画面が出る！）
      try {
        await navigator.share({
          title: "今日のランチ決定くん",
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        console.log("シェアをキャンセルしました");
      }
    } else {
      // パソコンなど、シェア機能に対応していない場合は「コピー」してあげる優しい設計！
      navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      alert("結果をコピーしました！SNSに貼り付けてね！📋✨");
    }
  };

  return (
    // ▼ 変更①: min-h-[100dvh] で画面ピッタリに！さらに全体を中央寄せ（justify-center）！余白も p-4 でコンパクトに！
    <div className="min-h-[100dvh] bg-orange-50 flex flex-col items-center justify-center p-4 font-sans text-gray-800 overflow-hidden">
      {/* 文字もスマホ向けに少し小さく調整 */}
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-orange-600">今日のランチ決定くん</h1>

      {/* ▼ 変更②: w-[500px] をやめて、w-full max-w-md（伸縮自在の箱）に！ */}
      <div className="bg-white w-full max-w-md rounded-2xl shadow-sm border-2 border-orange-200 p-4 mb-4 flex flex-col items-center">
        <h2 className="text-lg font-bold text-orange-700 mb-4 flex items-center gap-2">📋 本日のランチ候補一覧</h2>

        <div className="flex flex-wrap justify-center gap-2">
          {lunch.candidates.map((item, index) => (
            <span
              key={index}
              className="flex items-center gap-1 bg-white border-2 border-orange-200 text-orange-700 pl-3 pr-2 py-1.5 rounded-lg font-bold text-sm shadow-sm"
            >
              {item}
              <button
                onClick={() => onDeleteItem(index)}
                className="text-orange-300 hover:text-red-500 font-black px-1.5 py-0.5 rounded-full transition-colors"
                title="削除"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* ▼ 変更③: 入力欄も w-full max-w-md に！ */}
      <div className="flex gap-2 mb-6 w-full max-w-md">
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

      {/* ▼ ボタン周りの余白（mb-12）も（mb-6）に縮めてコンパクトに！ */}
      <button
        onClick={onDecide}
        className="mb-6 bg-orange-500 text-white px-8 py-3 rounded-full font-bold text-lg shadow-md hover:bg-orange-600 transition-transform active:scale-95"
      >
        今日のランチを決める！ 🎲
      </button>

      {/* ▼ 変更④: 結果の枠も w-full max-w-md にして、高さを少しスリムに！ */}
      {lunch.selectedLunch && (
        <div className="bg-white w-full max-w-md rounded-3xl shadow-xl p-6 text-center border-4 border-orange-400 min-h-[180px] flex flex-col justify-center animate-bounce">
          <h2 className="text-base font-bold text-gray-400 mb-2">今日のランチは...</h2>
          <div className="text-4xl font-black mb-3 text-orange-500">{lunch.selectedLunch}</div>
          <p className="text-orange-600 font-bold text-sm bg-orange-100 py-1.5 px-4 mb-3 rounded-full inline-block">
            💡 {lunch.comment}
          </p>

          <button
            onClick={onShare}
            className="flex items-center justify-center gap-2 bg-blue-500 text-white px-5 py-2 rounded-full font-bold text-sm shadow hover:bg-blue-600 transition-colors active:scale-95"
          >
            結果をみんなにシェアする 🚀
          </button>
        </div>
      )}
    </div>
  );
}
