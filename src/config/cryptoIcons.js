// src/config/cryptoIcons.js

import btc from "../assets/btc.png";
import eth from "../assets/eth.png";
import bnb from "../assets/bnb.png";
import sol from "../assets/sol.png";
import xrp from "../assets/xrp.png";
import doge from "../assets/doge.png";
import ltc from "../assets/ltc.png";
import trx from "../assets/trx.png";
import usdt from "../assets/usdt.png";
import usdttether from "../assets/usdttether.png";


// 🔐 CENTRAL ICON MAP
const ICONS = {
  btc,
  eth,
  bnb,
  sol,
  xrp,
  doge,
  ltc,
  trx,

  // USDT NETWORKS
  usdt: usdt,
  usdttron: usdttether,
  usdtbnb: usdt,
  usdttrc20: usdttether,
  usdtbep20: usdt,

};

// 🛡 SAFE FALLBACK
const DEFAULT_ICON = btc;

export const getCryptoIcon = (symbol = "") => {
  const key = symbol.toLowerCase();
  return ICONS[key] || DEFAULT_ICON;
};
