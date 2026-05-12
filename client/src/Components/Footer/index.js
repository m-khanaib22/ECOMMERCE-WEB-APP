import { LuShirt } from "react-icons/lu";
import { TbTruckDelivery } from "react-icons/tb";
import { RiDiscountPercentLine } from "react-icons/ri";
import { MdPriceCheck } from "react-icons/md";
import { Link } from "react-router-dom";
import { FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";
import { FaTwitter } from "react-icons/fa";


const Footer = () => {
    return (
        <footer>
            <div className="container">
                <div className="topInfo row">
                    <div className="col d-flex align-items-center">
                        <span><LuShirt /></span>
                        <span className="ml-2">Everyday fresh products</span>
                    </div>
                
                
                    <div className="col d-flex align-items-center">
                        <span><TbTruckDelivery/></span>
                        <span className="ml-2">Free delivery for order over $70</span>
                    </div>
               
                    <div className="col d-flx align-items-center">
                        <span><RiDiscountPercentLine/></span>
                        <span className="ml-2">Daily Mega Discounts</span>
                    </div>                
                    <div className="col d-flex align-items-center">
                        <span><MdPriceCheck/></span>
                        <span className="ml-2">Best price on the market</span>
                    </div>
                </div>

                <div className="row mt-5 linksWrap" >
                    <div className="col">
                        <h5>FRUIT & VEGETABLES</h5>
                        <ul>
                            <li><Link to="#">FRUIT & VEGETABLES</Link></li>
                            <li><Link to="#">BREAKFAST & DAIRY</Link></li>
                            <li><Link to="#">MEAT & SEAFOOD</Link></li>
                            <li><Link to="#">BEVERAGES</Link></li>
                            <li><Link to="#">BREADS & BAKERY</Link></li>
                        </ul>
                    </div>
                    <div className="col">
                        <h5>BREAKFAST & DAIRY</h5>
                        <ul>
                            <li><Link to="#">FRUIT & VEGETABLES</Link></li>
                            <li><Link to="#">BREAKFAST & DAIRY</Link></li>
                            <li><Link to="#">MEAT & SEAFOOD</Link></li>
                            <li><Link to="#">BEVERAGES</Link></li>
                            <li><Link to="#">BREADS & BAKERY</Link></li>
                        </ul>
                    </div>
                    <div className="col">
                        <h5>MEAT & SEAFOOD</h5>
                        <ul>
                            <li><Link to="#">FRUIT & VEGETABLES</Link></li>
                            <li><Link to="#">BREAKFAST & DAIRY</Link></li>
                            <li><Link to="#">MEAT & SEAFOOD</Link></li>
                            <li><Link to="#">BEVERAGES</Link></li>
                            <li><Link to="#">BREADS & BAKERY</Link></li>
                        </ul>
                    </div>
                    <div className="col">
                        <h5>BEVERAGES</h5>
                        <ul>
                            <li><Link to="#">FRUIT & VEGETABLES</Link></li>
                            <li><Link to="#">BREAKFAST & DAIRY</Link></li>
                            <li><Link to="#">MEAT & SEAFOOD</Link></li>
                            <li><Link to="#">BEVERAGES</Link></li>
                            <li><Link to="#">BREADS & BAKERY</Link></li>
                        </ul>
                    </div>
                    <div className="col">
                        <h5>BREADS & BAKERY</h5>
                        <ul>
                            <li><Link to="#">FRUIT & VEGETABLES</Link></li>
                            <li><Link to="#">BREAKFAST & DAIRY</Link></li>
                            <li><Link to="#">MEAT & SEAFOOD</Link></li>
                            <li><Link to="#">BEVERAGES</Link></li>
                            <li><Link to="#">BREADS & BAKERY</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="copyright mt-3 pt-3 pb-3 d-flex">
                    <p className="mb=0">Copyright 2026 ©. All rights reserved.</p>
                    <ul className="list-inline-item ml-auto mb-0 socials">
                        <li className="list-inline-item">
                            <Link to="#"><FaFacebookF /></Link>
                        </li>
                        <li className="list-inline-item">
                            <Link to="#"><FaTwitter/></Link>
                        </li>
                        <li className="list-inline-item">
                            <Link to="#"><FaInstagram /></Link>
                        </li>
                    </ul>
                </div>


            </div>
        </footer>
    )
};
export default Footer;
