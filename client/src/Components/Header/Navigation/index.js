import Button from "@mui/material/Button";
import { MdOutlineMenu } from "react-icons/md";
import { FaAngleDown } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { FaAngleRight } from "react-icons/fa6";
import { MyContext } from "../../../App";


const Navigation = (props) => {
  const context = useContext(MyContext);
  const [isopenSidebarVal, setisopenSidebarVal] = useState(false);

  return (
    <nav>
      <div className="container">
        <div className="row">
          <div className="col-sm-2 navPart1">
            <div className="catWrapper">
              <Button className="allCatTab align-items-center" onClick={() => setisopenSidebarVal(!isopenSidebarVal)}>
                <span className="icon1 mr-2"><MdOutlineMenu /></span>
                <span class="text">ALL CATEGORIES</span>
                <span className="icon2 ml-2"><FaAngleDown /></span>
              </Button>
              <div className={`sidebarNav ${isopenSidebarVal === true ? 'open' : ''}`}>
                <ul>
                  <li><Link to="/"><Button>Men<FaAngleRight className="ml-auto" /></Button></Link>
                    <div className="submenu">
                      <Link to="/"><Button>Clothing</Button></Link>
                      <Link to="/"><Button>Footwear</Button></Link>
                      <Link to="/"><Button>Watches</Button></Link>
                    </div>
                  </li>
                  <li><Link to="/"><Button>women<FaAngleRight className="ml-auto" /></Button></Link>
                    <div className="submenu">
                      <Link to="/"><Button>fashion</Button></Link>
                      <Link to="/"><Button>cosmetics</Button></Link>
                      <Link to="/"><Button>sandles</Button></Link>
                    </div>
                  </li>
                  <li><Link to="/"><Button>beauty</Button></Link></li>
                  <li><Link to="/"><Button>watches</Button></Link></li>
                  <li><Link to="/"><Button>kids</Button></Link></li>
                  <li><Link to="/"><Button>gift</Button></Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-sm-10 navPart2 d-flex align-items-center">
            <ul className="list list-inline ml-auto">
              <li className="list-inline-item"><Link to="/"><Button>Home</Button></Link></li>
              {
                props.navData?.length !== 0 && props.navData?.map((item, index) => {
                  return (
                    <li className="list-inline-item">
                      <Link to={`/category/${item?.id || item?._id}`}><Button>{item?.name}</Button></Link>
                      <div className="submenu shadow">
                        {
                          context.subCategoryData?.subCategoryList?.filter(subCat => subCat.category?.id === (item?.id || item?._id)).map((subCat, subIndex) => {
                            return (
                              <Link key={subIndex} to={`/subCat/${subCat?.id || subCat?._id}`}><Button>{subCat?.subCat}</Button></Link>
                            )
                          })
                        }
                      </div>
                    </li>
                  )
                })
              }
                
              
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navigation;
