export default function Footer(){
  return (
    <footer className="bg-gray-50 border-t mt-12">
      <div className="max-w-7xl mx-auto px-4 py-6 text-sm text-gray-600">
        © {new Date().getFullYear()} Church Directory. All rights reserved.
      </div>
    </footer>
  )
}