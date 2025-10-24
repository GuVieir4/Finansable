function Footer() {
    return (
        <footer class="bg-[#122017] border-t border-black/10 dark:border-white/10 mt-auto">
            <div class="container mx-auto px-4 py-6">
                <div class="flex flex-col md:flex-row justify-between items-center">
                    <p class="text-sm text-black/60 dark:text-white/60">© 2025 Finansable. Todos os direitos reservados.
                    </p>
                    <div class="flex gap-4 mt-4 md:mt-0">
                        <a class="text-sm text-black/60 dark:text-white/60 hover:text-[#38e07b]" href="#">Termos</a>
                        <a class="text-sm text-black/60 dark:text-white/60 hover:text-[#38e07b]" href="#">Privacidade</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;