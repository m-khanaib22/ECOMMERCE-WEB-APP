import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "https://ecommerce-web-app-production-11c1.up.railway.app";

export const fetchDataFromApi = async (url) => {
    try {
        const { data } = await axios.get(BASE_URL + url, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
        return data;
    } catch (error) {
        console.log("API Fetch Error:", error);
        return { error: true, msg: error.message };
    }
}

export const postData = async (url, formData) => {
    try {
        const { data } = await axios.post(BASE_URL + url, formData, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
        return data;
    } catch (error) {
        console.log("API Post Error:", error);
        return error.response ? error.response.data : { error: true, msg: error.message };
    }
}

export const editData = async (url, updatedData) => {
    try {
        const { data } = await axios.put(`${BASE_URL}${url}`, updatedData, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
        return data;
    } catch (error) {
        console.log("API Edit Error:", error);
        return error.response ? error.response.data : { error: true, msg: error.message };
    }
}

export const deleteData = async (url) => {
    try {
        const { data } = await axios.delete(`${BASE_URL}${url}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
        return data;
    } catch (error) {
        console.log("API Delete Error:", error);
        return error.response ? error.response.data : { error: true, msg: error.message };
    }
}

export const deleteImages = async (url, image) => {
    try {
        const { data } = await axios.delete(`${BASE_URL}${url}`, {
            data: image,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
        return data;
    } catch (error) {
        console.log("API Delete Images Error:", error);
        return error.response ? error.response.data : { error: true, msg: error.message };
    }
}
