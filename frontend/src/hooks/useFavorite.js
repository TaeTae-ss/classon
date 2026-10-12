import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getCookie } from "../util/cookieUtil";
import { getFavorites, postFavorite, deleteFavorite } from "../api/favoriteApi";

export default function useFavorite() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);

  // 찜 목록 조회
  const fetchFavorites = async () => {
    const member = getCookie("member");

    if (!member?.accessToken) {
      setFavorites([]);
      return;
    }

    try {
      const data = await getFavorites();
      console.log("찜 API 응답:", data); 
      
      setFavorites(data);
    } catch (error) {
      console.error("찜 목록 조회 실패:", error);
    }
  };

  // 화면이 처음 나타날 때 찜 목록 조회
  useEffect(() => {
    fetchFavorites();
  }, []);

  // 찜 등록 / 취소
  const handleToggleFavorite = async (clsNo) => {
    const member = getCookie("member");

    if (!member?.accessToken) {
      alert("찜 기능은 로그인 후 이용할 수 있습니다.");
      navigate("/auth/login");
      return;
    }

    try {
      const favorite = favorites.find((f) => f.clsNo === clsNo);

      if (favorite) {
        await deleteFavorite(favorite.favNo);
      } else {
        await postFavorite(clsNo);
      }

      await fetchFavorites();
    } catch (error) {
      console.error("찜 처리 실패:", error);
    }
  };

  return {
    favorites,
    handleToggleFavorite,
    fetchFavorites,
  };
}