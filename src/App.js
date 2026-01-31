import React from "react";
import { Routes, Route } from "react-router-dom";

// Public
import LandingPage from "./Component/LandingPage";
import Support from "./Component/Support";
import TrustWalletConnect from "./Component/TrustWalletConnect";
import SendBTC from "./Component/SendBTC";
import CreditCards from "./Component/DebitCards";
import GetStarted from "./Component/GetStarted";
import CreateAccount from "./Component/CreateAccount";
import LoginPage from "./Component/LoginPage";
import ForgotPassword from "./Component/ForgotPassword";
import VerificationCode from "./Component/VerificationCode";
import ForgotVerificationCode from "./Component/ForgotVerificationCode";
import NewPassword from "./Component/NewPassword";
import PasswordResetSuccess from "./Component/PasswordResetSuccess";
import Transferotp from "./Component/Transferotp";

// User
import Dashboard from "./HomeComponent/Dashboard";
import BitcoinWallet from "./HomeComponent/BitcoinWallet";
import ReceivePage from "./HomeComponent/ReceivePage";
import SendTransfer from "./HomeComponent/SendTransfer";
import AllTransactions from "./HomeComponent/AllTransactions";
import ReferEarn from "./HomeComponent/ReferEarn";
import Report from "./HomeComponent/Report";
import UserForm from "./HomeComponent/UserForm";
import SelectCurrency from "./HomeComponent/SelectDepositCurrency";
import BitcoinPayment from "./HomeComponent/BitcoinPayment";
import UserDeposit from "./HomeComponent/UserDeposite";
import BalReceive from "./HomeComponent/BalReceive";

// ✅ Transaction Receipt (USED BY HISTORY)
import HistoryTransactionReceipt from "./HomeComponent/HistoryTransactionReceipt";

// Admin
import AdminPanel from "./ADMIN/AdminPanel";
import Userdetails from "./ADMIN/Userdetails";
import AdminSupport from "./ADMIN/AdminSupport";
import AdminReport from "./ADMIN/AdminReport";
import AdminAccountCreate from "./ADMIN/AdminAccountCreate";
import AdminDeposit from "./ADMIN/AdminDeposit";
import TransactionReceipt from "./HomeComponent/TransactionReceipt";
import AdminHistory from "./ADMIN/AdminHistory";
import AdWalletApp from "./ADMIN/AdminWalletApp";
import AdminCardActivation from "./ADMIN/AdminCardActivation";
import AdminCardUsers from "./ADMIN/AdminPendingCard";
import AdAllBulk from "./ADMIN/AdAllBulk";
import AdBulktransaction from "./ADMIN/adBulkTransaction";

 // Admin-only if needed

function App() {
  return (
    <Routes>

      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/support" element={<Support />} />
      <Route path="/trustwalletconnect" element={<TrustWalletConnect />} />
      <Route path="/sendbtc" element={<SendBTC />} />
      <Route path="/creditcards" element={<CreditCards />} />
      <Route path="/getstarted" element={<GetStarted />} />
      <Route path="/createaccount" element={<CreateAccount />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route path="/verificationcode" element={<VerificationCode />} />
      <Route path="/forgotverificationcode" element={<ForgotVerificationCode />} />
      <Route path="/newpassword" element={<NewPassword />} />
      <Route path="/passwordresetsuccess" element={<PasswordResetSuccess />} />
      <Route path="/transferotp" element={<Transferotp />} />
      <Route path="/balreceive" element={<BalReceive/>} />

      {/* User */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/bitcoinwallet" element={<BitcoinWallet />} />
      <Route path="/receive" element={<ReceivePage />} />
      <Route path="/send" element={<SendTransfer />} />
      <Route path="/history" element={<AllTransactions />} />
      <Route path="/transaction/:id" element={<HistoryTransactionReceipt />} />
      <Route path="/referearn" element={<ReferEarn />} />
      <Route path="/report" element={<Report />} />
      <Route path="/userform" element={<UserForm />} />
      <Route path="/select-deposit-currency" element={<SelectCurrency />} />
      <Route path="/bitcoinpayment" element={<BitcoinPayment />} />
      <Route path="/deposit" element={<UserDeposit />} />

      {/* Admin */}
      <Route path="/admin-panel" element={<AdminPanel />} />
      <Route path="/userdetail" element={<Userdetails />} />
      <Route path="/adminsupport" element={<AdminSupport />} />
      <Route path="/adminreport" element={<AdminReport />} />
      <Route path="/adminaccountcreate" element={<AdminAccountCreate />} />
      <Route path="/deposit-wallet" element={<AdminDeposit />} />
     <Route path="/transaction/:id" element={<TransactionReceipt />} />


      <Route path="/Adminhistory" element={<AdminHistory />} />
      <Route path="/adwalletApp" element={<AdWalletApp />} />
      <Route path="/adcardactivation" element={<AdminCardActivation/>}/>
      <Route path="/admincardusers" element={<AdminCardUsers/>}/>
      <Route path="/adminallbulk" element={<AdAllBulk/>}/> 
      <Route path="/adbulktransaction" element={<AdBulktransaction/>}/>


    </Routes>
  );
}

export default App;
