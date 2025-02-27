import { useRef, useState } from "react";
import { MdMenu } from "react-icons/md";
import { useLocalStorageState } from "./useLocalStorageState";
import axios from "axios";

function App() {
  const [link, setLink] = useState("");
  const [shortenedLinks, setShortenedLinks] = useLocalStorageState(
    [],
    "shortenedLinks"
  );
  const [error, setError] = useState("");
  const inputRef = useRef(null);
  function handleGetStarted() {
    window.scrollTo({
      top: 600,
      behavior: "smooth",
    });
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

  // async function handleShortenLink() {
  //   try {
  //     const apiKey = "19645a6f133240f8ac0639c854a832f2";

  //     if (!link) {
  //       throw new Error("Please add a link");
  //     }

  //     if (!/^https?:\/\/[^\s]+$/.test(link)) {
  //       throw new Error("Invalid URL");
  //     }
  //     setError("");
  //     const response = await fetch("https://api.rebrandly.com/v1/links", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         apikey: apiKey,
  //       },
  //       body: JSON.stringify({
  //         destination: link,
  //       }),
  //     });
  //     if (response.status === 429 || response.status === 403) {
  //       throw new Error(
  //         "You have reached the max number of URLs, please try again next month"
  //       );
  //     }
  //     if (!response.ok) {
  //       throw new Error("Failed to shorten the URL");
  //     }
  //     const data = await response.json();
  //     console.log(data);

  //     const newLink = {
  //       original: link,
  //       shortened: data.shortUrl,
  //     };
  //     setShortenedLinks([...shortenedLinks, newLink]);
  //     setLink("");
  //   } catch (error) {
  //     setError(error.message);
  //   }
  // }

  async function handleShortenLink() {
    try {
      if (!link) {
        throw new Error("Please add a link");
      }

      if (!/^https?:\/\/[^\s]+$/.test(link)) {
        throw new Error("Invalid URL");
      }
      let encodedLink = encodeURIComponent(link);

      setError(""); // Clear previous errors

      // Make API request with Axios
      const response = await axios.post("https://cleanuri.com/api/v1/shorten", {
        url: encodedLink, // CleanURI requires 'url' key
      });

      console.log(response.data); // Log API response

      // Store the shortened URL
      const newLink = {
        original: link,
        shortened: response.data.result_url, // CleanURI returns 'result_url'
      };

      setShortenedLinks([...shortenedLinks, newLink]);
      setLink(""); // Clear input field
    } catch (error) {
      setError(error.response?.data?.error || error.message);
    }
  }

  return (
    <div className="container">
      <HeroSection onGetStarted={handleGetStarted} />
      <AdvancedStatistics shortenedLinks={shortenedLinks}>
        <ShortenBox
          inputRef={inputRef}
          link={link}
          setLink={setLink}
          onShortenLink={handleShortenLink}
          error={error}
        />
      </AdvancedStatistics>
      <BoostSection onGetStarted={handleGetStarted} />
      <FooterSection />
    </div>
  );
}

function HeroSection({ onGetStarted }) {
  const [menuIconClicked, setMenuIconClicked] = useState(false);
  return (
    <div className="hero-section">
      <div className="header">
        <Logo />
        <MdMenu
          className={menuIconClicked ? "nav-icon-clicked" : "nav-icon"}
          onClick={() => setMenuIconClicked(!menuIconClicked)}
        />
        <NavBar menuIconClicked={menuIconClicked} />
      </div>
      <Description>
        <Button className={"btn btn-ellipse"} onClick={onGetStarted}>
          Get Started
        </Button>
      </Description>
    </div>
  );
}

function Logo() {
  return (
    <div className="logo">
      <img src="/assets/images/logo.svg" alt="logo" />
    </div>
  );
}

function NavBar({ menuIconClicked }) {
  const [loginButtonClicked, setLoginButtonClicked] = useState(false);
  const [signupButtonClicked, setSignupButtonClicked] = useState(false);
  return (
    <div
      className={`${
        menuIconClicked ? "navbar navbar-opened" : "navbar navbar-closed"
      }`}
    >
      <ul>
        <li>Features</li>
        <li>Pricing</li>
        <li>Resources</li>
      </ul>
      <div className="btns-navbar">
        <Button
          onClick={() => setLoginButtonClicked(!loginButtonClicked)}
          className={`${
            loginButtonClicked ? "btn-navbar-clicked" : "btn-navbar"
          }`}
        >
          Login
        </Button>
        <Button
          onClick={() => setSignupButtonClicked(!signupButtonClicked)}
          className={`${
            signupButtonClicked ? "btn-navbar-clicked" : "btn-navbar"
          }`}
        >
          Sign Up
        </Button>
      </div>
    </div>
  );
}

function Description({ children }) {
  return (
    <div className="description">
      <img
        src="/assets/images/illustration-working.svg"
        alt="illustration working"
      />
      <div className="description-text">
        <h1>More than just shorter links</h1>
        <p>
          Build your brand’s recognition and get detailed insights on how your
          links are performing.
        </p>
        {children}
      </div>
    </div>
  );
}

function ShortenBox({ inputRef, link, setLink, onShortenLink, error }) {
  return (
    <div className="shorten-box">
      <div className="input-message">
        <input
          className={`shorten-input ${error ? "error" : ""}`}
          type="text"
          placeholder="shorten a link here..."
          ref={inputRef}
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
        {error && <span className="error-message">{error}</span>}
      </div>
      <Button className={"btn btn-rectangle"} onClick={onShortenLink}>
        Shorten It!
      </Button>
    </div>
  );
}

function LinksList({ shortenedLinks }) {
  return (
    <div className="links-list">
      {shortenedLinks.map((link) => (
        <Link
          originalLink={link.original}
          shortenedLink={link.shortened}
          key={link.shortened}
        />
      ))}
    </div>
  );
}

function Link({ originalLink, shortenedLink }) {
  const [copied, setCopied] = useState(false);

  function handleCopy(link) {
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    });
  }
  return (
    <div className="link-box">
      <div className="original-link">
        <a href={originalLink}>{originalLink}</a>
      </div>
      <div className="shortened-link">
        <a href={shortenedLink}>{shortenedLink}</a>
      </div>
      <Button
        className={copied ? "btn-copied" : "btn btn-rectangle"}
        onClick={() => handleCopy(shortenedLink)}
      >
        {copied ? "Copied!" : "Copy"}
      </Button>
    </div>
  );
}
function AdvancedStatistics({ shortenedLinks, children }) {
  return (
    <div className="advanced-statistics">
      {children}
      <LinksList shortenedLinks={shortenedLinks} />
      <h2>Advanced Statistics</h2>
      <p>
        Track how your links are performing across the web with our advanced
        statistics dashboard.
      </p>
      <div className="statistics-list">
        <Statistics
          image={"icon-brand-recognition.svg"}
          header={"Brand Recognition"}
          text={
            "Boost your brand recognition with each click. Generic links don’t mean a thing. Branded links help instil confidence in your content."
          }
          className={"line-after"}
        />
        <Statistics
          image={"icon-detailed-records.svg"}
          header={"Detailed Records"}
          text={
            "Gain insights into who is clicking your links. Knowing when and where people engage with your content helps inform better decisions."
          }
          className={"line-after"}
        />
        <Statistics
          image={"icon-fully-customizable.svg"}
          header={"Fully Customizable"}
          text={
            "Improve brand awareness and content discoverability through customizable links, supercharging audience engagement."
          }
        />
      </div>
    </div>
  );
}

