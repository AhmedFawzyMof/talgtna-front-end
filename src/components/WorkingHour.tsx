import { Alert } from "flowbite-react/components/Alert";
import { Link } from "react-router-dom";

const getEgyptHour = () => {
  const now = new Date();

  const utcHour = now.getUTCHours();

  const egyptOffset = 3;
  const egyptHour = (utcHour + egyptOffset) % 24;

  return egyptHour;
};

export default function WorkingHour() {
  const hour = getEgyptHour();

  const isBefore10AM = hour < 10;
  const isAfter11PM = hour >= 23;

  return (
    <>
      <Alert
        color="info"
        className="flex justify-center items-center font-bold"
      >
        نود أن نخبرك أن هذا التطبيق في إصدار تجريبي، يرجى تزويدنا بأي مشكلات
        واجهتها من خلال صفحة{" "}
        <Link to="/contact" className="underline">
          اتصل بنا
        </Link>
      </Alert>
      {isBefore10AM ||
        (isAfter11PM && (
          <Alert
            color="warning"
            className="flex justify-center items-center font-bold"
          >
            مواعيد العمل من 10ص حتى 11مساء
          </Alert>
        ))}
    </>
  );
}
