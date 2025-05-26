export default function Footer() {
  return (
    <footer className="w-full bg-gray-200 text-gray-600 text-center py-4 shadow-inner">
      © {new Date().getFullYear()} <span className="font-semibold">Freelucy</span> · Todos los derechos reservados.
    </footer>
  );
}
