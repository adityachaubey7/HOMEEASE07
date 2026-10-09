import { Link } from 'react-router-dom';
import { EmptyState } from '@/components/ui';

export default function NotFound() {
  return (
    <div className="container page">
      <EmptyState icon="home" title="This page doesn’t exist" action={<Link to="/" className="btn btn--primary">Go to home</Link>}>
        The link may be old, or the service may have moved. Search or browse from the home page.
      </EmptyState>
    </div>
  );
}
