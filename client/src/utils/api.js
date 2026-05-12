import axios from "axios";

export const fetchDataFromApi = async (url) => {
    try {
        const { data } = await axios.get(process.env.REACT_APP_BASE_URL + url, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
}

export const postData = async (url, formData) => {
    try {
        const { data } = await axios.post(process.env.REACT_APP_BASE_URL + url, formData, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
        return data;
    } catch (error) {
        console.log(error);
        return error.response ? error.response.data : { error: true, msg: error.message };

    }
}

export const editData = async (url, updatedData) => {
    try {
        const { data } = await axios.put(`${process.env.REACT_APP_BASE_URL}${url}`, updatedData, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
}

export const deleteData = async (url) => {
    try {
        const { data } = await axios.delete(`${process.env.REACT_APP_BASE_URL}${url}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
}