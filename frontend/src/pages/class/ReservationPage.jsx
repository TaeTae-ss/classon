
import { useEffect, useState } from "react";
import { Navigate, useParams, useSearchParams } from "react-router";

import { getClassDetail } from "../../api/classApi";
import { Empty } from "../../components/common/Empty";

export default function ReservationPage() {
  const { schNo } = useParams();
  const [params] = useSearchParams();

  const clsNo = Number(params.get("clsNo"));
  const selectedSchNo = schNo || params.get("schNo");

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadClass = async () => {
      if (!clsNo || Number.isNaN(clsNo)) {
        setError("클래스 번호가 올바르지 않습니다.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await getClassDetail(clsNo);

        if (!cancelled) {
          setItem(data);
        }
      } catch (err) {
        console.error("클래스 조회 실패:", err);

        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              err.response?.data?.data?.message ||
              "클래스 정보를 불러오지 못했습니다.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadClass();

    return () => {
      cancelled = true;
    };
  }, [clsNo]);

  if (loading) {
    return <p className="p-6">클래스 정보를 불러오는 중입니다...</p>;
  }

  if (error || !item) {
    return (
      <Empty to="/class" label="클래스 목록">
        {error || "클래스를 찾을 수 없습니다."}
      </Empty>
    );
  }

  const classId = item.clsNo ?? item.id;

  const query = selectedSchNo
    ? `?schNo=${encodeURIComponent(selectedSchNo)}`
    : "";

  return (
    <Navigate
      to={`/class/${classId}${query}`}
      replace
    />
  );
}
