import Button from "@mui/material/Button";
import { IoSearch } from "react-icons/io5";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';

const SearchBox = () => {

  const [searchField, setSearchField] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onChangeValue = (e) => {
    setSearchField(e.target.value);
  }

  const searchProducts = (e) => {
    if (searchField !== "") {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        navigate(`/search?q=${searchField}`);
      }, 500);
    }
  }

  return (

    <div className="headerSearch ml-3 mr-3">
      <input type="text" placeholder="search products" onChange={onChangeValue} />
      <Button onClick={searchProducts} disabled={isLoading}>
        {
          isLoading === true ? <CircularProgress size={20} color="inherit" /> : <IoSearch />
        }
      </Button>
    </div>
  )
}
export default SearchBox;