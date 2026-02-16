import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Column 1 */}
          <div className="flex flex-col items-start">
            <img
              src="/ATSlogo.png"
              alt="Afrika Tikkun Logo"
              className="h-16 w-auto mb-4"
            />

            <p className="font-bold text-lg mb-4">
              Developing Young People<br />from Cradle to Career
            </p>

            <div className="text-sm text-gray-400">
              <p>NPO: 021 - 892</p>
              <p>PBO: 18/11/13/2470</p>
              <p>NPC: 1998/15327/08</p>
            </div>
          </div>

          {/* Column 2 - Foundation */}
          <div>
            <h4 className="font-bold text-lg mb-4">FOUNDATION</h4>

            <p className="text-sm text-gray-300 mb-4">
              Ground Floor, Eastwood Building<br />
              57 6th Road<br />
              Hyde Park, South Africa<br /><br />
              <a href="tel:+27113255914" className="hover:underline block">
                +27 11 325 5914
              </a>
              <a
                href="mailto:info@afrikatikkun.org"
                className="hover:underline block"
              >
                info@afrikatikkun.org
              </a>
            </p>

            <div className="flex gap-2 mb-4">
              <a
                href="https://afrikatikkun.org/about-us/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-yellow text-sm px-4 py-2"
              >
                MORE
              </a>
              <a
                href="https://afrikatikkun.org/donate/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-pink text-sm px-4 py-2"
              >
                DONATE
              </a>
            </div>

            <div className="flex gap-4 text-gray-400 text-lg">
              <a href="https://www.facebook.com/AfrikaTikkunNPC/" target="_blank" rel="noreferrer">
                <i className="fab fa-facebook-f hover:text-white transition"></i>
              </a>
              <a href="https://www.linkedin.com/company/afrikatikkun/" target="_blank" rel="noreferrer">
                <i className="fab fa-linkedin-in hover:text-white transition"></i>
              </a>
              <a href="https://www.instagram.com/afrikatikkun/" target="_blank" rel="noreferrer">
                <i className="fab fa-instagram hover:text-white transition"></i>
              </a>
              <a href="https://x.com/afrikatikkun" target="_blank" rel="noreferrer">
                <i className="fab fa-x-twitter hover:text-white transition"></i>
              </a>
              <a href="https://www.youtube.com/channel/UCxYPGV4XvhBYqIY8L-cDPTA" target="_blank" rel="noreferrer">
                <i className="fab fa-youtube hover:text-white transition"></i>
              </a>
            </div>
          </div>

          {/* Column 3 - Services */}
          <div>
            <h4 className="font-bold text-lg mb-4">SERVICES</h4>

            <p className="text-sm text-gray-300 mb-4">
              Afrika Tikkun Services<br />
              1 Bond Street, Kensington B,<br />
              Randburg, South Africa<br /><br />
              <a href="tel:+27113256123" className="hover:underline block">
                +27 11 325 6123
              </a>
              <a
                href="mailto:info@afrikatikkunservices.com"
                className="hover:underline block"
              >
                info@afrikatikkunservices.com
              </a>
            </p>

            <div className="flex gap-2 mb-4">
              <a
                href="https://afrikatikkun.org/about-us/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-yellow text-sm px-4 py-2"
              >
                MORE
              </a>
              <a href="/partner" className="btn btn-pink text-sm px-4 py-2">
                PARTNER
              </a>
            </div>

            <div className="flex gap-4 text-gray-400 text-lg">
              <a href="https://www.facebook.com/AfrikaTikkunNPC/" target="_blank" rel="noreferrer">
                <i className="fab fa-facebook-f hover:text-white transition"></i>
              </a>
              <a href="https://www.linkedin.com/company/afrikatikkun/" target="_blank" rel="noreferrer">
                <i className="fab fa-linkedin-in hover:text-white transition"></i>
              </a>
              <a href="https://www.instagram.com/afrikatikkun/" target="_blank" rel="noreferrer">
                <i className="fab fa-instagram hover:text-white transition"></i>
              </a>
              <a href="https://x.com/afrikatikkun" target="_blank" rel="noreferrer">
                <i className="fab fa-x-twitter hover:text-white transition"></i>
              </a>
              <a href="https://www.youtube.com/channel/UCxYPGV4XvhBYqIY8L-cDPTA" target="_blank" rel="noreferrer">
                <i className="fab fa-youtube hover:text-white transition"></i>
              </a>
            </div>
          </div>

          {/* Column 4 - Newsletter */}
          <div>
            <h4 className="font-bold text-lg mb-4">ANNUAL REVIEWS</h4>
            <p className="text-sm text-gray-300 mb-2">
              Subscribe to our newsletter
            </p>
            <h3 className="font-bold text-xl mb-4">Newsletter</h3>

            <form onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Email"
                required
                className="w-full px-4 py-2 rounded-lg mb-2 text-gray-900"
              />
              <button className="btn btn-primary w-full">Send</button>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="text-center text-sm text-gray-400 mt-12 pt-8 border-t border-gray-800 space-y-3">

          <p>
            This project was created by{" "}
            <span className="font-semibold text-white">Commercia</span>{" "}
            and supported by{" "}
            <a
              href="https://fmtali.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white transition"
            >
              FMTALI
            </a>.
          </p>

          <p>© 2026 Afrika Tikkun. All rights reserved.</p>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
