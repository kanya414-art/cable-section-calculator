document.addEventListener("DOMContentLoaded", () => {
  const els = {
    cableType: document.getElementById("cableType"),
    section: document.getElementById("section"),
    voltage: document.getElementById("voltage"),
    current: document.getElementById("current"),
    distance: document.getElementById("distance"),
    result: document.getElementById("result"),
    calcBtn: document.getElementById("calcBtn")
  };

  console.log("✅ ページ読み込み完了");

  fetch("./cable_data.json")
    .then(res => {
      console.log("📡 JSONレスポンス:", res.status);
      return res.json();
    })
    .then(data => {
      console.log("✅ JSON読込成功:", Object.keys(data).length, "件");

      // ケーブル種類をプルダウンに追加
      Object.keys(data).forEach(name => {
        const opt = document.createElement("option");
        opt.value = name;
        opt.textContent = `${name}（${data[name].material}）`;
        els.cableType.appendChild(opt);
      });

      // 計算ボタン押下イベント
      els.calcBtn.addEventListener("click", () => {
        const type = els.cableType.value;
        const S = parseFloat(els.section.value);
        const V = parseFloat(els.voltage.value);
        const I = parseFloat(els.current.value);
        const L = parseFloat(els.distance.value);

        if (!type || isNaN(V) || isNaN(I) || isNaN(L) || isNaN(S)) {
          els.result.innerHTML = "<p style='color:red;'>⚠️ 入力値を確認してください。</p>";
          return;
        }

        const cable = data[type];
        const rho = cable.resistivity;
        const tempCoeff = 1 + 0.00393 * (25 - 20); // 温度補正

        // 抵抗値と電圧降下
        const R = (rho * 2 * L / S) * tempCoeff;
        const Vdrop = I * R;
        const V_end = V - Vdrop;
        const percent = (Vdrop / V * 100).toFixed(2);

        // 許容電流の目安
        const allowable = Math.round(S * 10);

        els.result.innerHTML = `
          <h3>${type} の計算結果</h3>
          <p>材質: ${cable.material}</p>
          <p>抵抗率: ${rho} Ω·mm²/m</p>
          <p>温度補正後抵抗: ${(R / (2 * L)).toExponential(4)} Ω/m</p>
          <p>電圧降下: ${Vdrop.toFixed(2)} V (${percent}%)</p>
          <p>末端電圧: ${V_end.toFixed(2)} V</p>
          <p>許容電流目安: 約 ${allowable} A</p>
        `;
      });
    })
    .catch(err => {
      console.error("❌ JSON読込エラー:", err);
      els.result.innerHTML = "<p style='color:red;'>ケーブルデータを読み込めませんでした。</p>";
    });
});
