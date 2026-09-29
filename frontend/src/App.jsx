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
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

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
