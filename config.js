/*
 * UIタイムアタック注文端末 設定ファイル
 * SEND_ENDPOINT_URL は Google Apps Script の doPost 受付URLに差し替えてください．
 * 画面右上の「設定」からも端末ごとに変更できます．
 */
window.UI_TIME_ATTACK_CONFIG = {
  SEND_ENDPOINT_URL: "https://script.google.com/macros/s/AKfycbzt9R72D3M_-eq2WueXX7E_4hJPrsoCGiCRHCA_-i8gsNT5oiMYmkZBz-KLtMxC8maQoQ/exec",
  DEVICE_ID: "iPad01",
  EVENT_ID: "OC2026_01",
  SOURCE: "opencampus",
  SEND_MODE: "no-cors", // "no-cors" または "cors"
  ENABLE_AUDIO: true,
  BGM_SOURCE: "audio/bgm.mp3",
  CLICK_SOURCE: "audio/click.mp3",
  COUNTDOWN_SECONDS: 3,
  THANKS_SECONDS: 2
};
