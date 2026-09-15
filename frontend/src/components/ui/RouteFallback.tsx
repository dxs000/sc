import Spinner from "./Spinner";

const RouteFallback = () => {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-canvas">
      <Spinner size="lg" />
    </div>
  );
};

export default RouteFallback;
