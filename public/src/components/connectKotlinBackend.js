// dependenciees
import axios from "axios"

const connectKotlinBackend = async (config) => {
    return await axios(config)
}

export { connectKotlinBackend }
