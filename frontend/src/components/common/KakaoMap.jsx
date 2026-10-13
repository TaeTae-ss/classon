import { useEffect, useRef, useState } from "react";

const KAKAO_KEY = import.meta.env.VITE_KAKAO_MAP_KEY;
const BOX = "overflow-hidden rounded-xl aspect-[2] bg-[#f0eee8]";

let sdk;

// SDK 스크립트는 최초 한 번만 로드하고 이후에는 같은 Promise를 재사용
const loadKakaoMaps = () =>
  (sdk ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_KEY}&libraries=services&autoload=false`;
    script.onload = () => window.kakao.maps.load(() => resolve(window.kakao.maps));
    script.onerror = () => {
      sdk = undefined;
      script.remove();
      reject(new Error("카카오맵 SDK 로드 실패"));
    };
    document.head.appendChild(script);
  }));

// 도로명 주소를 좌표로 변환해 지도와 마커를 표시하고, 실패하면 children을 대신 보여준다
export function KakaoMap({ address, children }) {
  const ref = useRef(null);
  const [failedAddress, setFailedAddress] = useState(null);
  const failed = !KAKAO_KEY || !address || failedAddress === address;

  useEffect(() => {
    if (!KAKAO_KEY || !address) return;
    let cancelled = false;

    loadKakaoMaps()
      .then((maps) => {
        new maps.services.Geocoder().addressSearch(address, (result, status) => {
          if (cancelled || !ref.current) return;
          if (status !== maps.services.Status.OK) return setFailedAddress(address);

          const position = new maps.LatLng(result[0].y, result[0].x);
          const map = new maps.Map(ref.current, { center: position, level: 3 });
          new maps.Marker({ map, position });
        });
      })
      .catch((err) => {
        console.error("카카오맵 표시 실패:", err);
        if (!cancelled) setFailedAddress(address);
      });

    return () => {
      cancelled = true;
    };
  }, [address]);

  if (failed) return <div className={`${BOX} grid place-items-center`}>{children}</div>;

  return <div ref={ref} className={BOX} />;
}
