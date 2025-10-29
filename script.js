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

  // JSONファイル読み込み
  fetch("./cable_data.json")
    .then(res => res.json())
    .then(data => {
      // ケーブル種類をプルダウンに追加
      Object.keys(data).forEach(name => {
        const opt = document.createElement("option");
        opt.value = name;
        opt.textContent = `${name}（${data[name].material}）`;
        els.cableType.appendChild(opt);
      });

      // 計算ボタン処理
      els.calcBtn.addEventListener("click", () => {
        const type = els.cableType.value;
        const S = parseFloat(els.section.value);
        const V = parseFloat(els.voltage.value);
        const I = parseFloat(els.current.value);
        const L = parseFloat(els.distance.value);

        if (!type || isNaN(V) || isNaN(I) || isNaN(L) || isNaN(S)) {
          els.result.innerHTML = "<p style='color:red;'>入力を確認してください。</p>";
          return;
        }

        const cable = data[type];
        const rho = cable.resistivity;

        // 温度補正係数（仮: 25℃基準）
        const tempCoeff = 1 + 0.00393 * (25 - 20);

        // 抵抗値（往復分×温度補正）
        const R = (rho * 2 * L / S) * tempCoeff;

        // 電圧降下
        const Vdrop = I * R;
        const V_end = V - Vdrop;
        const percent = (Vdrop / V * 100).toFixed(2);

        // 許容電流（簡易モデル）
        const allowable = Math.round(S * 10); // 目安：断面積×10A

        els.result.innerHTML = `
          <h3>${type} の計算結果</h3>
          <p>材質: ${cable.material}</p>
          <p>抵抗率: ${rho} Ω·mm²/m</p>
          <p>温度補正後抵抗: ${(R / (2 * L)).toExponential(4)} Ω/m</p>
          <p>電圧降下: ${Vdrop.
