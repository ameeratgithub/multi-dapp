import axios from "axios"

export const loadImageFromMetadata = async (jsonUrl) => {
    const res = await axios.get(jsonUrl)
    const { image } = res.data
    return image
}