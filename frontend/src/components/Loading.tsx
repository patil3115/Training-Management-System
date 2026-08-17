interface LoadingProps {
  message?: string;
}

export default function Loading({ message = 'Loading...' }: LoadingProps) {
  return (
    <div className="loading-container">
      <div className="loading-spinner" />
      <p className="loading-message">{message}</p>
    </div>
  );
}
