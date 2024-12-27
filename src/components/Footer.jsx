import './Footer.css';

function Footer() {

  return (
    <footer className="footer">
      <div className="footer-links">
        <button>About</button>
        <button>Support</button>
        <button>Terms of Service</button>
        <button>Privacy Policy</button>
      </div>
      <div className="social-media">
        <a href="#" target="_blank">
          <img src="../assets/facebook-icon.png" alt="Facebook" />
        </a>
        <a href="#" target="_blank">
          <img src="../assets/x-icon.png" alt="X" />
        </a>
        <a href="#" target="_blank">
          <img src="../assets/instagram-icon.png" alt="Instagram" />
        </a>
        <a href="#" target="_blank">
          <img src="../assets/youtube-icon.png" alt="YouTube" />
        </a>
      </div>
      <p>Made by Rocky Wang</p>
      <p>ICS4U1-10</p>
      <p>Mr. O. Qayum</p>
      <p>&copy; 2024 Rocky Streaming Services. All rights reserved.</p>
    </footer>
  )
}

export default Footer;