import { useEffect, useState } from "react";

const CountdownTimer = ({ eventDate }) => {
  const calculateTimeLeft = () => {
    const difference = new Date(eventDate) - new Date();
    if (difference <= 0) return null;

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [eventDate]);

  if (!timeLeft) {
    return <span className="text-red-600 font-semibold">Event Started!</span>;
  }

  return (
    <div className="flex items-center space-x-2 text-2xl text-gray-800 dark:text-gray-200">
      <span className="flex flex-col justify-center items-center bg-blue-200 dark:bg-blue-900/30 px-3 py-2 rounded-lg w-20">
        <span className="text-2xl font-extrabold">{timeLeft.days}</span><small>days</small>
      </span>
      <span className="flex flex-col justify-center items-center bg-blue-200 dark:bg-blue-900/30 px-3 py-2 rounded-lg w-20">
        <span className="text-2xl font-extrabold">{timeLeft.hours}</span><small>hrs</small>
      </span>
      <span className="flex flex-col justify-center items-center bg-blue-200 dark:bg-blue-900/30 px-3 py-2 rounded-lg w-20">
        <span className="text-2xl font-extrabold">{timeLeft.minutes}</span><small>mins</small>
      </span>
      <span className="flex flex-col justify-center items-center bg-blue-200 dark:bg-blue-900/30 px-3 py-2 rounded-lg w-20">
        <span className="text-2xl font-extrabold">{timeLeft.seconds}</span><small>secs</small>
      </span>
    </div>
  );
};

export default CountdownTimer;
