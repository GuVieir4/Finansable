import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

const FooterLink = ({ href, children }) => (
  <li>
    <a 
      href={href} 
      className="text-gray-200 hover:text-[#38e07b] transition-colors duration-200 text-sm"
    >
      {children}
    </a>
  </li>
);

const SocialIcon = ({ href, icon: Icon }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="text-gray-200 hover:text-[#38e07b] transition-colors duration-200"
    aria-label={Icon.displayName || 'Social Link'}
  >
    <Icon size={20} />
  </a>
);

function PersonalFinanceFooter() {
  return (
    <footer className="bg-[#122017] text-white mt-auto border-t border-gray-700">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-10 lg:gap-16">

          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold text-[#38e07b] mb-4 tracking-wider">
              Finansable
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              Soluções de controle financeiro pessoal, planejamento e gestão de finanças individuais. 
              Desenvolvido com paixão por estudantes de tecnologia da UNIMAR.
            </p>
            <div className="flex space-x-4 mt-6">
              <SocialIcon href="#" icon={Facebook} />
              <SocialIcon href="#" icon={Twitter} />
              <SocialIcon href="#" icon={Instagram} />
              <SocialIcon href="#" icon={Linkedin} />
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-semibold text-[#38e07b] mb-2">Assine nossa Newsletter</h3>
              <div className="flex flex-col sm:flex-row gap-2">
                <input 
                  type="email" 
                  placeholder="Seu email" 
                  className="p-2 border border-gray-600 rounded w-full sm:w-auto flex-1 bg-[#1b2a23] text-white placeholder-gray-400"
                />
                <button className="bg-[#38e07b] text-[#122017] px-4 py-2 rounded hover:bg-green-600 transition-colors">
                  Assinar
                </button>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-md font-semibold text-[#38e07b] mb-5 uppercase tracking-wider">
              Produtos
            </h3>
            <ul className="space-y-3">
              <FooterLink href="#">Controle de Gastos Pessoais</FooterLink>
              <FooterLink href="#">Planejamento Orçamentário</FooterLink>
              <FooterLink href="#">Fluxo de Caixa Pessoal</FooterLink>
              <FooterLink href="#">Relatórios Financeiros</FooterLink>
              <FooterLink href="#">Alertas e Notificações</FooterLink>
            </ul>
          </div>

          <div>
            <h3 className="text-md font-semibold text-[#38e07b] mb-5 uppercase tracking-wider">
              Empresa
            </h3>
            <ul className="space-y-3">
              <FooterLink href="#">Sobre Nós</FooterLink>
              <FooterLink href="#">Carreiras</FooterLink>
              <FooterLink href="#">Blog</FooterLink>
              <FooterLink href="#">Parcerias</FooterLink>
              <FooterLink href="#">Imprensa</FooterLink>
            </ul>
          </div>

          <div>
            <h3 className="text-md font-semibold text-[#38e07b] mb-5 uppercase tracking-wider">
              Suporte
            </h3>
            <ul className="space-y-3">
              <FooterLink href="#">FAQ</FooterLink>
              <FooterLink href="#">Ajuda</FooterLink>
              <FooterLink href="#">Termos de Uso</FooterLink>
              <FooterLink href="#">Política de Privacidade</FooterLink>
              <FooterLink href="#">Contato Técnico</FooterLink>
            </ul>
          </div>

          <div>
            <h3 className="text-md font-semibold text-[#38e07b] mb-5 uppercase tracking-wider">
              Contato
            </h3>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-center">
                <MapPin size={16} className="mr-2 text-[#38e07b]" />
                <span>Rua Jeus vs , 1000, Satanas - SP</span>
              </div>
              <div className="flex items-center">
                <Phone size={16} className="mr-2 text-[#38e07b]" />
                <span>(18) 6969-6969</span>
              </div>
              <div className="flex items-center">
                <Mail size={16} className="mr-2 text-[#38e07b]" />
                <span>contato@finansable.com</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-6">
                <img src="/images/visa.png" alt="Visa" className="h-6"/>
                <img src="/images/mastercard.png" alt="Mastercard" className="h-6"/>
                <img src="/images/amex.png" alt="Amex" className="h-6"/>
                <img src="/images/elo.png" alt="Elo" className="h-6"/>
                <img src="/images/boleto.png" alt="Boleto" className="h-6"/>
                <img src="/images/paypal.png" alt="Paypal" className="h-6"/>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-gray-700 text-center">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Finansable. Todos os direitos reservados.
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Desenvolvido por alunos de tecnologia da Universidade de Marília (UNIMAR).
          </p>
        </div>
      </div>
    </footer>
  );
}

export default PersonalFinanceFooter;