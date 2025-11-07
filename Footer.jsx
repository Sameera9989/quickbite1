export default function Footer() {
  return (
    <footer className="mt-10 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
        <div>
          <div className="text-lg font-bold text-primary">QuickBite</div>
          <p className="text-zinc-600 mt-2">Fast. Fresh. Delivered to your door.</p>
        </div>
        <div>
          <div className="font-semibold mb-2">Contact Us</div>
          <div className="space-y-1 text-zinc-700">
            <div>Email: <a className="text-primary" href="mailto:support@quickbite.test">support@quickbite.test</a></div>
            <div>Phone: <a className="text-primary" href="tel:+1800123456">+1 800 123 456</a></div>
            <div>Address: 123 Food Street, Bengaluru</div>
          </div>
        </div>
        <div>
          <div className="font-semibold mb-2">Follow</div>
          <div className="flex gap-3 text-zinc-700">
            <a href="#" className="hover:text-primary">Instagram</a>
            <a href="#" className="hover:text-primary">Twitter</a>
            <a href="#" className="hover:text-primary">Facebook</a>
          </div>
        </div>
      </div>
      <div className="text-xs text-center text-zinc-500 pb-6">© {new Date().getFullYear()} QuickBite. All rights reserved.</div>
    </footer>
  )
}
