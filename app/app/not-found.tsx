import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="text-center px-4">
        <h1 className="display-1 fw-bold text-muted">Coming soon</h1>
        <p className="text-secondary mb-4">This page could not be found.</p>
        <Link href="/" className="btn btn-primary">
          Go Home
        </Link>
      </div>
    </div>
  );
}
