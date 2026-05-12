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
const CountryDropdown = (props) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState(null);
  const [countryList, setCountryList] = useState([]);

  const context = useContext(MyContext);
  const selectCountry = (index, country) => {
    setIsOpenModal(false);
    if (props.onChangeLocation) {
        props.onChangeLocation(country);
    }
    context.setselectedCountry(country);
  }
  useEffect(() => {
    setCountryList(props.countryList);
  }, [props.countryList]);

  const filterList = (e) => {
    const keyword = e.target.value.toLowerCase();
    if (keyword !== "") {
      const list = props.countryList.filter((item) => {
        return item.country.toLowerCase().includes(keyword);
      });
      setCountryList(list);
    } else {
      setCountryList(props.countryList);
    }
  };

  return (
    <>
      <Button className="countryDrop " onClick={() => setIsOpenModal(true)}>
        <div className="info d-flex flex-column">
          <span className="lable">your location</span>
          <span className="name">{props.selectedLocation || context.selectedCountry || 'Select Location'}</span>
        </div>
        <span className="ml-auto">
          <FaAngleDown />
        </span>
      </Button>
      <Dialog
        open={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        className="locationModal"
        slots={{ transition: Transition }}
      >
        <h4 className="mb-0">Choose your Delivery Location</h4>
        <p>Enter your address and we will specify the offer for your area.</p>
        <Button className="close_" onClick={() => setIsOpenModal(false)}>
          <IoIosClose />
        </Button>

        <div className="headerSearch w-100">
          <input
            type="text"
            placeholder="search your area"
            onChange={filterList}
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
                  className={`${(props.selectedLocation || context.selectedCountry) === item.country ? "active" : ""}`}
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
