import axios from "axios";

const baseUrl = "/api/aboutvideos";

const aboutVideoService = {
  get: () => {
    const request = axios.get(baseUrl);
    return request.then((response) => response.data);
  },
};

export default aboutVideoService;
