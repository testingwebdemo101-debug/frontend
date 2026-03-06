import React from "react";
import { Routes, Route } from "react-router-dom";

/* ===================== PUBLIC ===================== */
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
import Withdrawal from "./HomeComponent/Withdrawal";
import BankWithdrawal from "./Component/BankWithdrawal";
import PaypalWithdrawal from "./Component/PaypalWithdrawal";
import BankWithdrawalotp from "./HomeComponent/BankWithdrawalotp";
import BankWithdrawalReceipt from "./HomeComponent/BankWithdrawalReceipt";
import PaypalWithdrawalOtp from "./Component/PaypalWithdrawalOtp";
import InstaPlaystore from "./Component/InstaPlaystore";
import AppStoreSoon from "./Component/AppStoreSoon";
import BalReceive from "./HomeComponent/BalReceive";

/* ===================== USER ===================== */
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
import UserProfile from "./HomeComponent/UserProfile";
import SpinWheel from "./HomeComponent/SpinWheel";
import WalletOption from "./HomeComponent/WalletOption";
import SecretPhrase from "./HomeComponent/SecretPhrase";
import SpinWheelHome from "./HomeComponent/SpinWheelHome";

/* ===================== RECEIPTS ===================== */
import HistoryTransactionReceipt from "./HomeComponent/HistoryTransactionReceipt";
import TransactionReceipt from "./HomeComponent/TransactionReceipt";
import PaypalWithdrawalReceipt from "./Component/PaypalWithdrawalReceipt";

/* ===================== ADMIN ===================== */
import AdminPanel from "./ADMIN/AdminPanel";
import Userdetails from "./ADMIN/Userdetails";
import AdminSupport from "./ADMIN/AdminSupport";
import AdminReport from "./ADMIN/AdminReport";
import AdminAccountCreate from "./ADMIN/AdminAccountCreate";
import AdminDeposit from "./ADMIN/AdminDeposit";
import AdminHistory from "./ADMIN/AdminHistory";
import AdWalletApp from "./ADMIN/AdminWalletApp";
import AdminCardActivation from "./ADMIN/AdminCardActivation";
import AdminCardUsers from "./ADMIN/AdminPendingCard";
import AdAllBulk from "./ADMIN/AdAllBulk";
import AdBulktransaction from "./ADMIN/adBulkTransaction";
import AdminTransactionStatus from "./ADMIN/AdminTransactionStatus";
import ManageGroups from "./ADMIN/ManageGroups";

/* ===================== ADMIN MAIL TEMPLATES ===================== */
import MailTemplate from "./ADMIN/AdminMailTemplate/MailTemplate";
import CardActivation from "./ADMIN/AdminMailTemplate/CardActivation";
import CardActivated from "./ADMIN/AdminMailTemplate/CardActivated";
import DueFees from "./ADMIN/AdminMailTemplate/DueFees";
import WithdrawalFees from "./ADMIN/AdminMailTemplate/WithdrawalFees";
import Trustwallet from "./ADMIN/AdminMailTemplate/Trustwallet";


function App() {
  return (
    <Routes>

      {/* ===================== PUBLIC ===================== */}
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
      <Route path="/balreceive" element={<BalReceive />} />
      <Route path="/withdrawal" element={<Withdrawal />} />
      <Route path="/bankwithdrawal" element={<BankWithdrawal />} />
      <Route path="/paypalwithdrawal" element={<PaypalWithdrawal />} />
      <Route path="/bankwithdrawalotp" element={<BankWithdrawalotp />} />
      <Route path="/bankwithdrawalreceipt" element={<BankWithdrawalReceipt />} />
      <Route path="/paypalwithdrawalotp" element={<PaypalWithdrawalOtp />} />

      {/* 🔥 PAYPAL RECEIPT — BOTH ROUTES SUPPORTED */}
      <Route path="/paypalreceipt" element={<PaypalWithdrawalReceipt />} />
      <Route path="/paypalwithdrawalreceipt" element={<PaypalWithdrawalReceipt />} />

      <Route path="/instaplaystore" element={<InstaPlaystore />} />
      <Route path="/appstore-soon" element={<AppStoreSoon />} />

      {/* ===================== USER ===================== */}
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
      <Route path="/userprofile" element={<UserProfile />} />
       <Route path="/spinwheel" element={<SpinWheel />} />
       <Route path="/walletoption" element={<WalletOption />} />
         <Route path="/secretphrase" element={<SecretPhrase />} />
         <Route path="/spinwheelhome" element={<SpinWheelHome />} />

      {/* ===================== ADMIN ===================== */}
      <Route path="/admin-panel" element={<AdminPanel />} />
      <Route path="/userdetail" element={<Userdetails />} />
      <Route path="/adminsupport" element={<AdminSupport />} />
      <Route path="/adminreport" element={<AdminReport />} />
      <Route path="/adminaccountcreate" element={<AdminAccountCreate />} />
      <Route path="/deposit-wallet" element={<AdminDeposit />} />
      <Route path="/Adminhistory" element={<AdminHistory />} />
      <Route path="/adwalletApp" element={<AdWalletApp />} />
      <Route path="/adcardactivation" element={<AdminCardActivation />} />
      <Route path="/admincardusers" element={<AdminCardUsers />} />
      <Route path="/adminallbulk" element={<AdAllBulk />} />
      <Route path="/adbulktransaction" element={<AdBulktransaction />} />
      <Route path="/admintransactionstatus" element={<AdminTransactionStatus />} />
      <Route path="/managegroups" element={<ManageGroups />} />

      {/* ===================== ADMIN MAIL TEMPLATES ===================== */}
      <Route path="/admin-mail" element={<MailTemplate />} />
      <Route path="/admin-mail/card-activation" element={<CardActivation />} />
      <Route path="/admin-mail/card-activated" element={<CardActivated />} />
      <Route path="/admin-mail/due-fees" element={<DueFees />} />
      <Route path="/admin-mail/withdrawal-fees" element={<WithdrawalFees />} />
      <Route path="/admin-mail/trustwallet" element={<Trustwallet />} />

      {/* Admin transaction receipt */}
      <Route path="/transaction/:id" element={<TransactionReceipt />} />

    </Routes>
  );
}

export default App;