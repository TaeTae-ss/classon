import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import NoticeListPage from "./pages/notice/NoticeListPage";
import NoticeReadPage from "./pages/notice/NoticeReadPage";
import AdminNoticeListPage from "./pages/notice/AdminNoticeListPage";
import AdminNoticeReadPage from "./pages/notice/AdminNoticeReadPage";
import NoticeRegisterPage from "./pages/notice/NoticeRegisterPage";
import NoticeModifyPage from "./pages/notice/NoticeModifyPage";

function App() {
  const [count, setCount] = useState(0)
  const [noticeView, setNoticeView] = useState("list");
  const [selectedNoticeNo, setSelectedNoticeNo] = useState(null);

  return (
    <>
      

      <button type="button"
    onClick={() => {
        setSelectedNoticeNo(null);
        setNoticeView("adminList");}}>
    관리자 공지 관리
      </button>

     {noticeView === "list" && (
    <NoticeListPage
        onRead={(notNo) => {
            setSelectedNoticeNo(notNo);
            setNoticeView("read");
        }}/>)}
        
      {noticeView === "read" && (
        <NoticeReadPage
        notNo={selectedNoticeNo}
        onList={() => {
            setSelectedNoticeNo(null);
            setNoticeView("list");
        }}/>)}
        
        {noticeView === "adminList" && (
    <AdminNoticeListPage
        onRegister={() => {
            setNoticeView("register");}}
        onRead={(notNo) => {
            setSelectedNoticeNo(notNo);
            setNoticeView("adminRead");}}
        onModify={(notNo) => {
            setSelectedNoticeNo(notNo);
            setNoticeView("modify");
        }}/>)}
        
        {noticeView === "register" && (
    <NoticeRegisterPage
        onCancel={() => {
            setNoticeView("adminList");}}
        onSuccess={() => {
            setNoticeView("adminList");}}/>)}
            
            {noticeView === "adminRead" && (
    <AdminNoticeReadPage
        notNo={selectedNoticeNo}
        onList={() => {
            setSelectedNoticeNo(null);
            setNoticeView("adminList");}}
        onModify={() => {
            setNoticeView("modify");}}
        onDeleted={() => {
            setSelectedNoticeNo(null);
            setNoticeView("adminList");}}/>)}
            
            {noticeView === "modify" && (
    <NoticeModifyPage
        notNo={selectedNoticeNo}
        onCancel={() => {
            setNoticeView("adminRead");}}
        onSuccess={() => {
            setNoticeView("adminRead");}}/>)}

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App;
