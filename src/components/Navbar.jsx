import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-gray-200 px-4 py-2 flex justify-between">
      <Link to="/">
        <h1 className="text-2xl font-bold text-pink-500">Spraydom</h1>
      </Link>
      <div className="space-x-4 text-sm sm:text-base">
        <Link to="/" className="hover:text-pink-500">Home</Link>
        <Link to="/audio" className="hover:text-pink-500">Audio</Link>
        <Link to="/daily-routine" className="hover:text-pink-500">Routine</Link>
        <Link to="/mini-games" className="hover:text-pink-500">Games</Link>
        <Link to="/video" className="hover:text-pink-500">Video</Link>
        <Link to="/product" className="hover:text-pink-500">Product</Link>
      </div>
    </nav>
  );
}

export default Navbar;

