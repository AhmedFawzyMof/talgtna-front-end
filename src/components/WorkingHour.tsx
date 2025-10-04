import { Alert, AlertTitle } from "@/components/ui/alert";

const getEgyptHour = () => {
  const now = new Date();

  const utcHour = now.getUTCHours();

  const egyptOffset = 2;
  const egyptHour = (utcHour + egyptOffset) % 24;

  return egyptHour;
};

export default function WorkingHour() {
  const hour = getEgyptHour();

  const isBefore10AM = hour < 10;
  const isAfter11PM = hour >= 23;

  return (
    <>
      {isBefore10AM || isAfter11PM ? (
        <Alert
          variant={"destructive"}
          className="flex justify-center items-center font-bold"
        >
          <AlertTitle> مواعيد العمل من 12م حتى 11م</AlertTitle>
        </Alert>
      ) : null}
    </>
  );
}
