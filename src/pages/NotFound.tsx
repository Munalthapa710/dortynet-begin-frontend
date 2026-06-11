import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";

export default function NotFound() {
  return <div className="grid min-h-[60vh] place-items-center text-center"><div><p className="text-sm font-bold text-teal-700">404</p><h1 className="mt-2 text-3xl font-bold text-slate-900">Page not found</h1><p className="mt-2 text-slate-500">The page you requested does not exist.</p><Link to="/"><Button className="mt-6">Back to dashboard</Button></Link></div></div>;
}
