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

export const coinIconMap = {
  BTC: btc,
  ETH: eth,
  BNB: bnb,
  SOL: sol,
  XRP: xrp,
  DOGE: doge,
  LTC: ltc,
  TRX: trx,
  USDT: usdt,
  USDT_BNB: usdt,
  USDT_Tether: usdttether,
};

export const getCoinIcon = (coin, sub) => {
  if (!coin) return btc;

  const key =
    coin === "USDT" && sub
      ? `${coin}_${sub.replace(" ", "")}`
      : coin;

  return coinIconMap[key] || coinIconMap[coin] || btc;
};
