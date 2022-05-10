import axios from "axios"

export const loadImageFromMetadata = async (jsonUrl) => {
    const res = await axios.get(jsonUrl)
    const { image } = res.data
    return image
}
export const loadMetadata = async (jsonUrl) => {
    const res = await axios.get(jsonUrl)
    return res.data
}