function Statistics({ image, header, text, className }) {
  return (
    <div className="statistics">
      <div className="statistics-image">
        <img src={`/assets/images/${image}`} alt="statistics-image" />
      </div>
      <div className={`statistics-box ${className}`}>
        <h3>{header}</h3>
        <p>{text}</p>
      </div>
    </div>
  );
}

function BoostSection({ onGetStarted }) {
  return (
    <div className="boost">
      <h2>Boost your links today</h2>
      <Button className={"btn btn-ellipse"} onClick={onGetStarted}>
        Get Started
      </Button>
    </div>
  );
}

function FooterSection() {
  return (
    <div className="footer">
      <div className="logo-footer">
        <img src="/assets/images/logo-light.svg" alt="logo-light" />
      </div>
      <div className="links">
        <FooterLinks
          header={"Features"}
          link1={"Link Shortening"}
          link2={"Branded Links"}
          link3={"Analytics"}
        />
        <FooterLinks
          header={"Resources"}
          link1={"Blog"}
          link2={"Developers"}
          link3={"Support"}
        />
        <FooterLinks
          header={"Company"}
          link1={"About"}
          link2={"Our Team"}
          link3={"Careers"}
          link4={"Contact"}
        />
      </div>
      <div className="icons">
        <img src="/assets/images/icon-facebook.svg" alt="facebook" />
        <img src="/assets/images/icon-twitter.svg" alt="twitter" />
        <img src="/assets/images/icon-pinterest.svg" alt="pinterest" />
        <img src="/assets/images/icon-instagram.svg" alt="instagram" />
      </div>
    </div>
  );
}

function FooterLinks({ header, link1, link2, link3, link4 }) {
  return (
    <div>
      <p>{header}</p>
      <ul>
        <li>{link1}</li>
        <li>{link2}</li>
        <li>{link3}</li>
        <li>{link4}</li>
      </ul>
    </div>
  );
}

function Button({ children, className, onClick }) {
  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  );
}

export default App;
