import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../components/Button";
import { FiHome } from "react-icons/fi";

export default function NotFound() {
  return (
    <div className="flex pt-35 items-center justify-center bg-light px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-8xl sm:text-9xl font-extrabold text-primary/20">
          404
        </h1>
        <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-dark">
          Page Not Found
        </h2>
        <p className="mt-3 text-muted max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8">
          <Link to="/">
            <Button size="lg">
              <FiHome /> Back to Home
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}