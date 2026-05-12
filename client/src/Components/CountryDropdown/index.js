import Button from "@mui/material/Button";
import { FaAngleDown } from "react-icons/fa6";
import Dialog from "@mui/material/Dialog";
import { IoSearch } from "react-icons/io5";
import { IoIosClose } from "react-icons/io";
import { useContext, useEffect, useState } from "react";
import Slide from "@mui/material/Slide";
import React from "react";
import { MyContext } from "../../App";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const CountryDropdown = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState(null);
  const [countryList, setCountryList] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");

  const context = useContext(MyContext);

  const selectCountry = (index, country) => {
    setSelectedTab(index);
    setIsOpenModal(false);
    context.setSelectedCountry(country)
    localStorage.setItem("location", country);
    // window.location.href = "/"; // Removed refresh to allow SPA behavior
    setCountryList([{ country: "All" }, ...context.countryList]);
    setSearchKeyword("");
  }
  useEffect(() => {
    if (context.countryList?.length > 0) {
      setCountryList([{ country: "All" }, ...context.countryList]);
    }
  }, [context.countryList])

  const filterList = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearchKeyword(keyword);
    if (keyword !== "") {
      const list = [{ country: "All" }, ...context.countryList].filter((item) => {
        return item.country.toLowerCase().includes(keyword);
      });
      setCountryList(list);
    } else {
      setCountryList([{ country: "All" }, ...context.countryList]);
    }


  };

  return (
    <>
      <Button className="countryDrop " onClick={() => setIsOpenModal(true)}>
        <div className="info d-flex flex-column">
          <span className="lable">your location</span>
          <span className="name">{context.selectedCountry !== "" ? context.selectedCountry.length > 10 ? context.selectedCountry?.substr(0, 10) + '...' : context.selectedCountry : 'Select Location'}</span>
        </div>
        <span className="ml-auto">
          <FaAngleDown />
        </span>
      </Button>
      <Dialog
        open={isOpenModal}
        onClose={() => {
          setIsOpenModal(false);
          setCountryList([{ country: "All" }, ...context.countryList]);
          setSearchKeyword("");
        }}
        className="locationModal"
        slots={{ transition: Transition }}
      >
        <h4 className="mb-0">Choose your Delivery Location</h4>
        <p>Enter your address and we will specify the offer for your area.</p>
        <Button className="close_" onClick={() => {
          setIsOpenModal(false);
          setCountryList([{ country: "All" }, ...context.countryList]);
          setSearchKeyword("");
        }}>
          <IoIosClose />
        </Button>

        <div className="headerSearch w-100">
          <input
            type="text"
            placeholder="search your area"
            onChange={filterList}
            value={searchKeyword}
          />
          <Button>
            <IoSearch />
          </Button>
        </div>
        <ul className="countryList mt-3">
          {countryList?.length !== 0 && countryList?.map((item, index) => {
            return (
              <li key={index}>
                <Button
                  onClick={() => selectCountry(index, item.country)}
                  className={`${selectedTab === index ? "active" : ""}`}
                >
                  {item.country}
                </Button>
              </li>
            );
          })}
        </ul>
      </Dialog>
    </>
  );
};
export default CountryDropdown;
