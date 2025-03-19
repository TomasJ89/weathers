import React from 'react';

function Footer() {
    return (
        <footer className="footer sm:footer-horizontal footer-center bg-[#E5E7EB] text-base-content p-4">
            <aside>
                <p>Copyright © {new Date().getFullYear()} - All right reserved by
                     <a className="hover:underline ml-1"  href="https://tomasjarutis.netlify.app/" target="_blank">Tomas Jarutis</a></p>
            </aside>
        </footer>
    );
}

export default Footer;