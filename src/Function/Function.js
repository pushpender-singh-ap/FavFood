import axios from "axios";

export const GET = async (url, params) => {

    var data
    await axios
        .get(url, {
            params,
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then(res => {
            data = res
        })
        .catch(error => {
            console.log(`url:- ${url}, error:-`, error);
            data = false
        });
    return data
}