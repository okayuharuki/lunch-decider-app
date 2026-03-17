"use client";

import { useState } from "react";

export default function LunchDecider() {
  const [candidate, setCandidate] = useState("");
  const [list, setList] = useState<string[]>([]);
  const [result, setResult] = useState("");

  const handleAdd = () => {
    if (candidate !== "") {
      setList([...list, candidate]);
      setCandidate("");
      setResult("");
    }
  };

  const handleDelete = (indexToRemove: number) => {
    const newList = list.filter((_, index) => index !== indexToRemove);
    setList(newList);
  };

  const handleDecide = () => {
    if (list.length === 0) return;
    const randomIndex = Math.floor(Math.random() * list.length);
    setResult(list[randomIndex]);
  };

  return (
    // 画面全体：背景を薄いオレンジにして、ど真ん中に配置
    <main className="min-h-screen bg-orange-50 flex items-center justify-center p-4">
      
      {/* 白いカード型の枠組み */}
      <div className="bg-white max-w-md w-full rounded-3xl shadow-xl p-8 border-t-8 border-orange-400">
        <h1 className="text-2xl font-bold mb-6 text-center text-orange-800">
          🍔 今日のランチ決定くん
        </h1>

        {/* 入力エリア（横並び） */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={candidate}
            onChange={(e) => setCandidate(e.target.value)}
            placeholder="例：ラーメン"
            className="flex-1 border-2 border-orange-200 rounded-lg p-3 focus:outline-none focus:border-orange-500 transition-colors"
          />
          <button
            onClick={handleAdd}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            追加
          </button>
        </div>

        {/* 候補リストエリア */}
        <div className="mb-8 min-h-[120px]">
          <h2 className="text-sm font-bold text-gray-500 mb-3">
            現在の候補（{list.length}件）
          </h2>
          
          {list.length === 0 ? (
            // 候補が0件の時のメッセージ（点線で囲む）
            <p className="text-center text-gray-400 py-6 border-2 border-dashed border-gray-200 rounded-lg">
              候補を入力して追加してね！
            </p>
          ) : (
            <ul className="space-y-2">
              {list.map((item, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center bg-orange-100 px-4 py-3 rounded-lg text-orange-900 font-medium"
                >
                  <span>{item}</span>
                  <button
                    onClick={() => handleDelete(index)}
                    className="text-orange-400 hover:text-red-500 text-2xl font-bold px-2 leading-none"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 決定ボタン */}
        <button
          onClick={handleDecide}
          disabled={list.length === 0} // 候補が0件の時は押せなくする！
          className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white font-bold py-4 rounded-full shadow-md transition-all active:translate-y-1 text-lg"
        >
          どれにするか決める！
        </button>

        {/* 結果発表エリア */}
        {result !== "" && (
          <div className="mt-8 p-6 bg-yellow-50 border-4 border-yellow-400 rounded-xl text-center animate-bounce">
            <p className="text-sm font-bold text-yellow-800 mb-2">
              今日のご飯は……
            </p>
            <p className="text-4xl font-black text-red-600 my-4">
              「{result}」
            </p>
            <p className="text-sm font-bold text-yellow-800 mt-2">
              に決定！！
            </p>
          </div>
        )}
      </div>
    </main>
  );
}