function Header() {
  return (
    <header className="flex flex-wrap items-center justify-between border-b border-solid border-b-[#000000] px-6 py-3 md:px-10">
      <div className="flex items-center gap-3 text-[#131711]">
        <div className="size-6 md:size-8">
          <img src="porquinho.png" alt="Logo Finansable" className="w-full h-full" />
        </div>
        <h2 className="text-[#264533] text-2xl md:text-2xl font-bold leading-tight tracking-[-0.015em]">Finansable</h2>
      </div>

      <div className="flex flex-1 justify-end items-center gap-4 md:gap-8 mt-3 md:mt-0 flex-wrap md:flex-nowrap">
        <nav className="hidden sm:flex items-center gap-4 md:gap-9">
          <a className="text-[#264533] text-sm font-medium" href="#">Dashboard</a>
          <a className="text-[#264533] text-sm font-medium" href="#">Transações</a>
          <a className="text-[#264533] text-sm font-medium" href="#">Metas</a>
          <a className="text-[#264533] text-sm font-medium" href="#">Relatórios</a>
        </nav>

        <button className="flex items-center justify-center h-9 w-9 md:h-10 md:w-10 bg-[#264533] rounded-lg text-[#FFFFFF]">
          <i class="fa-regular fa-bell"></i>
        </button>

        <div
          className="bg-center bg-no-repeat bg-cover rounded-full size-9 md:size-10"
          style={{ backgroundImage: 'url("https://avatars.githubusercontent.com/u/160288170?v=4")' }}>
        </div>
      </div>
    </header>
  );
}

export default Header;
