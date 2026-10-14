// The source React Router app registers no catch-all route, so an unknown URL
// rendered an empty <main> between the Navbar and the Footer. Returning null
// keeps that behaviour instead of adding a new 404 page.
export default function NotFound() {
  return null
}
