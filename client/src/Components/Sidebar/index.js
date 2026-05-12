import { useEffect, useState, useContext } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import Rating from '@mui/material/Rating';
import { MyContext } from '../../App';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';

const Sidebar = (props) => {
    const context = useContext(MyContext);
    const location = useLocation();
    const { id } = useParams();
    const [value, setvalue] = useState([100, 60000]);
    const [filterSubCat, setFilterSubCat] = useState([]);
    const [radio, setRadio] = useState(null);
    const [subCatId, setSubCatId] = useState('');

    useEffect(() => {
        let categoryId = "";

        if (location.pathname.includes('category')) {
            categoryId = id;
            setRadio(null);
            setSubCatId("");
        }
        if (location.pathname.includes('subCat')) {
            setRadio(id);
            setSubCatId(id);
            // Find the category ID for the current subcategory
            const currentSubCat = context.subCategoryData?.subCategoryList?.find(item => item.id === id);
            categoryId = currentSubCat?.category?.id;
        }

        if (categoryId) {
            const filteredList = context.subCategoryData?.subCategoryList?.filter(item => item.category?.id === categoryId);
            setFilterSubCat(filteredList);
        } else {
            setFilterSubCat(context.subCategoryData?.subCategoryList);
        }

    }, [id, context.subCategoryData, location.pathname]);

    const handleChange = (event) => {
        setRadio(event.target.value);
        props.filterData(event.target.value);
        setSubCatId(event.target.value)
    };

    useEffect(() => {
        props.filterByPrice(value, subCatId);

    }, [value]);

    const filterByRating = (rating) => {
        props.filterByRating(rating, subCatId)
    }

    return (
        <>
            <div className="sidebar">
                <div className="filterBox">
                    <h6>PRODUCT CATEGORIES</h6>

                    <div className='scroll'>
                        <RadioGroup
                            aria-labelledby="demo-controlled-radio-buttons-group"
                            name="controlled-radio-buttons-group"
                            value={radio}
                            onChange={handleChange}
                        >
                            {
                                filterSubCat?.length !== 0 && filterSubCat?.map((item, index) => {
                                    return (
                                        <FormControlLabel key={index} value={item?.id} control={<Radio />} label={item?.subCat} />
                                    )
                                })
                            }

                        </RadioGroup>
                        <ul>


                        </ul>
                    </div>
                </div>


                <div className="filterBox">
                    <h6>FILTER BY PRICE</h6>
                    <RangeSlider value={value} onInput={setvalue} min={100} max={60000} step={5} />
                    <div className='d-flex pt-2 pb-2 pricRange'>
                        <span>From: <strong className='text-success'>Rs:{value[0]}</strong></span>
                        <span className='ml-auto'>To:<strong className='text-dark'>Rs:{value[1]}</strong></span>
                    </div>
                </div>



                <div className="filterBox">
                    <h6>FILTER BY RATING</h6>

                    <div className='scroll pl-0'>
                        {/* <ul>
                            <li>
                                <FormControlLabel className='w-100' control={<Checkbox />} label="Frito Lay" />
                            </li>
                            <li>
                                <FormControlLabel className='w-100' control={<Checkbox />} label="Frito Lay" />
                            </li>
                            <li>
                                <FormControlLabel className='w-100' control={<Checkbox />} label="Frito Lay" />
                            </li>
                            <li>
                                <FormControlLabel className='w-100' control={<Checkbox />} label="Frito Lay" />
                            </li>
                            <li>
                                <FormControlLabel className='w-100' control={<Checkbox />} label="Frito Lay" />
                            </li>
                            <li>
                                <FormControlLabel className='w-100' control={<Checkbox />} label="Nespresso" />
                            </li>
                        </ul> */}
                        <ul>
                            <li onClick={() => filterByRating(5)}>
                                <Rating name="read-only" value={5} readOnly size='small'/>
                            </li>
                            <li onClick={() => filterByRating(4)}>
                                <Rating name="read-only" value={4} readOnly size='small' />
                            </li>
                            <li onClick={() => filterByRating(3)}>
                                <Rating name="read-only" value={3} readOnly size='small' />
                            </li>
                            <li onClick={() => filterByRating(2)}>
                                <Rating name="read-only" value={2} readOnly size='small' />
                            </li>
                            <li onClick={() => filterByRating(1)}>
                                <Rating name="read-only" value={1} readOnly size='small' />
                            </li>
                        </ul>
                    </div>
                </div>

                <Link to="#"><img src='https://klbtheme.com/bacola/wp-content/uploads/2021/05/sidebar-banner.gif' className='w-100' /></Link>

            </div>
        </>
    );
}
export default Sidebar;